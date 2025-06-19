import React from 'react';

function KpiResults({ kpiValues }) {
  if (!kpiValues) return null;
  const { agents, human_vs_ai, comment } = kpiValues;

  return (
    <div className="kpi-results">
      <h2>KPI Results</h2>
      <h3>Agents</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Latency (hr)</th>
            <th>Cost (USD)</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {agents && agents.map((agent, idx) => (
            <tr key={idx}>
              <td>{agent.name}</td>
              <td>{agent.latency_hr}</td>
              <td>{agent.cost_usd}</td>
              <td>{agent.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Human vs AI</h3>
      <ul>
        <li>Analysis Time (hr): {human_vs_ai.analysis_time_hr}</li>
        <li>Dev Time (hr): {human_vs_ai.dev_time_hr}</li>
        <li>Cost (USD): {human_vs_ai.cost_usd}</li>
      </ul>
      <h3>Comment</h3>
      <p>{comment}</p>
    </div>
  );
}

export default KpiResults; 