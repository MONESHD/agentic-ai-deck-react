import React, { useState } from 'react';
import DeckForm from './components/DeckForm';
import KpiResults from './components/KpiResults';
import DownloadButton from './components/DownloadButton';
import './App.css';

function App() {
  const [kpiValues, setKpiValues] = useState(null);
  const [pptxFile, setPptxFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setKpiValues(null);
    setPptxFile(null);
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Agentic AI Deck Generator</h1>
      <DeckForm onSubmit={handleFormSubmit} loading={loading} />
      {loading && <div className="loading">Generating deck...</div>}
      {error && <div className="error">{error}</div>}
      {kpiValues && <KpiResults kpiValues={kpiValues} />}
      {pptxFile && <DownloadButton pptxFile={pptxFile} />}
    </div>
  );
}

export default App;
