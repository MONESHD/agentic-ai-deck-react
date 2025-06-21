import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';

const SYSTEM_PROMPT = { role: 'system', content: 'You are a helpful assistant.' };

function ChatPage({ embedded, initialMessages, context = '', kpi = {} }) {
  const [messages, setMessages] = useState(() => {
    if (initialMessages && initialMessages.length > 0) {
      // If system prompt is not present, add it
      if (initialMessages[0].role !== 'system') {
        return [SYSTEM_PROMPT, ...initialMessages];
      }
      return initialMessages;
    }
    return [SYSTEM_PROMPT];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleInput = (e) => setInput(e.target.value);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const newMessages = [
      ...messages,
      { role: 'user', content: input }
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, kpi, messages: newMessages })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to get reply');
      }
      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, idx) => {
    const role = msg.role === 'assistant' ? 'bot' : msg.role;
    return (
      <div key={idx} className={`chat-msg ${role}`}>
        <div className="text">{msg.content}</div>
      </div>
    );
  };

  if (embedded) {
    return (
      <>
        <h2>Agentic AI Chat</h2>
        <div className="chat-window">
          {messages.filter(m => m.role !== 'system').map(renderMessage)}
          {loading && (
            <div className="chat-msg bot">
              <div className="text">Thinking...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {error && <div className="error">{error}</div>}
        <form className="chat-input" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={handleInput}
            placeholder="Type your message..."
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()}>Send</button>
        </form>
      </>
    );
  }

  return (
    <div className="app-layout">
      <div className="chat-panel">
        <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>ChatGPT-like Assistant</h2>
          <button className="back-btn" onClick={() => navigate('/')} style={{ marginRight: '20px' }}>Back</button>
        </div>
        <div className="chat-window">
          {messages.filter(m => m.role !== 'system').map(renderMessage)}
          {loading && (
            <div className="chat-msg bot">
              <div className="text">Thinking...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {error && <div className="error">{error}</div>}
        <form className="chat-input" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={handleInput}
            placeholder="Type your message..."
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()}>Send</button>
        </form>
      </div>
      <div className="dashboard-panel">
        {/* This is for standalone chat page, can be empty or show something else */}
      </div>
    </div>
  );
}

export default ChatPage; 