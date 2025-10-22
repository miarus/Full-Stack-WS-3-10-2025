//open -e movies.js   //opens TextEdit; then Format → Make Plain Text (Shift+Cmd+T)
                    // or: code movies.js (if VS Code 'code' command is installed)

const express = require("express");
const axios = require("axios");
const app = express();

// Use dynamic PORT in production (Render) and a default for local
const PORT = process.env.PORT || 5050;

const API_KEY = "4545d2ed";    // get it from omdbapi.com/apikey.aspx
const SEARCH = "star wars";
const API_URL = `https://www.omdbapi.com/?s=${encodeURIComponent(SEARCH)}&apikey=${API_KEY}`;

function row(movie) {
  return `
    <tr>
      <td>${movie.Title} (${movie.Year})</td>
      <td>${movie.imdbID}</td>
      <td><img src="${movie.Poster}" width="100" alt="poster"/></td>
    </tr>`;
}

app.get("/", async (req, res) => {
  try {
    const { data } = await axios.get(API_URL);
    console.log(`--- Results for "${SEARCH}" ---`);
    let rows = "";
    

    if (data.Search) {
      data.Search.forEach((m, i) => {
        console.log(`[${i}] ${m.Title} (${m.Year})`);
        rows += row(m);
      });
    } else {
      console.log("No movies found or API error:", data.Error);
      rows = `<tr><td colspan="3">${data.Error || "No results"}</td></tr>`;
    }

    const html = `
      <!doctype html>
      <html><head><meta charset="utf-8"><title>OMDb Results</title></head>
      <body style="font-family:system-ui,Segoe UI,sans-serif;line-height:1.6;padding:16px">
        <h1>OMDb Search: ${SEARCH}</h1>
        <table border="1" cellpadding="8" cellspacing="0">
          <thead><tr><th>Title (Year)</th><th>IMDB ID</th><th>Poster</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body></html>`;
    res.status(200).send(html);
  } catch (e) {
    console.error("API/Server error:", e.message);
    res.status(500).send("Failed to load OMDb data.");
  }
});

app.listen(PORT, "0.0.0.0", () => console.log("Server at http://localhost:" + PORT));           

