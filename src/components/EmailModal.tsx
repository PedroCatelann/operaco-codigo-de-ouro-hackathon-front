import { useState } from "react";

interface EmailModalProps {
  onSave: (email: string) => void;
}

export default function EmailModal({ onSave }: EmailModalProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }
    onSave(email.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-2xl p-8 shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Digite seu e-mail para continuar
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
