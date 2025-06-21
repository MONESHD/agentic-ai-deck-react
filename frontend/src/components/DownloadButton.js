import React, { useState } from 'react';
import { API_BASE_URL } from '../apiConfig';

function DownloadButton() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/download_pptx`);
      if (!response.ok) {
        throw new Error('Failed to download PPTX file');
      }
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'agentic_ai_deck.pptx';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="download-section">
      <button onClick={handleDownload} disabled={downloading}>
        {downloading ? 'Downloading...' : 'Download PPTX'}
      </button>
      {error && <div className="download-error">{error}</div>}
    </div>
  );
}

export default DownloadButton; 