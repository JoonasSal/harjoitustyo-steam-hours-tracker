require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;

app.use(cors());

app.get('/fetchSteamData', async (req, res) => {
  const steamId = req.query.steamid;
  const apiKey = process.env.STEAM_API_KEY;
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=true&include_played_free_games=true`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send(error.toString());
  }
});

app.get('/gameDetails/:appId', async (req, res) => {
  const appId = req.params.appId;
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`;

  try {
      const apiResponse = await fetch(url);
      const data = await apiResponse.json();
      res.json(data[appId]);
  } catch (error) {
      console.error('Error fetching game details from Steam:', error);
      res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});