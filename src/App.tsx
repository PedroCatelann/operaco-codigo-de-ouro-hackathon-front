import { useEffect, useRef, useState } from "react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";
import { RiVoiceprintLine } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";

export default function ChatPage() {
  type MessageType = {
    id: number;
    from: "user" | "ai";
    text?: string;
    pdfFile?: File; // remover o string
    audioBlob?: Blob; // remover o string
    timestamp: Date;
  };

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [activeTab, setActiveTab] = useState("treinamento");
  const [message, setMessage] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const messagess: MessageType[] = [
    {
      id: 1,
      from: "ai",
      text: "Olá, eu sou o agente IA. Como posso ajudar?",
      timestamp: new Date(),
    },
    {
      id: 2,
      from: "user",
      text: "Oi! Gostaria de saber como funciona o chat.",
      timestamp: new Date(),
    },
    {
      id: 3,
      from: "ai",
      text: "Claro! Você pode me fazer perguntas ou enviar arquivos para análise.",
      timestamp: new Date(),
    },
    {
      id: 4,
      from: "user",
      text: "Posso enviar PDFs aqui?",
      timestamp: new Date(),
    },
    {
      id: 5,
      from: "ai",
      text: "Sim, você pode enviar PDFs e eu analisarei o conteúdo para você.",
      timestamp: new Date(),
    },
    {
      id: 6,
      from: "user",
      text: "E se eu quiser ouvir a resposta em áudio?",
      timestamp: new Date(),
    },
    {
      id: 7,
      from: "ai",
      text: "Eu também consigo gerar respostas em áudio. Basta pedir!",
      timestamp: new Date(),
    },
    {
      id: 8,
      from: "user",
      text: "Muito bom! Isso vai me ajudar bastante nos estudos.",
      timestamp: new Date(),
    },
    {
      id: 9,
      from: "ai",
      text: "Fico feliz em ajudar. Quer fazer um teste agora?",
      timestamp: new Date(),
    },
    {
      id: 10,
      from: "user",
      text: "Sim, me envie uma pergunta de múltipla escolha sobre história.",
      timestamp: new Date(),
    },
    {
      id: 11,
      from: "ai",
      text: "Claro! Qual foi o ano da Proclamação da República no Brasil?",
      timestamp: new Date(),
    },
    {
      id: 12,
      from: "user",
      text: "1889.",
      timestamp: new Date(),
    },
    {
      id: 13,
      from: "ai",
      text: "Correto! Você está indo muito bem.",
      timestamp: new Date(),
    },
    {
      id: 14,
      from: "user",
      text: "Você pode me enviar outra pergunta?",
      timestamp: new Date(),
    },
    {
      id: 15,
      from: "ai",
      text: "Qual era o nome do imperador do Brasil antes da república?",
      timestamp: new Date(),
    },
    {
      id: 16,
      from: "user",
      text: "Dom Pedro II.",
      timestamp: new Date(),
    },
    {
      id: 17,
      from: "ai",
      text: "Perfeito! Suas respostas estão excelentes.",
      timestamp: new Date(),
    },
    {
      id: 18,
      from: "user",
      text: "Obrigado! Isso está sendo muito útil.",
      timestamp: new Date(),
    },
    {
      id: 19,
      from: "ai",
      text: "De nada! Me avise quando quiser continuar.",
      timestamp: new Date(),
    },
    {
      id: 20,
      from: "user",
      text: "Pode deixar, até logo!",
      timestamp: new Date(),
    },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📨 Envia a mensagem, PDF ou áudio
  const handleSend = () => {
    if (message) {
      console.log("Enviando mensagem:", message);
    } else if (pdfFile) {
      console.log("Enviando PDF:", pdfFile.name);
    } else if (audioBlob) {
      console.log("Enviando áudio:", audioBlob);
    } else {
      console.warn("Nada para enviar");
    }

    const newMsg: MessageType = {
      id: Date.now(), // id simples baseado no timestamp
      from: "user",
      text: message || undefined,
      pdfFile: pdfFile || undefined,
      audioBlob: audioBlob || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);

    setMessage("");
    setPdfFile(null);
    setAudioBlob(null);
  };

  // 📎 Captura PDF
  const handleAttach = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setMessage("");
      setAudioBlob(null);
    } else {
      alert("Por favor selecione um arquivo PDF.");
    }
  };

  // 🎤 Inicia/para gravação de áudio
  const handleVoice = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
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
      className="text-white flex flex-col h-screen min-w-screen"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 shadow-lg shadow-gray-500/50">
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14l6.16-3.422a12.083 12.083 0 01.84 4.393v3.246l-7 3-7-3v-3.246a12.083 12.083 0 01.84-4.393L12 14z"
            />
          </svg>
          <h2 className="text-xl">
            Operação <span className="font-bold">Código de ouro</span>
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <span className="whitespace-nowrap">Aline Moraes</span>
          <button className="ml-1 text-white text-xl">▾</button>
        </div>
      </header>

      {/* Toggle buttons */}
      <div className="flex justify-center space-x-4 py-6 px-4">
        <button
          onClick={() => setActiveTab("treinamento")}
          className={`px-6 py-2 rounded-full border border-gray-500 text-sm font-medium transition-colors duration-200 ${
            activeTab === "treinamento"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          Treinamento Para Entrevistas
        </button>
        <button
          onClick={() => setActiveTab("otimizador")}
          className={`px-6 py-2 rounded-full border border-gray-500 text-sm font-medium transition-colors duration-200 ${
            activeTab === "otimizador"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          Otimizador De Perfil
        </button>
      </div>

      {/* Chat area */}
      <main className="flex-1 px-20 overflow-y-auto flex flex-col gap-4 w-full no-scrollbar">
        {messagess.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 w-full ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className="rounded-lg p-3 text-sm max-w-[70%] text-white"
              style={{
                backgroundColor: msg.from === "user" ? "#1a1a1a" : "#333333",
                textAlign: msg.from === "user" ? "right" : "left",
              }}
            >
              {msg.text && <p>{msg.text}</p>}

              {msg.pdfFile && (
                <div className="flex items-center gap-2">
                  <IoDocumentAttachOutline size={20} />
                  <span>{msg.pdfFile.name}</span>
                </div>
              )}

              {msg.audioBlob && (
                <audio controls src={URL.createObjectURL(msg.audioBlob)} />
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>

      {/* Input area */}
      <footer className="px-20 py-12 flex items-center space-x-3">
        <div
          className="flex flex-col relative w-full rounded-md"
          style={{ backgroundColor: "#1a1a1a" }}
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
                    className="text-white hover:text-gray-400"
                    aria-label="Excluir PDF"
                    title="Excluir PDF"
                  >
                    <FaRegTrashCan size={20} />
                  </button>
                </>
              )}
              {audioBlob && (
                <>
                  <div className="flex gap-2 items-center border px-4 py-2 rounded-2xl">
                    <RiVoiceprintLine size={24} />
                    <span className="flex">
                      {`Áudio gravado: ${Math.round(audioBlob.size / 1024)} KB`}
                    </span>
                  </div>

                  <button
                    onClick={() => setAudioBlob(null)}
                    className="text-white hover:text-gray-400"
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
              placeholder="Type message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setPdfFile(null);
                setAudioBlob(null);
              }}
              className="flex-1 py-6 px-4 text-white placeholder-white rounded-md focus:outline-none"
              disabled={!!pdfFile || !!audioBlob}
            />
            <button
              type="button"
              onClick={handleSend}
              className="ml-3 mr-6 text-white flex items-center justify-center border-none shadow-none"
            >
              <LuSendHorizontal size={22} />
            </button>
          </div>

          <hr className="border-gray-400 my-2 mx-4" />
          <div className="flex items-center justify-between gap-2 px-4 py-2">
            {/* Attach PDF */}
            <div className="relative group">
              <label className="flex items-center gap-1 text-white hover:text-gray-400 border px-4 py-2 rounded-2xl cursor-pointer">
                <IoDocumentAttachOutline size={22} /> Attach
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleAttach}
                  className="hidden"
                  disabled={!!pdfFile || !!audioBlob}
                />
              </label>
              {/* Tooltip */}
              {(pdfFile || audioBlob) && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {pdfFile
                    ? "Envie ou exclua o PDF antes de anexar um novo"
                    : "Envie ou exclua o áudio antes de anexar um PDF"}
                </div>
              )}
            </div>

            {/* Voice */}
            <div className="relative group">
              <button
                onClick={handleVoice}
                className="flex items-center gap-1 text-white hover:text-gray-400 border px-4 py-2 rounded-2xl"
                disabled={!!pdfFile || !!audioBlob}
              >
                <RiVoiceprintLine size={22} />{" "}
                {isRecording ? "Gravando..." : "Voice"}
              </button>
              {/* Tooltip */}
              {(pdfFile || audioBlob) && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
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
}
