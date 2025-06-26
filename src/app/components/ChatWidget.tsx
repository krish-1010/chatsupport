"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: data.reply || "Sorry, no answer.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: "Sorry, something went wrong.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    setLoading(false);
  }

  return (
    <>
      {!open && (
        <button
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-all duration-200"
          onClick={() => setOpen(true)}
        >
          <MessageCircle size={30} className="text-white" />
        </button>
      )}
  
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[92vw] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
         
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-lg text-blue-700 flex items-center gap-2">
              <MessageCircle size={22} /> Loyolite
            </span>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="hover:bg-gray-100 p-1 rounded-full transition"
            >
              <X size={22} />
            </button>
          </div>
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-2"
            style={{ minHeight: 220, maxHeight: 340 }}
          >
            {messages.length === 0 && (
              <div className="text-gray-400 text-center mt-8 text-sm">
                👋 Hi! Ask me anything about Loyola College.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-xl px-3 py-2 text-sm max-w-[82%] shadow 
                    ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-gray-200 text-gray-900 rounded-bl-md"
                    }`}
                >
                  {msg.text}
                  <div className="text-[10px] mt-1 opacity-70 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form
            className="flex items-center border-t px-3 py-2 gap-2 bg-white"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 border-none focus:ring-0 outline-none text-gray-800 bg-transparent placeholder-gray-400"
              placeholder="Type your question…"
              maxLength={500}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`transition p-2 rounded-full ${
                loading || !input.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              aria-label="Send"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
      <style>{`
        .animate-fade-in {
          animation: fadeInUp .23s cubic-bezier(.16,1,.3,1);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(32px) scale(.96);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
      `}</style>
    </>
  );
}
