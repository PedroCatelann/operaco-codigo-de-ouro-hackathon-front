import { useState } from "react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";
import { RiVoiceprintLine } from "react-icons/ri";

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("treinamento");
  const [message, setMessage] = useState("");

  return (
    <div
      className="text-white flex flex-col min-h-screen min-w-screen"
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
          <div className="w-10 h-10 rounded-full bg-white flex-shrink-0"></div>
          <div
            className="rounded-lg p-3 text-sm max-w-[70%]"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            Olá eu sou xxx para prosseguirmos eu preciso de informação X Y e Z
          </div>
        </div>

        {/* Right message */}
        <div className="flex items-start space-x-3 max-w-lg ml-auto">
          <div
            className="rounded-lg p-3 text-sm max-w-[70%] text-right"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting
            Industry. Lorem Ipsum Is Simply Dummy Text Of The Printing And
            Typesetting Industry.
          </div>
        </div>
      </main>

      {/* Input area */}
      <footer className="px-20 py-12 flex items-center space-x-3">
        <div
          className="flex flex-col relative w-full rounded-md"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <div className="flex items-center w-full">
            <input
              type="text"
              placeholder="Type message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 py-6 px-4 text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="ml-3 mr-6 text-white flex items-center justify-center border-none shadow-none"
            >
              <LuSendHorizontal size={22} />
            </button>
          </div>

          <hr className="border-gray-400 my-2 mx-4" />
          <div className="flex items-center justify-between gap-2 px-4 py-2">
            <button className="flex items-center gap-1 text-white hover:text-gray-400 border px-4 py-2 rounded-2xl">
              <IoDocumentAttachOutline size={22} /> Attach
            </button>
            <button className="flex items-center gap-1 text-white hover:text-gray-400 border px-4 py-2 rounded-2xl">
              <RiVoiceprintLine size={22} /> Voice
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
