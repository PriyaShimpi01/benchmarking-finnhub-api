/**
 * News Sentiment Analysis using NewsData.io & Gemini API
 * Author: Priya Shimpi
 * Description: Fetches recent news for companies and analyzes each article for sentiment using Gemini API.
 * Outputs summary, positives, negatives, and improvement points to Google Sheets.
 */

function fetchAndSummarizeNews() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("NewsResults");
  sheet.clearContents(); // Clear old results
  sheet.appendRow(["Company", "Title", "Summary", "Positive", "Negative", "Improvement", "Source", "Date", "URL"]);

  const newsApiKey = 'YOUR_NEWSDATA_API_KEY'; // NewsData.io API key
  const geminiApiKey = "YOUR_GEMINI_API_KEY"; // Gemini API key

  const inputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inputs");
  const companyList = inputSheet.getRange("A2:A").getValues().flat().filter(name => name); // Get all non-empty names

  companyList.forEach(company => {
    const url = `https://newsdata.io/api/1/news?apikey=${newsApiKey}&q=${company}&language=en&country=us`;

    try {
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());

      if (data && data.results && data.results.length > 0) {
        data.results.forEach(news => {
          const fullText = `${news.title}\n${news.description || ""}`;
          const analysis = getGeminiSentiment(fullText, geminiApiKey); // Call Gemini to analyze

          sheet.appendRow([
            company,
            news.title,
            analysis.summary || "",
            analysis.positive || "",
            analysis.negative || "",
            analysis.improvement || "",
            news.source_id || "",
            news.pubDate || "",
            news.link || ""
          ]);
        });
      } else {
        sheet.appendRow([company, "No news found"]);
      }
    } catch (err) {
      Logger.log(`Error fetching news for ${company}: ${err.message}`);
      sheet.appendRow([company, "Error fetching news"]);
    }
  });
}

function getGeminiSentiment(newsText, geminiApiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

  const prompt = `
Read the following news content and provide:
1. A short summary.
2. Positive aspects (if any).
3. Negative points (if any).
4. Areas of improvement (if any).
News Content: """${newsText}"""
`;

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());

    const fullResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const parsed = parseGeminiResponse(fullResponse);
    return parsed;
  } catch (error) {
    Logger.log("Gemini Error: " + error.message);
    return {
      summary: "Error",
      positive: "",
      negative: "",
      improvement: ""
    };
  }
}

function parseGeminiResponse(text) {
  const summary = text.match(/summary:\s*(.*)/i)?.[1] || "";
  const positive = text.match(/positive.*?:\s*(.*)/i)?.[1] || "";
  const negative = text.match(/negative.*?:\s*(.*)/i)?.[1] || "";
  const improvement = text.match(/improvement.*?:\s*(.*)/i)?.[1] || "";

  return {
    summary: summary.trim(),
    positive: positive.trim(),
    negative: negative.trim(),
    improvement: improvement.trim()
  };
}
