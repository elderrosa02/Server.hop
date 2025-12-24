
const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PLACE_ID = 109983668079237; // Steal a Brainrot

let recentServers = [];

app.get("/", async (req, res) => {
  let cursor = "";
  let servers = [];

  try {
    do {
      const r = await fetch(
        `https://games.roblox.com/v1/games/${PLACE_ID}/servers/Public?limit=100` +
        (cursor ? `&cursor=${cursor}` : "")
      );
      const j = await r.json();

      for (const s of j.data || []) {
        if (s.playing > 0 && s.playing < s.maxPlayers && !recentServers.includes(s.id)) {
          servers.push(s.id);
        }
      }

      cursor = j.nextPageCursor;
    } while (cursor && servers.length === 0);

    if (!servers.length) {
      recentServers = [];
      return res.send("NO_SERVER");
    }

    const serverId = servers[Math.floor(Math.random() * servers.length)];
    recentServers.push(serverId);
    if (recentServers.length > 20) recentServers.shift();

    res.send(serverId);
  } catch (e) {
    res.send("ERROR");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("ServerHop rodando!");
});
