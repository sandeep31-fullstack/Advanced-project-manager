import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const KanbanBoard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  const [tasks, setTasks] = useState([
    { id: 't1', text: 'Configure application routes and route controller', status: 'todo' },
    { id: 't2', text: 'Create responsive 3-view UI layouts using CSS flexbox', status: 'progress' },
    { id: 't3', text: 'Initialize git workspace and remote repository architecture', status: 'done' }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: `t_${Date.now()}`,
      text: newTaskText,
      status: 'todo'
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', minHeight: '100vh', background: '#f3f4f6', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Top Operational bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#ffffff', padding: '20px 30px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div>
            <h2 style={{ color: '#1e3a8a', margin: 0, fontWeight: 'bold' }}>Enterprise Kanban Workspace</h2>
            <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>Project Reference Node ID: #{projectId}</p>
          </div>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#4b5563', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>⬅️ Back to Console</button>
        </div>

        {/* Dynamic Task Creation Bar */}
        <div style={{ background: '#ffffff', padding: '20px 25px', borderRadius: '15px', marginBottom: '35px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Type urgent operational task contents here..." 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              style={{ flex: 1, padding: '12px 15px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', outline: 'none' }}
            />
            <button type="submit" style={{ background: '#10b981', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>➕ Add Task Payload</button>
          </form>
        </div>

        {/* Modern 3-Column Kanban Board Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
          
          {/* LANES MAPPING LOOP */}
          {[
            { title: '🔴 TO DO', status: 'todo', bg: '#fee2e2' },
            { title: '🟡 IN PROGRESS', status: 'progress', bg: '#fef3c7' },
            { title: '🟢 DONE', status: 'done', bg: '#d1fae5' }
          ].map(lane => (
            <div key={lane.status} style={{ background: '#ffffff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minHeight: '450px', borderTop: `5px solid ${lane.title.includes('🔴') ? '#ef4444' : lane.title.includes('🟡') ? '#f59e0b' : '#10b981'}` }}>
              <div style={{ background: lane.bg, padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#111827', fontWeight: 'bold' }}>{lane.title}</h3>
              </div>
              
              {/* Task Cards Filtered by Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {tasks.filter(t => t.status === lane.status).map(task => (
                  <div key={task.id} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '15px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <p style={{ margin: '0 0 15px 0', fontSize: '0.95rem', color: '#374151', lineHeight: '1.4' }}>{task.text}</p>
                    
                    {/* Direction Buttons for horizontal state mutation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {lane.status !== 'todo' && <button type="button" onClick={() => moveTask(task.id, lane.status === 'done' ? 'progress' : 'todo')} style={{ background: '#e5e7eb', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>◀</button>}
                        {lane.status !== 'done' && <button type="button" onClick={() => moveTask(task.id, lane.status === 'todo' ? 'progress' : 'done')} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>▶</button>}
                      </div>
                      <button type="button" onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem', padding: '5px' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default KanbanBoard;
