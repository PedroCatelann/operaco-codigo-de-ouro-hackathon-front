// src/store/ChatStore.ts
import { makeAutoObservable, runInAction } from "mobx";

export interface MessageType {
  id: number;
  from: "user" | "ai";
  text?: string;
  pdfFile?: File;
  audioBlob?: Blob;
  timestamp: Date;
  placeholder?: boolean;
}

class ChatStore {
  messages: MessageType[] = [];
  ws: WebSocket | null = null;
  userEmail: string = "";
  loading: boolean = false;
  isSendFile: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUserEmail(email: string) {
    this.userEmail = email;
    this.connectWebSocket();
  }

  connectWebSocket() {
    if (this.ws) return; // evita duplicar conexões

    this.ws = new WebSocket(`wss://${import.meta.env.VITE_URL_NGROK}`); // troque para ngrok se necessário

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const idx = this.messages.findIndex((msg) => msg.placeholder === true);
        if (idx !== -1) {
          runInAction(() => {
            this.messages[idx] = {
              id: Date.now(),
              from: data.from === "ai" ? "ai" : "user", // segurança
              text: data.text,
              placeholder: false,
              timestamp: new Date(),
            };
            this.loading = false;
          });
        }
      } catch (error) {
        console.error("Erro ao processar mensagem WS:", error);
      }
    };

    this.ws.onerror = (err) => {
      console.error("❌ Erro no WebSocket:", err);
    };

    this.ws.onclose = () => {
      console.warn("⚠️ WebSocket fechado, tentando reconectar...");
      this.ws = null;
      setTimeout(() => this.connectWebSocket(), 3000); // reconexão
    };
  }

  addMessage(message: MessageType) {
    this.messages.push(message);
  }

  async sendMessageToBackend(
    message: MessageType,
    selectedAgent: "interview" | "profile",
    userEmail: string
  ) {
    this.addMessage(message);
    runInAction(() => {
      this.loading = true;
      this.addMessage({
        id: Date.now(),
        from: "ai", // segurança
        text: "...",
        placeholder: true,
        timestamp: new Date(),
      });
    });

    const formData = new FormData();
    formData.append("agent", selectedAgent);
    formData.append("email", userEmail);
    if (message.text) formData.append("message", message.text);
    if (message.pdfFile) formData.append("pdfFile", message.pdfFile);
    if (message.audioBlob) {
      formData.append("audioBlob", message.audioBlob, "audio.webm");
    }
    try {
      await fetch(`https://${import.meta.env.VITE_URL_NGROK}/send-to-agent`, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem para backend:", error);
    }
  }

  get getMessages() {
    return this.messages;
  }
}

export const chatStore = new ChatStore();
