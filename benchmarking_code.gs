/**
 * Company Benchmarking Script using Finnhub API
 * Author: Preeti Priya Shimpi
 * Description: This script fetches a list of peer companies using Finnhub API, 
 * filters them based on industry/location/name, and returns key financial metrics 
 * like market cap and revenue to a Google Sheet.
 */

function fetchCompetitorData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const inputSheet = sheet.getSheetByName("Inputs");
  const outputSheet = sheet.getSheetByName("Results");
  const apiKey = 'YOUR_API_KEY_HERE';

  const inputRange = inputSheet.getDataRange().getValues(); // All rows
  if (inputRange.length < 2) {
    SpreadsheetApp.getUi().alert("Please fill at least one row of CompanyTicker, FilterType, and FilterValue.");
    return;
  }

  outputSheet.clearContents();
  outputSheet.appendRow(["Main Company", "Ticker", "Name", "Country", "Industry", "Market Cap", "Revenue", "Revenue Year"]);

  for (let i = 1; i < inputRange.length; i++) {
    const [company, filterTypeRaw, filterValueRaw] = inputRange[i];
    const filterType = (filterTypeRaw || "").toLowerCase().trim();
    const filterValue = (filterValueRaw || "").toLowerCase().trim();

    if (!company || !filterType || !filterValue) continue;

    try {
      const peersUrl = `https://finnhub.io/api/v1/stock/peers?symbol=${company}&token=${apiKey}`;
      const peersResponse = UrlFetchApp.fetch(peersUrl);
      const peers = JSON.parse(peersResponse.getContentText());

      for (const ticker of peers) {
        try {
          const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`;
          const profile = JSON.parse(UrlFetchApp.fetch(profileUrl).getContentText());

          if (!profile.name) continue;

          let matches = false;
          if (filterType === "industry") {
            matches = (profile.finnhubIndustry || "").toLowerCase().includes(filterValue);
          } else if (filterType === "location") {
            matches = (profile.country || "").toLowerCase().includes(filterValue);
          } else if (filterType === "name") {
            matches = (profile.name || "").toLowerCase().includes(filterValue);
          }

          if (matches) {
            const metricUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=${apiKey}`;
            const metricResponse = UrlFetchApp.fetch(metricUrl);
            const metric = JSON.parse(metricResponse.getContentText());

            const revenue = metric.metric?.revenueTTM || "N/A";
            const revenueYear = metric.metric?.revenueTTM ? "TTM" : "N/A";

            const marketCap = formatNumber(profile.marketCapitalization);
            const revenueFormatted = formatNumber(revenue);

            outputSheet.appendRow([
              company,
              profile.ticker,
              profile.name,
              profile.country,
              profile.finnhubIndustry,
              marketCap,
              revenueFormatted,
              revenueYear
            ]);
          }
        } catch (e) {
          Logger.log(`Error with peer ${ticker} for ${company}: ${e}`);
        }
      }
    } catch (e) {
      Logger.log(`Error fetching peers for ${company}: ${e}`);
    }
  }
}

function formatNumber(value) {
  if (!value || isNaN(value)) return "N/A";
  if (value >= 1e9) return (value / 1e9).toFixed(2) + " B";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + " M";
  return Number(value).toFixed(2);
}
