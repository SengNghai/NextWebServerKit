import { useRef, useState } from "react";
import styles from "./styles.module.scss";

interface ChatFooterProps {
  send: (message: string) => void;
}

export default function ChatFooter({ send }: ChatFooterProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = () => {
    if (input.trim() === "") return;
    send(input);
    setInput("");

    // **重新聚焦输入框，确保键盘保持打开**
    setTimeout(() => {
      inputRef.current?.focus();
      
    }, 10);
  };

  return (
    <footer className={styles.chatFooter}>
      <input
        ref={inputRef}
        type="text"
        className={styles.chatInput}
        placeholder="输入消息..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button className={styles.chatSendBtn} onClick={handleSend}>
        发送
      </button>
    </footer>
  );
}
