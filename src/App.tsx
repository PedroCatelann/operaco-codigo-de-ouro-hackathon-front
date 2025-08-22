import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";
import { RiVoiceprintLine } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import { observer } from "mobx-react-lite";
import { chatStore } from "./store/ChatStore";
import type { MessageType } from "./store/ChatStore";
import EmailModal from "./components/EmailModal";

import { LoadingDots } from "./components/LoadingDots";
import Header from "./components/Header";
import { useTheme } from "./contexts/ThemeContext";

const AudioPlayer = ({ blob }: { blob: Blob }) => {
  const { theme } = useTheme();
  const audioUrl = useMemo(() => URL.createObjectURL(blob), [blob]);
  return (
    <div
      className="p-2 rounded-full transition-colors duration-200"
      style={{
        backgroundColor:
          theme === "light" ? "var(--bg-secondary)" : "transparent",
        border: theme === "light" ? "1px solid var(--border-color)" : "none",
      }}
    >
      <audio controls src={audioUrl} style={{ maxWidth: "100%" }} />
    </div>
  );
};

const MemoizedMessages = React.memo(({ messages }: { messages: any[] }) => {
  return (
    <>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`rounded-lg p-3 max-w-xs transition-colors duration-200`}
            style={{
              backgroundColor:
                msg.sender === "user"
                  ? "var(--accent-color)"
                  : "var(--bg-tertiary)",
              color:
                msg.sender === "user"
                  ? "var(--text-primary)"
                  : "var(--text-primary)",
            }}
          >
            {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}
            {msg.pdfFile && (
              <a
                href={URL.createObjectURL(msg.pdfFile)}
                download="document.pdf"
                className="underline text-sm"
              >
                Baixar PDF
              </a>
            )}
            {msg.audioBlob && <AudioPlayer blob={msg.audioBlob} />}
          </div>
        </div>
      ))}
    </>
  );
});
MemoizedMessages.displayName = "MemoizedMessages";

