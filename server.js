import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
const upload = multer(); // processa multipart/form-data

// Middleware global apenas para JSON puro (se precisar em outros endpoints)
app.use(cors());

let wsClients = [];

// WebSocket
const wss = new WebSocketServer({ port: 3002 });
wss.on("connection", (ws) => {
  console.log("Frontend conectado via WS");
  wsClients.push(ws);
  ws.on("close", () => {
    wsClients = wsClients.filter(c => c !== ws);
  });
});

// Rota que recebe FormData
app.post("/send-to-agent", upload.any(), async (req, res) => {
  console.log("Body recebido:", req.body);  // ← veja aqui se message chega
  console.log("Arquivos recebidos:", req.files);

  const message = req.body.message;
  const agent = req.body.agent;
  const email = req.body.email;

  const endpoint =
    agent === "interview"
      ? `https://webhook.operacaocodigodeouro.com.br/webhook/interview_expert?email=${email}`
      : `https://webhook.operacaocodigodeouro.com.br/webhook/profile_generator?email=${email}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: "Bearer OP_HACKATHON_2025",
        targetHost: "https://0f6ede52a88a.ngrok-free.app/callback",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: { text: message } }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao enviar para agente" });
  }
});

// Callback da IA
app.use(express.json()); // aqui sim para JSON puro
app.post("/callback", (req, res) => {
  console.log("Recebi callback da IA:", req.body);
  wsClients.forEach(ws => {
    ws.send(JSON.stringify({ from: "ai", text: req.body.text }));
  });
  res.status(200).send("OK");
});

app.listen(3001, () => {
  console.log("Servidor HTTP rodando na porta 3001");
});
