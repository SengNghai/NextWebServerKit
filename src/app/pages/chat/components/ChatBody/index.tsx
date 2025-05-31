"use client"
import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

interface ChatBodyProps {
    messages: string[];
}

export default function ChatBody({ messages }: ChatBodyProps) {
    // 滚动到底部
    const chatEndRef = useRef<HTMLDivElement>(null);
    // 自动滚动到底部
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    // 新消息时滚到底部
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


 // 点击 `main` 让当前的输入框失去焦点
 const handleBlur = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

    return (
        <main className={styles.chatBody} onTouchStart={handleBlur} onClick={handleBlur}>
            <div className={styles.chatMessages}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles.chatMessage}>{msg}</div>
                ))}
                <div ref={chatEndRef} />
            </div>
        </main>
    );
}