
"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

const RearPage: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([
        '你好！',
        '这是聊天页面。',
        '欢迎加入对话！'
    ]);
    const [input, setInput] = useState('');
    const [viewportHeight, setViewportHeight] = useState<number>(600);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatBodyRef = useRef<HTMLDivElement>(null);

    // 自动滚动到底部
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 新消息时滚到底部
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 监听窗口高度变化（解决软键盘遮挡问题）
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setViewportHeight(window.innerHeight);
            };
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // 发送消息
    const handleSend = () => {
        if (input.trim() === '') return;
        setMessages([...messages, input]);
        setInput('');
    };

    return (
        <div className={styles.chatContainer} style={{ height: viewportHeight }}>
            <header className={styles.chatHeader}>聊天页</header>

            <main className={styles.chatBody} ref={chatBodyRef}>
                <div className={styles.chatMessages}>
                    {messages.map((msg, index) => (
                        <div key={index} className="chat-message">{msg}</div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
            </main>

            <footer className={styles.chatFooter}>
                <input
                    type="text"
                    className={styles.chatInput}
                    placeholder="输入消息..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className={styles.chatSendBtn} onClick={handleSend}>发送</button>
            </footer>
        </div>
    );
};

export default RearPage;