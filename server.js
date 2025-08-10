import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";
import { WebSocketServer } from "ws";
import FormData from "form-data";

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
  try {
    const { message, agent, email } = req.body;
    const file = req.files?.[0] || null;

    const endpoint =
      agent === "interview"
        ? `https://webhook.operacaocodigodeouro.com.br/webhook/interview_expert?email=${email}`
        : `https://webhook.operacaocodigodeouro.com.br/webhook/profile_generator?email=${email}`;

    // Headers base
    const headers = {
      Authorization: "Bearer OP_HACKATHON_2025",
      targetHost: "https://237da3f93ec5.ngrok-free.app/callback",
    };

    console.log(endpoint)

    let body;

    if (file) {
      // É um arquivo → enviar como multipart/form-data
      const isAudio = file.fieldname === "audioBlob";
      const isPdf = file.fieldname === "pdfFile";

      if (isAudio) {
        headers.fileType = "audio";
      } else if (isPdf) {
        headers.fileType = "pdf";
      } else {
        return res.status(400).json({ error: "Tipo de arquivo não suportado" });
      }

      const formData = new FormData();
      // Aqui usamos file.buffer direto, sem Blob
      formData.append("file", file.buffer, file.originalname);

      // Mescla headers do FormData com os nossos
      Object.assign(headers, formData.getHeaders());

      body = formData;

    } else if (message) {
      // É texto → enviar JSON
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({ message: { text: message } });
    } else {
      return res.status(400).json({ error: "Nenhuma mensagem ou arquivo enviado" });
    }

    // Envia para o endpoint
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
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
