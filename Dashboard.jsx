import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    { id: 1, name: 'Office Core Backend Integration', count: 3, date: '2026-09-12' },
    { id: 2, name: 'Personal Portfolio React SPA', count: 5, date: '2026-09-14' },
    { id: 3, name: 'E-Commerce Database Migration', count: 2, date: '2026-09-15' }
  ]);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const newProj = {
      id: projects.length + 1,
      name: newProjectName,
      count: 0,
      date: new Date().toISOString().split('T')[0]
    };
    setProjects([...projects, newProj]);
    setNewProjectName('');
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', minHeight: '100vh', background: '#f3f4f6', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Navigation / Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', background: '#ffffff', padding: '20px 30px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#1e3a8a', margin: 0, fontWeight: 'bold', fontSize: '1.5rem' }}>Sandeep's Project Console</h2>
          <button onClick={() => navigate('/')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
        </div>

        {/* Create Project Section */}
        <div style={{ background: '#ffffff', padding: '25px', borderRadius: '15px', marginBottom: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151', fontSize: '1.1rem' }}>Initialize New Enterprise Project Container</h3>
          <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Enter unique project repository name..." 
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              style={{ flex: 1, padding: '12px 15px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', outline: 'none' }}
            />
            <button type="submit" style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>Create Project</button>
          </form>
        </div>

        {/* Project Lists Grid */}
        <h3 style={{ color: '#4b5563', marginBottom: '20px', fontSize: '1.2rem' }}>Active Relational Projects</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              onClick={() => navigate(`/kanban/${proj.id}`)}
              style={{ background: '#ffffff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <h4 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.2rem', fontWeight: '600' }}>{proj.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontSize: '0.875rem', color: '#6b7280' }}>
                <span>Tasks: <strong>{proj.count} active</strong></span>
                <span>Created: {proj.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
