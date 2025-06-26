// server.js
const express = require("express");
const cors    = require("cors");
const db      = require("./db");
const scanNetwork = require("./scanner");
const { Parser }  = require("json2csv");
const http = require("http");
const { Server } = require("socket.io");

/* 1. --- Express + middlewares --- */
const app  = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // se precisar receber JSON no corpo

/* 2. --- HTTP server + Socket.io --- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }      // coloque http://localhost:3000 se quiser restringir
});

/* 3. --- WebSocket: conexão --- */
io.on("connection", (socket) => {
  console.log("🔌 Novo cliente conectado:", socket.id);
});

/* 4. --- Rotas --- */

// Escaneia a rede, salva, devolve e EMITE via WebSocket
app.get("/impressoras", async (req, res) => {
  try {
    const results = await scanNetwork();

    // Emite cada impressora encontrada para todos os clientes
    results.forEach((imp) => {
      io.emit("nova-impressora", imp);
    });

    res.json(results);
  } catch (err) {
    console.error("Erro em /impressoras:", err);
    res.status(500).send("Erro no servidor.");
  }
});

// Histórico filtrado
app.get("/historico", (req, res) => {
  const { inicio, fim, ip, minimo_paginas } = req.query;

  let query = "SELECT * FROM impressoras WHERE 1=1";
  const params = [];

  if (inicio && fim) {
    query += " AND data_detectada BETWEEN ? AND ?";
    params.push(`${inicio} 00:00:00`, `${fim} 23:59:59`);
  }
  if (ip)            { query += " AND ip LIKE ?";         params.push(`%${ip}%`); }
  if (minimo_paginas){ query += " AND pageCount >= ?";    params.push(+minimo_paginas); }

  query += " ORDER BY data_detectada DESC";

  db.query(query, params, (err, rows) => {
    if (err) {
      console.error("Erro ao buscar histórico:", err);
      return res.status(500).send("Erro no servidor.");
    }
    res.json(rows);
  });
});

// Download CSV
app.get("/historico/csv", (req, res) => {
  const { inicio, fim, ip, minimo_paginas } = req.query;

  let query = "SELECT * FROM impressoras WHERE 1=1";
  const params = [];

  if (inicio && fim) {
    query += " AND data_detectada BETWEEN ? AND ?";
    params.push(`${inicio} 00:00:00`, `${fim} 23:59:59`);
  }
  if (ip)            { query += " AND ip LIKE ?";         params.push(`%${ip}%`); }
  if (minimo_paginas){ query += " AND pageCount >= ?";    params.push(+minimo_paginas); }

  query += " ORDER BY data_detectada DESC";

  db.query(query, params, (err, rows) => {
    if (err) {
      console.error("Erro ao gerar CSV:", err);
      return res.status(500).send("Erro no servidor.");
    }
    const csv = new Parser({ fields: ["ip", "pageCount", "data_detectada"] }).parse(rows);
    res.header("Content-Type", "text/csv");
    res.attachment("historico_impressoras.csv");
    res.send(csv);
  });
});

/* 5. --- Inicia servidor HTTP + WebSocket --- */
server.listen(PORT, () => {
  console.log(`🚀 Backend + WebSocket rodando em http://localhost:${PORT}`);
});
