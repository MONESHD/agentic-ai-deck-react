import React, { useState } from 'react';
import { API_BASE_URL } from '../apiConfig';

function FlowchartGenerator() {
  const [role, setRole] = useState('');
  const [goal, setGoal] = useState('');
  const [points, setPoints] = useState(['']);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePointChange = (index, value) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const addPoint = () => {
    setPoints([...points, '']);
  };

  const removePoint = (index) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl('');

    const payload = {
      role,
      goal,
      points: points.filter(p => p.trim() !== ''),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/generate_flowchart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate flowchart');
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flowchart-generator">
      <h2>Generate Flowchart</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Your Role:</label>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required />
        </div>
        <div>
          <label>Your Goal:</label>
          <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} required />
        </div>
        <div>
          <label>Key Points:</label>
          {points.map((point, index) => (
            <div key={index}>
              <input
                type="text"
                value={point}
                onChange={(e) => handlePointChange(index, e.target.value)}
              />
              <button type="button" onClick={() => removePoint(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addPoint}>Add Point</button>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Flowchart'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      
      {imageUrl && (
        <div className="flowchart-output">
          <h3>Generated Flowchart</h3>
          <img src={imageUrl} alt="Generated flowchart" />
          <a href={imageUrl} download="flowchart.png">
            <button>Download Flowchart</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default FlowchartGenerator; 