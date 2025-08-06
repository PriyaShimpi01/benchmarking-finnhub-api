# benchmarking-finnhub-api

# benchmarking-finnhub-api

# 📊 Competitor Benchmarking Dashboard

**Built using:** Google Sheets, Google Looker Studio, Apps Script, and Finnhub API
**Use Case:** Market & competitor analysis for any company, enriched with live market cap, revenue, and sentiment insights.

---

## 🔍 Overview

This dashboard helps users:

* Compare **market cap** and **revenue** across industry competitors.
* Filter by company **name**, **ticker**, or **industry**.
* Visualize benchmarking via intuitive **bar charts**.
* Analyze real-time **sentiment** from news headlines (optional integration).

> Ideal for startups, investors, students, and product strategists.

---

## 📁 Features

### ✅ Competitor Analysis Table

* Displays competitors’ info: `Name`, `Ticker`, `Industry`, `Market Cap`, `Revenue`
* Dynamically filters based on selected company

### 📊 Visual Benchmarking

* **Market Cap Bar Chart**
* **Revenue Bar Chart**
* Sorted insights to understand the company’s relative performance

### 📰 News Sentiment (Optional)

* Summarizes news articles using Gemini / GPT API
* Sentiment tagged as Positive, Negative, and Suggestions


## 📂 Files & Structure

```
.
├── Code/
│   ├── benchmark.gs        # Apps Script for company data fetching
│   ├── news_sentiment.gs   # Apps Script for summarizing news via Gemini
├── Google_Sheet_Link       # Used as datasource for Looker Studio
├── Looker Studio Dashboard # Final frontend
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. 🗃️ Create Google Sheet

* Columns required: `Main Company`, `Name`, `Ticker`, `Country`, `Industry`, `Market Cap`, `Revenue`, `Revenue Year`
* Sheet Tabs: `BenchmarkResults`, `NewsResults` (if using sentiment)

---

### 2. 🧠 Apps Script: Benchmarking

```js
// benchmark.gs
function fetchBenchmarkData() {
  // Uses Finnhub Company Peer & Metric APIs
  // Populates company benchmarking table in Google Sheets
}
```

**Steps:**

* Go to **Extensions > Apps Script** in your Sheet.
* Paste the `benchmark.gs` code.
* Add your **Finnhub API key**.
* Run `fetchBenchmarkData()`.

---

### 3. 🧠 Apps Script: News Summarization (Optional)

```js
// news_sentiment.gs
function fetchAndSummarizeNews() {
  // Uses News API + Gemini summarizer
  // Adds sentiment to NewsResults sheet
}
```

* Run this script manually or automate it using **Triggers**.

---

### 4. 📊 Create Looker Studio Dashboard

* Connect the Google Sheet as the **data source**.
* Add filters for:

  * `FilterType`: \[name, industry]
  * `CompanyTicker`
  * `FilterValue`

**Visual Elements:**

* Dynamic Table for Competitor Analysis
* Bar Chart for Market Cap
* Bar Chart for Revenue
* Optional: Sentiment Score Pie Chart or Table

---

## 🔁 Common Issues

| Problem                         | Cause                                   | Fix                                             |
| ------------------------------- | --------------------------------------- | ----------------------------------------------- |
| ⚠️ Some data not visible        | Null values or sheet sync delay         | Refresh Looker Studio & check for empty rows    |
| ❌ Error ID: `17bb1b4d`          | Sheet not accessible or deleted columns | Reconnect data source and ensure proper sharing |
| ❌ Market Cap or Revenue missing | API call limit or company mismatch      | Use correct ticker; check Finnhub quota         |

---

## 💡 Suggested Improvements

* ✅ Add **sentiment score column** for easier filtering
* 🎨 Improve chart coloring (e.g., green for growth)
* 📈 Add trendline over time (if using time-series data)
* ⏰ Automate fetch scripts via triggers
* 🔐 Hide API keys using Properties Service

---

## 🧪 Sample Use Case

* Selected Company: `TSLA`
* Industry: `Automobile`
* Results: GM, Ford, Lucid, Rivian, etc.
* Benchmarked on Market Cap & Revenue
* News showing latest events influencing performance

---

## 🔐 API Keys Used

* **Finnhub API**: For peers, company profiles, and news
* **Gemini (Google AI)** *(Optional)*: For summarizing news articles.

## Competitor Benchmarking Dashboard

This project visualizes company-level financial data using Google Sheets and Looker Studio.

### 🔗 Data Source
[📄 View Company Benchmarking Google Sheet](https://docs.google.com/spreadsheets/d/1OO91n_b7j71uuOcej4kJNbUeoQNYEsMfWotEWjYPMs0/edit?usp=sharing)
[📄 View NewsSentiment Google Sheet](https://docs.google.com/spreadsheets/d/1z6X3QzcoKGqnV5DYLJUa29bWl_UzEmzA7fFD0AcPLH8/edit?usp=sharing)

### 📊 Live Dashboard
[📈 View Interactive Dashboard](https://lookerstudio.google.com/s/v16o1uq_HZ8)

### 🧾 Features
- Dynamic filters (Company, Industry, Country)
- Market Cap & Revenue Comparison
- Realtime updates from Google Sheets


Feel free to fork, clone, or customize the project.
Happy Coding!

