"use client";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
    const list = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        text: `消息 ${i}`,
        sender: i % 2 === 0 ? "me" : "other",
    }));
    const [messages, setMessages] = useState(list);
    const [inputText, setInputText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // **彻底禁用浏览器的滚动**
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.height = "100%";

        const preventGlobalScroll = (event: TouchEvent) => {
            if (!chatRef.current?.contains(event.target as Node)) {
                event.preventDefault();
            }
        };

        document.addEventListener("touchmove", preventGlobalScroll, { passive: false });

        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
            document.body.style.height = "";
            document.removeEventListener("touchmove", preventGlobalScroll);
        };
    }, []);

    const sendMessage = () => {
        if (inputText.trim()) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: Date.now(), text: inputText, sender: "me" }
            ]);
            setInputText("");

            setTimeout(() => {
                chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
            }, 100);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">微信聊天</div>

            <div ref={chatRef} className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-bubble ${msg.sender === "me" ? "sent" : "received"}`}>
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className="chat-input-container">
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="输入消息..."
                />
                <button className="send-button" onClick={sendMessage}>发送</button>
            </div>

            <style jsx>{`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    width: 100%;
                    max-width: 480px;
                    margin: 0 auto;
                    overflow: hidden;
                }

                .chat-header {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    text-align: center;
                    background: #007aff;
                    color: white;
                    font-size: 18px;
                    padding: 10px;
                }

                .chat-messages {
                    margin-top: 50px;
                    flex-grow: 1;
                    padding: 10px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    -webkit-overflow-scrolling: touch;
                }

                .chat-bubble {
                    max-width: 70%;
                    padding: 10px;
                    border-radius: 10px;
                    margin: 5px;
                }

                .sent {
                    align-self: flex-end;
                    background-color: #dcf8c6;
                }

                .received {
                    align-self: flex-start;
                    background-color: #ffffff;
                }

                .chat-input-container {
                    position: fixed;
                    bottom: env(safe-area-inset-bottom, 10px);
                    width: 100%;
                    display: flex;
                    background: white;
                    padding: 10px;
                    border-top: 1px solid #ccc;
                }

                .chat-input {
                    flex: 1;
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }

                .send-button {
                    margin-left: 10px;
                    background: #007aff;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