const ChatPage: React.FC = observer(() => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"interview" | "profile">(
    "interview"
  );
  const [message, setMessage] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const messages = chatStore.messages;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Rola para baixo apenas quando o número de mensagens aumenta

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // 📨 Envia a mensagem, PDF ou áudio
  const handleSend = () => {
    console.log(Date.now());
    const newMsg: MessageType = {
      id: Date.now(),
      from: "user",
      text: message || undefined,
      pdfFile: pdfFile || undefined,
      audioBlob: audioBlob || undefined,
      timestamp: new Date(),
    };

    // Usa o MobX para armazenar e enviar para o backend
    chatStore.sendMessageToBackend(newMsg, activeTab, userEmail || "");

    setMessage("");
    setPdfFile(null);
    setAudioBlob(null);
    scrollToBottom();
  };

  // 📎 Captura PDF
  const handleAttach = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setMessage("");
      setAudioBlob(null);
    } else if (file.type === "audio/mpeg") {
      setPdfFile(null);
      setMessage("");
      setAudioBlob(file);
    } else {
      alert("Por favor selecione um arquivo PDF.");
    }
  };

  // 🎤 Inicia/para gravação de áudio
  const handleVoice = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        setMessage("");
        setPdfFile(null);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao acessar o microfone:", err);
    }
  };

  return (
    <div
      className="h-dvh flex flex-col min-w-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {!userEmail && (
        <EmailModal
          onSave={(e) => {
            setUserEmail(e);
            chatStore.setUserEmail(e); // 🔹 importante para abrir o WebSocket
          }}
        />
      )}
      {/* ⬅ modal aparece só sem email */}
      {/* Header */}
      <Header />

      {/* Navigation buttons */}
      <div className="header-navigation">
        <button
          onClick={() => setActiveTab("interview")}
          className={`nav-button ${activeTab === "interview" ? "active" : ""}`}
        >
          Treinamento Para Entrevistas
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`nav-button ${activeTab === "profile" ? "active" : ""}`}
        >
          Otimizador De Perfil
        </button>
      </div>

      {/* Chat area */}
      <main
        className="flex-1 px-4 sm:px-10 lg:px-20 overflow-y-auto flex flex-col gap-4 w-full no-scrollbar transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 w-full text-7xl ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className="rounded-lg p-3 text-sm max-w-[70%] transition-colors duration-200"
              style={{
                backgroundColor: msg.text
                  ? "var(--bg-tertiary)"
                  : "transparent",
                color: "var(--text-primary)",
                textAlign: "left",
                border:
                  msg.text && theme === "light"
                    ? "1px solid var(--border-color)"
                    : "none",
                boxShadow: msg.text ? "0 4px 12px var(--shadow-color)" : "none",
              }}
            >
              {msg.text === "..." ? (
                <p className="whitespace-pre-line h-[15px] min-w-[20px] text-2xl flex items-center justify-center">
                  <LoadingDots />
                </p>
              ) : (
                <p className="whitespace-pre-line">{msg.text}</p>
              )}

              {msg.pdfFile && (
                <div className="flex items-center gap-2">
                  <IoDocumentAttachOutline size={20} />
                  <span>{msg.pdfFile.name}</span>
                </div>
              )}

              {msg.audioBlob && <AudioPlayer blob={msg.audioBlob} />}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>
      {/* Input area */}
      <footer
        className="px-4 sm:px-10 lg:px-20 py-4 sm:py-8 lg:py-12 flex flex-col sm:flex-row items-center sm:space-x-3 gap-3 sm:gap-0 transition-colors duration-300"
        style={{
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <div
          className="flex flex-col relative w-full rounded-md transition-colors duration-200"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            boxShadow: "0 4px 12px var(--shadow-color)",
          }}
        >
          {/* === ÁREA DE EXIBIÇÃO DE ARQUIVO ÁUDIO OU PDF (acima do input) === */}
          {(pdfFile || audioBlob) && (
            <div className="flex gap-4 px-4 py-2 rounded-md max-w-lg">
              {pdfFile && (
                <>
                  <div className="flex gap-2 items-center border px-4 py-2 rounded-2xl">
                    <IoDocumentAttachOutline size={24} />
                    <span className="flex">{pdfFile.name}</span>
                  </div>

                  <button
                    onClick={() => setPdfFile(null)}
                    className="transition-colors duration-200"
                    style={{ color: "var(--text-primary)" }}
                    aria-label="Excluir PDF"
                    title="Excluir PDF"
                  >
                    <FaRegTrashCan size={20} />
                  </button>
                </>
              )}
              {audioBlob && (
                <>
                  <div
                    className="flex gap-2 items-center px-4 py-2 rounded-2xl transition-colors duration-200"
                    style={{
                      border: "1px solid #000000",
                      backgroundColor: "var(--bg-secondary)",
                    }}
                  >
                    <RiVoiceprintLine size={24} />
                    <span className="flex">
                      {`Áudio gravado: ${Math.round(audioBlob.size / 1024)} KB`}
                    </span>
                  </div>

                  <button
                    onClick={() => setAudioBlob(null)}
                    className="transition-colors duration-200"
                    style={{ color: "var(--text-primary)" }}
                    aria-label="Excluir áudio"
                    title="Excluir áudio"
                  >
                    <FaRegTrashCan size={20} />
                  </button>
                </>
              )}
            </div>
          )}
          <div className="flex items-center w-full">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setPdfFile(null);
                setAudioBlob(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 py-6 px-4 rounded-md focus:outline-none transition-colors duration-200"
              style={{
                color: "var(--text-primary)",
                backgroundColor: "var(--bg-tertiary)",
              }}
              placeholder="Type message"
              disabled={!!pdfFile || !!audioBlob || chatStore.loading}
            />
            <button
              type="button"
              onClick={handleSend}
              className="ml-3 mr-6 flex items-center justify-center border-none shadow-none transition-colors duration-200"
              style={{
                color: "var(--text-primary)",
              }}
              disabled={message === "" && !pdfFile && !audioBlob}
            >
              <LuSendHorizontal size={22} />
            </button>
          </div>

          <hr
            className="my-2 mx-4"
            style={{ borderColor: "var(--border-color)" }}
          />
          <div className="flex items-center justify-between gap-2 px-4 py-2">
            {/* Attach PDF */}
            <div className="relative group">
              <label
                className="flex items-center gap-1 border px-4 py-2 rounded-2xl cursor-pointer transition-colors duration-200"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-secondary)",
                  boxShadow: "0 2px 8px var(--shadow-color)",
                }}
              >
                <IoDocumentAttachOutline size={22} /> Attach
                <input
                  type="file"
                  accept="application/pdf, .mp3"
                  onChange={(e) => {
                    handleAttach(e);
                    e.target.value = ""; // permite selecionar o mesmo arquivo novamente
                  }}
                  className="hidden"
                  disabled={!!pdfFile || !!audioBlob || chatStore.loading}
                />
              </label>
              {/* Tooltip */}
              {(pdfFile || audioBlob) && (
                <div
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  {pdfFile
                    ? "Envie ou exclua o arquivo antes de anexar um novo"
                    : "Envie ou exclua o áudio antes de anexar um arquivo"}
                </div>
              )}
            </div>

            {/* Voice */}
            <div className="relative group">
              <button
                onClick={handleVoice}
                className="flex items-center gap-1 border px-4 py-2 rounded-2xl transition-colors duration-200"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-secondary)",
                  boxShadow: "0 2px 8px var(--shadow-color)",
                }}
                disabled={!!pdfFile || !!audioBlob || chatStore.loading}
              >
                <RiVoiceprintLine size={22} />{" "}
                {isRecording ? "Gravando..." : "Voice"}
              </button>
              {/* Tooltip */}
              {(pdfFile || audioBlob) && (
                <div
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  {pdfFile
                    ? "Envie ou exclua o PDF antes de gravar um áudio"
                    : "Envie ou exclua o áudio antes de gravar um novo"}
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default ChatPage;
