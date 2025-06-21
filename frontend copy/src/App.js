import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import KpiResults from './components/KpiResults';
import DownloadButton from './components/DownloadButton';
import ChatPage from './components/ChatPage';
import './App.css';

const questions = [
  {
    name: 'company_industry',
    text: 'What is the industry of your company?',
  },
  {
    name: 'use_case_challenge',
    text: 'What business challenge or use-case are you addressing?',
  },
  {
    name: 'existing_stack',
    text: 'What is your current technology stack?',
  },
  {
    name: 'open_source_vs_comm',
    text: 'Do you prefer open-source or commercial solutions?',
  },
  {
    name: 'tasks_to_automate',
    text: 'What tasks do you want to automate?',
  },
];

function MainApp() {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [chat, setChat] = useState([
    { sender: 'bot', text: questions[0].text },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kpiValues, setKpiValues] = useState(null);
  const [pptxFile, setPptxFile] = useState(null);
  const [showGptChat, setShowGptChat] = useState(false);

  const handleInput = (e) => setInput(e.target.value);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = questions[currentStep];
    const newAnswers = { ...answers, [q.name]: input };
    setChat([...chat, { sender: 'user', text: input }]);
    setAnswers(newAnswers);
    setInput('');
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setChat((prev) => [
          ...prev,
          { sender: 'bot', text: questions[currentStep + 1].text },
        ]);
        setCurrentStep(currentStep + 1);
      }, 400);
    } else {
      // All questions answered, show GPT chat immediately
      setShowGptChat(true);
      setLoading(true);
      setError(null);
      setKpiValues(null);
      setPptxFile(null);
      const formData = new FormData();
      formData.append('company_industry', newAnswers.company_industry);
      formData.append('use_case_challenge', newAnswers.use_case_challenge);
      formData.append('existing_stack', newAnswers.existing_stack);
      formData.append('open_source_vs_comm', newAnswers.open_source_vs_comm);
      formData.append('tasks_to_automate', newAnswers.tasks_to_automate);
      try {
        const response = await fetch('http://127.0.0.1:5000/generate_deck/', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to generate deck');
        }
        const data = await response.json();
        setKpiValues(data.kpi_values);
        setPptxFile(data.pptx_file);
        setChat((prev) => [
          ...prev,
          { sender: 'bot', text: 'Here are your KPI results and download link!' },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setChat([{ sender: 'bot', text: questions[0].text }]);
    setInput('');
    setLoading(false);
    setError(null);
    setKpiValues(null);
    setPptxFile(null);
    setShowGptChat(false);
  };

  // Helper to convert static chat to OpenAI chat format
  const convertToOpenAIMessages = (staticChat) =>
    staticChat
      .filter(msg => msg.sender !== 'bot' || msg.text !== questions[0].text) // skip first bot Q
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

  // Helper to build context string from answers
  const buildContextString = (answersObj) =>
    questions
      .map(q => `${q.text} ${answersObj[q.name] || ''}`)
      .join('\n');

  return (
    <div className="app-layout">
      <div className="chat-panel">
        {!showGptChat ? (
          <>
            <h2>Agentic AI Chat</h2>
            <div className="chat-window">
              {chat.map((msg, idx) => (
                <div key={idx} className={`chat-msg ${msg.sender}`}>{msg.text}</div>
              ))}
              {loading && <div className="chat-msg bot">Generating deck...</div>}
            </div>
            {error && <div className="error">{error}</div>}
            {currentStep < questions.length && !loading && (
              <form className="chat-input" onSubmit={handleSend}>
                <input
                  type="text"
                  value={input}
                  onChange={handleInput}
                  placeholder="Type your answer..."
                  disabled={loading}
                  autoFocus
                />
                <button type="submit" disabled={loading || !input.trim()}>Send</button>
              </form>
            )}
            {(kpiValues || pptxFile) && (
              <button className="restart-btn" onClick={handleRestart}>Restart</button>
            )}
          </>
        ) : (
          // Embedded ChatGPT-like chat (no header/back button)
          <ChatPage
            embedded
            initialMessages={convertToOpenAIMessages(chat)}
            context={buildContextString(answers)}
            kpi={kpiValues || {}}
          />
        )}
      </div>
      <div className="dashboard-panel">
        <h2>Dashboard</h2>
        {kpiValues && <KpiResults kpiValues={kpiValues} />}
        {pptxFile && <DownloadButton pptxFile={pptxFile} />}
      </div>
    </div>
  );
}

function GoToChatButton() {
  const navigate = useNavigate();
  return (
    <button className="goto-chat-btn" onClick={() => navigate('/chat')}>
      Go to ChatGPT-like Chat
    </button>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
