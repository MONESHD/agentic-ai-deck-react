import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatPage.css';

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
      const response = await fetch('http://127.0.0.1:5000/chat/', {
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

  return (
    <div className="chatgpt-page-layout">
      {!embedded && (
        <div className="chatgpt-header">
          <h2>ChatGPT-like Assistant</h2>
          <button className="back-btn" onClick={() => navigate('/')}>Back to Dashboard</button>
        </div>
      )}
      <div className="chatgpt-window">
        {messages.filter(m => m.role !== 'system').map((msg, idx) => (
          <div key={idx} className={`chatgpt-msg ${msg.role}`}>{msg.content}</div>
        ))}
        {loading && <div className="chatgpt-msg assistant">Thinking...</div>}
        <div ref={chatEndRef} />
      </div>
      {error && <div className="chatgpt-error">{error}</div>}
      <form className="chatgpt-input" onSubmit={handleSend}>
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
  );
}

export default ChatPage; 