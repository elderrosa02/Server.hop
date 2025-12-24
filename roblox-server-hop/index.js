const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PLACE_ID = 109983668079237; // Steal a Brainrot

// ⚠️ COLE SEU COOKIE AQUI
const ROBLOX_COOKIE = "|_CAEaAhADIhsKBGR1aWQSEzQ2Mjg4OTA4MTA4OTM1MTUxOTIoAw.nLCtHTMgOMQobrR6T2KHoZ3evHTHqDTE1BYyDwlftolTE2hg5lwEpdN7hzqTl3UyNvqGkd7C51p7GdIaJHYAZ-qDiyWKM6vvv7k7UJsq9ZpAXUOLSa_Sx7CGo5JUUhH2D4rEHg7ozC145dl0iUXUl4FqvHee6ycQcjCglxLLkByktBQptXSSoUQt5pD_GLqtB-iQBu_rOQzFHsBPgKdvnGOMHA8i4X3bUFVSHwXtqX8iJK8Yad6FS01q0XBNC8IItOsYDz2p0m3CrYSZSzfOhLSTbkB-cfE4K8f6v0DIy3NVlWj_IhNWj875pFNpwDCVWUCxVNMlsO-lI1rMyLh42o8OSeAD5R_XMA4tpYV6MBbzV3OQ7iGcOIFpTVRL7s9hzLLYeG-wJuEchrTInk0JehLDy2jygcLDe3D6DxE5782t6bP4seB7Q1cV3k0cQxPOOlbilyYFD-D7fGwZ9BOLcngcDdgLncdDRkKYE9JX7SbR8Z7zumP5Nnfh3-aGqDDye-h8UHndjWW8VF_A2BjatIFf8YEnhAg7JTcXvzoWnvn5vng5R8AbRByXdCZ8ET8jBAtPd5C1vDjYVdSPdwLwxzCkcfFTRKNgbrNMyYUtghiLkmG8HS-nDnqlh8rGUnNMwaoJDn93GGTcv8uV620qdvnTzBBoXXZ802cX3osqXbyuTOXM7dvZcyVcN7zIvqsuDx3PVRk_8CUSvPVEAIkvLU_kfun3ZJq8VgOb0EUatdhysyGd4xi1ICuGTOdB9zcpUgb9UQK0KZzh9ZDqkmQPX0f6piV8WjHDXFzX885ABTSCcl6h";

let recentServers = [];

app.get("/", async (req, res) => {
  let cursor = "";
  let servers = [];

  try {
    do {
      const r = await fetch(
        `https://games.roblox.com/v1/games/${PLACE_ID}/servers/Public?limit=100` +
        (cursor ? `&cursor=${cursor}` : ""),
        {
          headers: {
            "Cookie": ROBLOX_COOKIE,
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json"
          }
        }
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
