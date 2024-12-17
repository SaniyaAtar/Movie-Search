const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;


app.use(cors());

const OMDB_API_KEY = process.env.OMDB_API_KEY;

app.get("/api/movies", async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: "Title parameter is required." });
  }

  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: OMDB_API_KEY, 
        s: title,             
      },
    });

    if (response.data.Response === "False") {
      return res.status(404).json({ error: response.data.Error });
    }

    res.json(response.data.Search);
  } catch (error) {
    console.error("Error fetching movie data:", error);
    res.status(500).json({ error: "Failed to fetch movie data." });
  }
});

app.get("/api/movie/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: OMDB_API_KEY, 
        i: id,               
      },
    });

    if (response.data.Response === "False") {
      return res.status(404).json({ error: response.data.Error });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({ error: "Failed to fetch movie details." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
