const express = require("express");
const WebSocket = require("ws");

const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

let players = {};

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "newPlayer") {
            const playerId = Math.random().toString(36).substr(2, 9);
            players[playerId] = { x: 100, y: 100 };

            ws.send(JSON.stringify({ type: "newPlayer", id: playerId }));
        } else if (data.type === "move" && players[data.id]) {
            players[data.id] = { x: data.x, y: data.y };
        }

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "update", players }));
            }
        });
    });

    ws.on("close", () => {
        // 플레이어 삭제 기능 추가 가능
    });
});

server.listen(3000, () => console.log("Server running on port 3000"));
