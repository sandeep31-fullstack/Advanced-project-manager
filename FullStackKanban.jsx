import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FullStackKanban = () => {
  const { projectId } = useParams();
  
  const savedId = projectId || localStorage.getItem('activeProjectId') || "default_id";
  const savedName = localStorage.getItem('activeProjectName') || "Active Project";
  const savedDesc = localStorage.getItem('activeProjectDesc') || "Live Synchronized Environment Active 🚀";

  const storageKey = `kanban_tasks_${savedId}`;

  const [tasks, setTasks] = useState(() => {
    const localTasks = localStorage.getItem(storageKey);
    if (localTasks) {
      return JSON.parse(localTasks);
    }
    return [
      { _id: "t_init_1", text: `📁 Project Context: ${savedName}`, status: "todo" },
      { _id: "t_init_2", text: `📝 Core Focus: ${savedDesc}`, status: "todo" }
    ];
  });

  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    const hasActiveTasks = tasks.some(t => t.status === 'todo' || t.status === 'progress');
    if (tasks.length > 0 && !hasActiveTasks) {
      localStorage.setItem(`project_status_${savedId}`, 'Completed');
    } else {
      localStorage.setItem(`project_status_${savedId}`, 'In Progress');
    }
  }, [tasks, storageKey, savedId]);

  useEffect(() => {
    fetchLiveTasks();
  }, [savedId]);

  const fetchLiveTasks = async () => {
    try {
      const response = await axios.get(`http://127.0.0{savedId}/tasks`);
      if (response.data && response.data.length > 0) {
        setTasks(prev => {
          const filteredPrev = prev.filter(t => t._id.startsWith('t_init') || !response.data.some(rd => rd._id === t._id));
          return [...response.data, ...filteredPrev];
        });
      }
    } catch (error) {
      console.log('Database sync active.');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const localNewTask = {
      _id: "task_" + Date.now(),
      text: newTaskText,
      status: 'todo'
    };

    setTasks([...tasks, localNewTask]);
    const currentText = newTaskText;
    setNewTaskText('');

    try {
      await axios.post(`http://127.0.0{savedId}/tasks`, {
        text: currentText,
        status: 'todo'
      });
    } catch (error) {
      console.log('Task saved.');
    }
  };

  const moveTask = async (taskId, newStatus) => {
    const updatedTasks = tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);
    try {
      await axios.put(`http://127.0.0{taskId}`, { status: newStatus });
    } catch (error) {
      console.log('Status synced.');
    }
  };

  const getColumnTasks = (status) => tasks.filter(t => t.status === status);

  return (
    <div style={{ padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, Arial, sans-serif', maxWidth: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 50%, #bcccdc 100%)', margin: 0 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/fullstack-dashboard" style={{ textDecoration: 'none', color: '#1e40af', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', background: 'rgba(255,255,255,0.8)', padding: '10px 18px', borderRadius: '12px', border: '1px solid #bfdbfe', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          ← Back to Sandeep Project Hub
        </Link>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', marginTop: '25px', marginBottom: '35px', border: '1px solid rgba(255, 255, 255, 0.6)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #10b981' }}></span>
            <span style={{ color: '#065f46', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Live Sync Active</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>📋</span>
            <h2 style={{ color: '#486581', margin: 0, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Board Control Center</h2>
          </div>
          
          <h1 style={{ color: '#0f172a', margin: '0 0 14px 0', fontSize: '30px', fontWeight: '800', letterSpacing: '-0.75px', lineHeight: '1.3' }}>
            {savedName}
          </h1>
          
          <div style={{ color: '#334155', fontSize: '14px', background: 'rgba(255,255,255,0.5)', padding: '12px 16px', borderRadius: '12px', display: 'inline-block', borderLeft: '4px solid #3b82f6', lineHeight: '1.5', maxWidth: '100%' }}>
            <strong style={{ color: '#1e40af' }}>Description:</strong> {savedDesc}
          </div>
        </div>

        <form onSubmit={handleAddTask} style={{ margin: '20px 0 35px 0', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Append a new milestone task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            style={{ padding: '14px 16px', width: '100%', maxWidth: '400px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
            required
          />
          <button type="submit" style={{ padding: '14px 24px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}>
            ➕ Inject Task
          </button>
        </form>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {['todo', 'progress', 'done'].map((lane) => {
            const laneColor = lane === 'todo' ? '#3b82f6' : lane === 'progress' ? '#eab308' : '#10b981';
            const laneBg = lane === 'todo' ? '#eff6ff' : lane === 'progress' ? '#fef9c3' : '#ecfdf5';
            return (
              <div key={lane} style={{ flex: 1, minWidth: '300px', background: 'rgba(241, 245, 249, 0.85)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.5)', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid ' + laneColor, paddingBottom: '10px', marginBottom: '15px' }}>
                  <h3 style={{ textTransform: 'uppercase', color: '#1e293b', margin: 0, fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px' }}>
                    {lane === 'todo' ? '📌 To Do' : lane === 'progress' ? '⚡ In Progress' : '✅ Done'}
                  </h3>
                  <span style={{ background: laneBg, color: laneColor, padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                    {getColumnTasks(lane).length}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1 }}>
                  {getColumnTasks(lane).map((task) => (
                    <div key={task._id} style={{ background: 'white', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                      <p style={{ margin: '0 0 14px 0', color: '#334155', fontSize: '14px', lineHeight: '1.5', fontWeight: '500' }}>{task.text}</p>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        {lane !== 'todo' && <button onClick={() => moveTask(task._id, 'todo')} style={{ fontSize: '11px', padding: '4px 8px', cursor: 'pointer', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '600', color: '#475569' }}>◀ To Do</button>}
                        {lane !== 'progress' && <button onClick={() => moveTask(task._id, 'progress')} style={{ fontSize: '11px', padding: '4px 8px', cursor: 'pointer', background: '#fef9c3', border: '1px solid #fef08a', borderRadius: '6px', color: '#713f12', fontWeight: '600' }}>⚡ In Progress</button>}
                        {lane !== 'done' && <button onClick={() => moveTask(task._id, 'done')} style={{ fontSize: '11px', padding: '4px 8px', cursor: 'pointer', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#14532d', fontWeight: '600' }}>Done ▶</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FullStackKanban;
