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
    fontSize: '14px',
    fontWeight: 'bold',
    background: '#f0f4f8',
    width: 250,
  },
};

const getNodesAndEdges = (answers) => {
  if (!answers) {
    return { initialNodes: [], initialEdges: [] };
  }

  const initialNodes = [
    { id: '1', position: { x: 0, y: 150 }, data: { label: 'Start' }, ...nodeDefaults, style: { ...nodeDefaults.style, background: '#4CAF50', color: 'white' } },
    { id: '2', position: { x: 350, y: 0 }, data: { label: `Company & Industry: ${answers.company_industry}` }, ...nodeDefaults },
    { id: '3', position: { x: 350, y: 150 }, data: { label: `Challenge: ${answers.use_case_challenge}` }, ...nodeDefaults },
    { id: '4', position: { x: 350, y: 300 }, data: { label: `Existing Stack: ${answers.existing_stack}` }, ...nodeDefaults },
    { id: '5', position: { x: 700, y: 75 }, data: { label: `Preference: ${answers.open_source_vs_comm}` }, ...nodeDefaults },
    { id: '6', position: { x: 700, y: 225 }, data: { label: `Tasks to Automate: ${answers.tasks_to_automate}` }, ...nodeDefaults },
    { id: '7', position: { x: 1050, y: 150 }, data: { label: 'End' }, ...nodeDefaults, style: { ...nodeDefaults.style, background: '#F44336', color: 'white' } },
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    { id: 'e1-4', source: '1', target: '4', animated: true },
    { id: 'e2-5', source: '2', target: '5', animated: true },
    { id: 'e3-5', source: '3', target: '5', animated: true },
    { id: 'e4-6', source: '4', target: '6', animated: true },
    { id: 'e5-7', source: '5', target: '7', animated: true },
    { id: 'e6-7', source: '6', target: '7', animated: true },
  ];

  return { initialNodes, initialEdges };
};

function WorkflowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers } = location.state || {};
  const { initialNodes, initialEdges } = getNodesAndEdges(answers);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  if (!answers) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>No workflow data available.</h2>
        <p>Please go back and fill out the form first.</p>
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
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <button 
        onClick={() => navigate('/app')} 
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, padding: '10px 20px' }}
      >
        Back to App
      </button>
    </div>
  );
}

export default WorkflowPage; 