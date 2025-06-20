import React, { useState } from 'react';
import KpiResults from './components/KpiResults';
import DownloadButton from './components/DownloadButton';
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

function App() {
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
      // All questions answered, call API
      setLoading(true);
      setError(null);
      setKpiValues(null);
      setPptxFile(null);
      const formData = new FormData();
      Object.entries(newAnswers).forEach(([key, value]) => {
        formData.append(key, value);
      });
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
  };

  return (
    <div className="app-layout">
      <div className="chat-panel">
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
      </div>
      <div className="dashboard-panel">
        <h2>Dashboard</h2>
        {kpiValues && <KpiResults kpiValues={kpiValues} />}
        {pptxFile && <DownloadButton pptxFile={pptxFile} />}
      </div>
    </div>
  );
}

export default App;
