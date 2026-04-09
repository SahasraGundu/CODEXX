import { useState } from "react";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/ai-chat`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`   // ✅ IMPORTANT
    },
    body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([...messages, { user: input, ai: data.reply }]);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col text-sm">
      
      {/* HEADER */}
      <div className="text-[#17E1FF] font-semibold mb-2">
        🤖 AI Chat
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-2 pr-1">
        {messages.map((m, i) => (
          <div key={i}>
            <div className="text-right text-[#17E1FF] text-xs">
              You: {m.user}
            </div>
            <div className="text-white/80 text-xs bg-white/5 p-2 rounded-lg">
              {m.ai}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded-lg bg-black/30 border border-white/10 text-white outline-none"
          placeholder="Ask AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="px-3 py-2 bg-[#17E1FF] text-black rounded-lg font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}