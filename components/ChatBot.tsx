
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { createChat, getChatBotResponse } from '../services/geminiService';
import { Chat } from '@google/genai';
import Loader from './common/Loader';

const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'ai', text: '안녕하세요! 오늘 당신의 마음챙김 여정에 어떤 도움을 드릴까요?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        chatRef.current = createChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !chatRef.current) return;
        
        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await getChatBotResponse(chatRef.current, input);
            const aiMessage: ChatMessage = { sender: 'ai', text: responseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: ChatMessage = { sender: 'ai', text: '죄송합니다, 오류가 발생했습니다. 다시 시도해 주세요.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-indigo-800/50 flex flex-col h-[75vh]">
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="flex flex-col gap-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-700 text-gray-200 rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-slate-700 text-gray-200 rounded-bl-none`}>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-0"></span>
                                    <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-300"></span>
                                </div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-indigo-800/50">
                <div className="flex items-center gap-4 bg-indigo-900/50 rounded-full border border-indigo-700 px-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="질문을 입력하세요..."
                        className="w-full bg-transparent p-3 text-gray-200 placeholder-gray-400 focus:outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-indigo-600 text-white rounded-full p-2.5 hover:bg-indigo-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;