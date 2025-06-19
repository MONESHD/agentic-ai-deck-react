import React, { useState } from 'react';

const initialState = {
  company_industry: '',
  use_case_challenge: '',
  existing_stack: '',
  open_source_vs_comm: '',
  tasks_to_automate: '',
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
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
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
      {error && <div className="form-error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Deck'}
      </button>
    </form>
  );
}

export default DeckForm; 