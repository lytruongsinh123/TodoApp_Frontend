import React, { useState } from "react";
import "./AI_Support.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AIChatPopup: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { role: "user", content: input }]);
        setLoading(true);
        setInput("");
        try {
            const res = await fetch(`${backendUrl}/api/ai/general`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                }),
            });
            const data = await res.json();
            setMessages([
                ...messages,
                { role: "user", content: input },
                { role: "ai", content: data.reply || "AI không trả lời." },
            ]);
        } catch {
            setMessages([
                ...messages,
                { role: "user", content: input },
                { role: "ai", content: "Có lỗi xảy ra." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!open && (
                <div className="ai-fab" onClick={() => setOpen(true)}>
                    🤖
                </div>
            )}
            {open && (
                <div
                    className="ai-popup-overlay"
                    onClick={() => setOpen(false)}>
                    <div
                        className="ai-popup"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="ai-popup-header">
                            <span>AI Assistant  🤖</span>
                            <button onClick={() => setOpen(false)}>✖</button>
                        </div>
                        <div className="ai-popup-body">
                            {messages.length === 0 && (
                                <div className="ai-popup-tip">
                                    Please enter your quest question!
                                </div>
                            )}
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`ai-msg ai-msg-${msg.role}`}>
                                    {msg.content}
                                </div>
                            ))}
                            {loading && (
                                <div className="ai-msg ai-msg-ai">
                                    AI is answering...
                                </div>
                            )}
                        </div>
                        <form className="ai-popup-form" onSubmit={handleSend}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter question..."
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatPopup;
