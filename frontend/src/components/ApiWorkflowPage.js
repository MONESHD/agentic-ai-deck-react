import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

const nodeDefaults = {
  sourcePosition: 'right',
  targetPosition: 'left',
  style: {
    borderRadius: '8px',
    border: '1px solid #1a192b',
    padding: '15px',
    fontSize: '12px',
    background: '#fff',
    width: 200,
  },
};

const getNodesAndEdgesFromKpi = (kpi) => {
  if (!kpi || !kpi.agents || !kpi.human_vs_ai) {
    return { initialNodes: [], initialEdges: [] };
  }

  const { agents, human_vs_ai } = kpi;
  const initialNodes = [];
  const initialEdges = [];

  // Start Node
  initialNodes.push({
    id: 'start',
    position: { x: 0, y: 250 },
    data: { label: 'Solution Analysis' },
    ...nodeDefaults,
    style: { ...nodeDefaults.style, background: '#2E7D32', color: 'white' }
  });

  // Human Path
  initialNodes.push(
    { id: 'human-analysis', position: { x: 250, y: 0 }, data: { label: `Human Analysis:\n${human_vs_ai.human_analysis_time}` }, ...nodeDefaults },
    { id: 'human-dev', position: { x: 500, y: 0 }, data: { label: `Human Development:\n${human_vs_ai.human_development_time}` }, ...nodeDefaults },
    { id: 'human-cost', position: { x: 750, y: 0 }, data: { label: `Human Cost:\n$${human_vs_ai.human_cost}` }, ...nodeDefaults }
  );
  initialEdges.push(
    { id: 'e-start-human', source: 'start', target: 'human-analysis', label: 'Human Path' },
    { id: 'e-human-analysis-dev', source: 'human-analysis', target: 'human-dev' },
    { id: 'e-human-dev-cost', source: 'human-dev', target: 'human-cost' }
  );

  // AI Path - one line of agents
  let lastAgentId = 'start';
  agents.forEach((agent, index) => {
    const agentId = `agent-${index}`;
    initialNodes.push({
      id: agentId,
      position: { x: 250 + index * 250, y: 400 },
      data: { label: `Agent: ${agent.name}\nScore: ${agent.score}\nPrice: $${agent.price}` },
      ...nodeDefaults,
      style: { ...nodeDefaults.style, background: '#1976D2', color: 'white' }
    });
    initialEdges.push({ id: `e-${lastAgentId}-${agentId}`, source: lastAgentId, target: agentId, label: index === 0 ? 'AI Path' : undefined, animated: true });
    lastAgentId = agentId;
  });

  // AI Metrics
  initialNodes.push(
    { id: 'ai-latency', position: { x: 250 + agents.length * 250, y: 350 }, data: { label: `AI Latency:\n${human_vs_ai.ai_compute_latency}` }, ...nodeDefaults },
    { id: 'ai-cost', position: { x: 250 + agents.length * 250, y: 450 }, data: { label: `AI Cost:\n$${human_vs_ai.ai_cost}` }, ...nodeDefaults }
  );
  initialEdges.push(
    { id: `e-${lastAgentId}-latency`, source: lastAgentId, target: 'ai-latency' },
    { id: `e-${lastAgentId}-cost`, source: lastAgentId, target: 'ai-cost' }
  );
  
  // End Node
  const endNodeX = 250 + (agents.length + 1) * 250;
  initialNodes.push({
    id: 'end',
    position: { x: endNodeX, y: 250 },
    data: { label: 'Result' },
    ...nodeDefaults,
    style: { ...nodeDefaults.style, background: '#D32F2F', color: 'white' }
  });
  initialEdges.push(
    { id: 'e-human-cost-end', source: 'human-cost', target: 'end'},
    { id: 'e-ai-latency-end', source: 'ai-latency', target: 'end'},
    { id: 'e-ai-cost-end', source: 'ai-cost', target: 'end'}
  );

  return { initialNodes, initialEdges };
};

function ApiWorkflowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { kpiData } = location.state || {};

  const { initialNodes, initialEdges } = getNodesAndEdgesFromKpi(kpiData);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  if (!kpiData) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>No API data available for workflow.</h2>
        <p>Please go back and generate a deck first.</p>
        <button onClick={() => navigate('/app')}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap nodeColor={(n) => n.style?.background || '#fff'} nodeStrokeWidth={3} />
        <Controls />
        <Background />
      </ReactFlow>
      <button 
        onClick={() => navigate('/app')} 
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, padding: '10px 20px', background: '#fff', border: '1px solid #333' }}
      >
        Back to App
      </button>
    </div>
  );
}

export default ApiWorkflowPage; 