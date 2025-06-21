import React, { useState } from 'react';

function DownloadButton({ pptxFile }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const url = `http://127.0.0.1:5000/download_pptx/?pptx_file=${encodeURIComponent(pptxFile)}`;
      const response = await fetch(url);
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