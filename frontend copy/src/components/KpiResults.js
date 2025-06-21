import React, { useState } from 'react';

function KpiResults({ kpiValues }) {
  // Tooltip state (must be before any early return)
  const [hovered, setHovered] = useState(null); // 'analysis', 'dev', or 'cost'

  if (!kpiValues) return null;
  const { agents, human_vs_ai, comment } = kpiValues;
  // Assume the first agent is the main AI agent for comparison
  const aiAgent = agents && agents.length > 0 ? agents[0] : null;

  // Prepare values for comparison
  const human = {
    analysis: human_vs_ai?.analysis_time_hr ?? 0,
    dev: human_vs_ai?.dev_time_hr ?? 0,
    cost: human_vs_ai?.cost_usd ?? 0,
  };
  const ai = {
    analysis: aiAgent?.latency_hr ?? 0,
    dev: aiAgent?.dev_time_hr ?? 0,
    cost: aiAgent?.cost_usd ?? 0,
  };

  // For histogram: find max for scaling
  const maxVal = Math.max(human.analysis, ai.analysis, human.dev, ai.dev, human.cost, ai.cost, 1);
  const barWidth = (val) => 120 * (val / maxVal);

  // Helper to render a vertical stacked histogram for a KPI with custom tooltip
  const renderVerticalHistogram = (kpi, humanVal, aiVal, color1, color2, unit) => {
    const hBar = barWidth(humanVal);
    const aBar = barWidth(aiVal);
    const width = Math.max(hBar, aBar, 40);
    const tooltipVisible = hovered === kpi;
    return (
      <div
        style={{ display: 'inline-block', width }}
        onMouseEnter={() => setHovered(kpi)}
        onMouseLeave={() => setHovered(null)}
      >
        <svg width={width} height="44" style={{ position: 'relative', overflow: 'visible' }}>
          {/* Tooltip background and text */}
          {tooltipVisible && (
            <g>
              <rect
                x={0}
                y={-28}
                width={width}
                height={24}
                rx={6}
                fill="#fff"
                stroke="#8884d8"
                strokeWidth={1}
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))' }}
              />
              <text x={width / 2} y={-14} fontSize="13" fill="#1e40af" textAnchor="middle">
                Human: {humanVal} {unit}
              </text>
              <text x={width / 2} y={-2} fontSize="13" fill="#15803d" textAnchor="middle">
                AI: {aiVal} {unit}
              </text>
            </g>
          )}
          {/* Human bar on top */}
          <rect x="0" y="2" width={hBar} height="16" fill={color1} style={{ cursor: 'pointer' }} />
          <rect x="0" y="24" width={aBar} height="16" fill={color2} style={{ cursor: 'pointer' }} />
        </svg>
      </div>
    );
  };

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
      <h3>Human vs AI Comparison</h3>
      {/* KPI Histogram Table */}
      <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>KPI</th>
            <th>Histogram (Human | AI)</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Analysis Time (hr)</td>
            <td>{renderVerticalHistogram('analysis', human.analysis, ai.analysis, '#8884d8', '#82ca9d', 'hr')}</td>
            <td>{(human.analysis - ai.analysis).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Dev Time (hr)</td>
            <td>{renderVerticalHistogram('dev', human.dev, ai.dev, '#8884d8', '#82ca9d', 'hr')}</td>
            <td>{(human.dev - ai.dev).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Cost (USD)</td>
            <td>{renderVerticalHistogram('cost', human.cost, ai.cost, '#ffc658', '#ff8042', '$')}</td>
            <td>{(human.cost - ai.cost).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <h3>Comment</h3>
      <p>{comment}</p>
    </div>
  );
}

export default KpiResults; 