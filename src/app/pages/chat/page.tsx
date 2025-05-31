"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatBody from "./components/ChatBody";
import styles from './styles.module.scss';
import ChatFooter from "./components/ChatFooter";

const RearPage: React.FC = () => {
  const [messages, setMessages] = useState<string[]>(Array.from({ length: 100 }, (_, i) => `消息 ${i + 1}`));
  const [input, setInput] = useState('');
  const [viewportHeight, setViewportHeight] = useState<number>(932);

  const chatEndRef = useRef<HTMLDivElement>(null);


  // 自动滚动到底部
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportHeight(window.innerHeight);
    }
  }, []);


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
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // 发送消息
  const handleSend = (message: string) => {
    setMessages([...messages, message]);
  };

  return (
    <div className={styles.chatContainer} style={{ height: viewportHeight }}>
      {/* 聊天顶部 */}
      <ChatHeader title="Message Me" />

      {/* 聊天内容 */}
      <ChatBody messages={messages} />

      {/* 聊天底部 */}
      <ChatFooter send={handleSend} />
    </div>
  );
};

export default RearPage;