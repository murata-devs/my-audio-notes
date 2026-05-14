function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  // WebアプリのURLをフロントエンドに渡す
  template.WEB_APP_URL = ScriptApp.getService().getUrl();
  return template.evaluate()
    .setTitle('講義音声ノートAI')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  try {
    // 1. リクエストボディの取得 (text/plainで送信されるためパース)
    var postData = JSON.parse(e.postData.contents);
    var textMessage = postData.message || "この音声を文字起こししてください。";
    var audioData = postData.audioData;
    var mimeType = postData.mimeType || "audio/mp3";
    
    // 2. APIキーを取得 (フロントから渡されたもの、無ければPropertiesServiceから)
    var apiKey = postData.apiKey || PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error("APIキーが設定されていません。");
    }
    
    // 3. Geminiモデルの設定
    // 1.5系はすでに非推奨・削除されているため、2026年現在の安定版「gemini-2.5-flash」を指定します。
    var model = "gemini-2.5-flash"; 
    var url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;
    
    // Payloadの構築
    var parts = [];
    parts.push({ "text": textMessage });
    
    if (audioData) {
      parts.push({
        "inlineData": {
          "mimeType": mimeType,
          "data": audioData
        }
      });
    }
    
    var payload = {
      "contents": [
        {
          "parts": parts
        }
      ],
      "system_instruction": {
        "parts": [
          { "text": "あなたはプロの編集者です。提供された情報を極めて厳格に、指定された形式のみで出力してください。挨拶、前置き、タイトル、解説などは一切含めないでください。指示されたフォーマット以外のテキストは1文字も出力してはいけません。" }
        ]
      }
    };
    
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };
    
    // 4. UrlFetchAppでGemini APIへリクエスト
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();
    
    if (responseCode !== 200) {
      throw new Error("Gemini API Error: " + responseBody);
    }
    
    var json = JSON.parse(responseBody);
    var generatedText = json.candidates[0].content.parts[0].text;
    
    // 5. クライアントへ成功レスポンスを返す
    var result = {
      success: true,
      data: generatedText
    };
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラー時のレスポンス
    var errResult = {
      success: false,
      error: error.toString()
    };
    return ContentService.createTextOutput(JSON.stringify(errResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
