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
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl p-8 shadow-lg w-[90%] max-w-md transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxShadow: '0 10px 25px var(--shadow-color)' }}>
        <h2 className="text-xl font-bold mb-4">
          Digite seu e-mail para continuar
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none transition-colors duration-200"
            style={{ 
              borderColor: 'var(--border-color)', 
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)'
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md transition-colors duration-200"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
