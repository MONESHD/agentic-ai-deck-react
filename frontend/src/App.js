import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import KpiResults from './components/KpiResults';
import DownloadButton from './components/DownloadButton';
import ChatPage from './components/ChatPage';
import { API_BASE_URL } from './apiConfig';
import './App.css';
import WorkflowPage from './components/WorkflowPage';
import ApiWorkflowPage from './components/ApiWorkflowPage';
import FlowchartGenerator from './components/FlowchartGenerator';

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

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Agentic AI Cost Optimization Architect</h1>
        <p>Talk with our AI Architect to generate a detailed analysis and presentation on optimizing your business processes.</p>
        <button className="start-btn" onClick={() => navigate('/app')}>
          Talk Now
        </button>
        <button className="start-btn" onClick={() => navigate('/flowchart')}>
          Generate Flowchart
        </button>
      </div>
    </div>
  );
}

function MainApp() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [chat, setChat] = useState([
    { sender: 'bot', text: questions[0].text },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kpiValues, setKpiValues] = useState(null);
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
      setShowGptChat(true);
      setLoading(true);
      setError(null);
      setKpiValues(null);
      const formData = new FormData();
      formData.append('company_industry', newAnswers.company_industry);
      formData.append('use_case_challenge', newAnswers.use_case_challenge);
      formData.append('existing_stack', newAnswers.existing_stack);
      formData.append('open_source_vs_comm', newAnswers.open_source_vs_comm);
      formData.append('tasks_to_automate', newAnswers.tasks_to_automate);
      try {
        const response = await fetch(`${API_BASE_URL}/generate_deck`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to generate deck');
        }
        const data = await response.json();
        setKpiValues(data.kpi_values);
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
    setShowGptChat(false);
  };

  const convertToOpenAIMessages = (staticChat) =>
    staticChat
      .filter(msg => msg.sender !== 'bot' || msg.text !== questions[0].text)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

  const buildContextString = (answersObj) =>
    questions
      .map(q => `${q.text} ${answersObj[q.name] || ''}`)
      .join('\n');

  return (
    <div className="app-layout">
      <div className="chat-panel">
        {!showGptChat ? (
          <>
            <h2>Agentic AI Architect</h2>
            <div className="chat-window">
              {chat.map((msg, idx) => (
                <div key={idx} className={`chat-msg ${msg.sender}`}>
                  <div className="text">{msg.text}</div>
                </div>
              ))}
              {loading && (
                <div className="chat-msg bot">
                  <div className="text">Generating deck...</div>
                </div>
              )}
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
            {kpiValues && (
              <div className="restart-container">
                <button onClick={handleRestart}>Restart</button>
              </div>
            )}
            {kpiValues && (
              <KpiResults kpiValues={kpiValues} />
            )}
          </>
        ) : (
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
        {kpiValues && (
          <KpiResults
            kpiValues={kpiValues}
            questions={questions}
            answers={answers}
          />
        )}
        {kpiValues && (
          <div className="buttons-container">
            <DownloadButton />
            <button
              className="flowchart-btn"
              onClick={() => navigate('/workflow', { state: { answers } })}
            >
              Open Here
            </button>
            <button
              className="flowchart-btn"
              onClick={() => navigate('/api-workflow', { state: { kpiData: kpiValues } })}
            >
              View KPI Workflow
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<MainApp />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/api-workflow" element={<ApiWorkflowPage />} />
        <Route path="/flowchart" element={<FlowchartGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
