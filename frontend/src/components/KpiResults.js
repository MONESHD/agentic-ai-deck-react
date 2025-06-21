import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const insightQuestions = [
  "What are the key benefits of implementing this AI solution?",
  "Which specific functions or tasks are best suited for AI automation in this context?",
  "What are the primary strategies for optimizing the costs associated with this AI solution?",
  "What are the main factors that contribute to the consumption of credits and overall costs?",
  "Based on the analysis, what is the recommended AI model, and why?",
  "What are the critical next steps and considerations for developers and decision-makers?"
];

function KpiResults({ kpiValues }) {
  if (!kpiValues || !kpiValues.agents) return null;

  const { agents, human_vs_ai, comment, insights } = kpiValues;

  const chartData = agents.map(agent => ({
    name: agent.name,
    Latency: agent.latency_hr,
    Cost: agent.cost_usd,
    Score: agent.score,
  }));

  return (
    <div className="kpi-results">
      <h3>Agent Performance Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Latency" fill="#8884d8" />
          <Bar dataKey="Cost" fill="#82ca9d" />
          <Bar dataKey="Score" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>

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
          {agents.map((agent, idx) => (
            <tr key={idx}>
              <td>{agent.name}</td>
              <td>{agent.latency_hr}</td>
              <td>{agent.cost_usd}</td>
              <td>{agent.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Build time comparison</h3>
      {human_vs_ai && (
        <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>KPI</th>
              <th>Human</th>
              <th>AI</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Analysis Time (hr)</td>
              <td>{human_vs_ai.analysis_time_hr}</td>
              <td>{agents.length > 0 ? agents[0].latency_hr : 'N/A'}</td>
              <td>{(human_vs_ai.analysis_time_hr - (agents.length > 0 ? agents[0].latency_hr : 0)).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Implementation Time (hr)</td>
              <td>{human_vs_ai.dev_time_hr}</td>
              <td>{agents.length > 0 ? agents[0].dev_time_hr : 'N/A'}</td>
              <td>{(human_vs_ai.dev_time_hr - (agents.length > 0 ? agents[0].dev_time_hr : 0)).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Cost (USD)</td>
              <td>{human_vs_ai.cost_usd}</td>
              <td>{agents.length > 0 ? agents[0].cost_usd : 'N/A'}</td>
              <td>{(human_vs_ai.cost_usd - (agents.length > 0 ? agents[0].cost_usd : 0)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}

      <h3>Comment</h3>
      <p>{comment}</p>

      {insights && insights.length > 0 && (
        <div className="insights-section">
          <h3>AI-Generated Insights</h3>
          {insights.map((insight, index) => (
            <div className="qa-card" key={index}>
              <p><strong>{insightQuestions[index] || `Insight ${index + 1}`}</strong></p>
              <p>{insight}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default KpiResults; 