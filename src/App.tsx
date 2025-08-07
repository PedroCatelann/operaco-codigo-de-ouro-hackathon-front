import { useRef, useState } from "react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";
import { RiVoiceprintLine } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("treinamento");
  const [message, setMessage] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
      className="text-white flex flex-col min-h-screen min-w-screen overflow-hidden"
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
      <main className="flex-1 px-20 overflow-y-auto">
        {/* Left message */}
        <div className="flex items-start space-x-3 max-w-lg">
          <div
            className="rounded-lg p-3 text-sm max-w-[70%]"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            Olá eu sou xxx para prosseguirmos eu preciso de informação X Y e Z
          </div>
        </div>

        {/* Right message */}
        <div className="flex justify-end items-start space-x-3 w-full">
          <div
            className="rounded-lg p-3 text-sm max-w-[70%] text-right"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting
            Industry.
          </div>
        </div>
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
