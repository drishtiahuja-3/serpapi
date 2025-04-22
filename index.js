import 'dotenv/config'
import express from 'express'
import cors from 'cors';
import axios from 'axios';

const API_KEY = process.env.API_KEY;
const app =express();
app.use(cors())

app.get("/serp-api", async (req, res) => {
    const query = req.query.query;
    const type = req.query.type || "all";
  
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }
  
    let baseUrl = `https://serpapi.com/search.json`;
    let params = {
      engine: "google",
      q: query,
      api_key: API_KEY,
    };
  
    // Add search type filter
    if (type === "images") params.tbm = "isch";
    else if (type === "news") params.tbm = "nws";
    else if (type === "videos") params.tbm = "vid";
  
    try {
      const response = await axios.get(baseUrl, { params });
      const data = response.data;
  
      // Return appropriate data based on type
      if (type === "images") return res.json(data.images_results || []);
      if (type === "news") return res.json(data.news_results || []);
      if (type === "videos") return res.json(data.video_results || []);
      return res.json(data.organic_results || []);
    } catch (error) {
      console.error("Error fetching data from SerpAPI:", error.message);
      res.status(500).json({ error: "Failed to fetch data from SerpAPI" });
    }
  });

app.listen(process.env.PORT || 8000,()=>{
    console.log("Server is listenting at 8000")
});