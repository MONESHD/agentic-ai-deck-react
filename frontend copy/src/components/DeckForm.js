import React, { useState } from 'react';

const initialState = {
  company_industry: '',
  use_case_challenge: '',
  existing_stack: '',
  open_source_vs_comm: '',
  tasks_to_automate: '',
  analysis_time_hr: '',
  dev_time_hr: '',
  cost_usd: '',
};

function DeckForm({ onSubmit, loading }) {
  const [fields, setFields] = useState(initialState);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    // Simple validation
    for (const key in fields) {
      if (!fields[key]) {
        setError('All fields are required.');
        return;
      }
    }
    const formData = new FormData();
    // Add main fields
    formData.append('company_industry', fields.company_industry);
    formData.append('use_case_challenge', fields.use_case_challenge);
    formData.append('existing_stack', fields.existing_stack);
    formData.append('open_source_vs_comm', fields.open_source_vs_comm);
    formData.append('tasks_to_automate', fields.tasks_to_automate);
    // Add human_vs_ai as JSON string
    const humanVsAi = {
      analysis_time_hr: Number(fields.analysis_time_hr),
      dev_time_hr: Number(fields.dev_time_hr),
      cost_usd: Number(fields.cost_usd),
    };
    formData.append('human_vs_ai', JSON.stringify(humanVsAi));
    onSubmit(formData);
  };

  return (
    <form className="deck-form" onSubmit={handleSubmit}>
      <div>
        <label>Company Industry:</label>
        <input
          type="text"
          name="company_industry"
          value={fields.company_industry}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <label>Use Case / Challenge:</label>
        <input
          type="text"
          name="use_case_challenge"
          value={fields.use_case_challenge}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <label>Existing Stack:</label>
        <input
          type="text"
          name="existing_stack"
          value={fields.existing_stack}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <label>Open Source vs Commercial:</label>
        <input
          type="text"
          name="open_source_vs_comm"
          value={fields.open_source_vs_comm}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <label>Tasks to Automate:</label>
        <input
          type="text"
          name="tasks_to_automate"
          value={fields.tasks_to_automate}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <label>Human vs AI - Analysis Time (hr):</label>
        <input
          type="number"
          name="analysis_time_hr"
          value={fields.analysis_time_hr}
          onChange={handleChange}
          disabled={loading}
          min="0"
        />
      </div>
      <div>
        <label>Human vs AI - Dev Time (hr):</label>
        <input
          type="number"
          name="dev_time_hr"
          value={fields.dev_time_hr}
          onChange={handleChange}
          disabled={loading}
          min="0"
        />
      </div>
      <div>
        <label>Human vs AI - Cost (USD):</label>
        <input
          type="number"
          name="cost_usd"
          value={fields.cost_usd}
          onChange={handleChange}
          disabled={loading}
          min="0"
        />
      </div>
      {error && <div className="form-error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Deck'}
      </button>
    </form>
  );
}

export default DeckForm; 