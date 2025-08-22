// src/store/ChatStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import { Client } from "@stomp/stompjs";

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
  stompClient: Client | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUserEmail(email: string) {
    this.userEmail = email;
    this.connectWebSocket();
  }

  connectWebSocket() {
    if (this.stompClient) return;

    this.stompClient = new Client({
      brokerURL: `wss://${import.meta.env.VITE_URL_NGROK}/ws`,
      //debug: (str) => console.log("[STOMP]", str),
      reconnectDelay: 3000,
      onConnect: () => {
        this.stompClient?.subscribe("/topic/ai", (message) => {
          try {
            const data = JSON.parse(message.body);
            const idx = this.messages.findIndex(
              (msg) => msg.placeholder === true
            );
            if (idx !== -1) {
              runInAction(() => {
                this.messages[idx] = {
                  id: Date.now(),
                  from: data.from === "ai" ? "ai" : "user",
                  text: data.text,
                  placeholder: false,
                  timestamp: new Date(),
                };
                this.loading = false;
              });
            }
          } catch (error) {
            console.error("Erro ao processar mensagem STOMP:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("❌ Erro no STOMP:", frame);
      },
    });

    this.stompClient.activate();
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

    await this.delay(1000);

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

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  get getMessages() {
    return this.messages;
  }
}

export const chatStore = new ChatStore();
