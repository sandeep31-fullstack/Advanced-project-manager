import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => { 
    fetchProjects(); 
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://127.0.0');
      const localSavedProjects = JSON.parse(localStorage.getItem('savedProjectsList')) || [];
      
      let combined = [];
      if (response.data && response.data.length > 0) {
        combined = [...response.data, ...localSavedProjects.filter(lp => !response.data.some(rp => rp._id === lp._id))];
      } else {
        combined = localSavedProjects;
      }

      setAllProjects(combined);

      const activeOnly = combined.filter(p => {
        const isDone = localStorage.getItem(`project_status_${p._id}`) === 'Completed';
        return !isDone;
      });

      setProjects(activeOnly);
      setLoading(false);
    } catch (error) {
      const localSavedProjects = JSON.parse(localStorage.getItem('savedProjectsList')) || [];
      setAllProjects(localSavedProjects);
      const activeOnly = localSavedProjects.filter(p => {
        const isDone = localStorage.getItem(`project_status_${p._id}`) === 'Completed';
        return !isDone;
      });
      setProjects(activeOnly);
      setLoading(false);
    }
  };

  const handleOpenBoard = (projectObj) => {
    localStorage.setItem('activeProjectId', projectObj._id);
    localStorage.setItem('activeProjectName', projectObj.name);
    localStorage.setItem('activeProjectDesc', projectObj.description || 'No description.');
    window.location.href = `/kanban/${projectObj._id}`;
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const newProjId = "proj_" + Date.now();
    const newProjectObj = {
      _id: newProjId,
      name: projectName,
      description: projectDesc || 'No description.',
    };

    localStorage.setItem('activeProjectId', newProjId);
    localStorage.setItem('activeProjectName', projectName);
    localStorage.setItem('activeProjectDesc', projectDesc || 'No description.');
    localStorage.setItem(`project_status_${newProjId}`, 'In Progress');

    const localSavedProjects = JSON.parse(localStorage.getItem('savedProjectsList')) || [];
    const updatedList = [newProjectObj, ...localSavedProjects];
    localStorage.setItem('savedProjectsList', JSON.stringify(updatedList));

    setAllProjects(updatedList);
    setProjects(updatedList.filter(p => localStorage.getItem(`project_status_${p._id}`) !== 'Completed'));

    try {
      const response = await axios.post('http://127.0.0', {
        name: projectName,
        description: projectDesc
      });
      if (response.data && response.data._id) {
        newProjectObj._id = response.data._id;
        localStorage.setItem('activeProjectId', response.data._id);
        localStorage.setItem(`project_status_${response.data._id}`, 'In Progress');
        const freshList = updatedList.map(p => p._id === newProjId ? response.data : p);
        localStorage.setItem('savedProjectsList', JSON.stringify(freshList));
        setAllProjects(freshList);
      }
    } catch (error) {
      console.log('Stored securely.');
    }

    setProjectName('');
    setProjectDesc('');
    window.location.href = `/kanban/${localStorage.getItem('activeProjectId')}`;
  };

  const completedProjects = allProjects.filter(p => localStorage.getItem(`project_status_${p._id}`) === 'Completed');
  return (
    <div style={{ padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', maxWidth: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 50%, #bcccdc 100%)', margin: 0 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '32px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', padding: '10px', borderRadius: '14px', color: 'white', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>💼</div>
            <div>
              <h1 style={{ color: '#0f172a', margin: 0, fontSize: '30px', fontWeight: '800', letterSpacing: '-0.5px' }}>Sandeep Project Hub</h1>
              <p style={{ color: '#486581', margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>Manage and sync your workspace infrastructure live</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowCompleted(!showCompleted)} 
            style={{ padding: '12px 20px', background: showCompleted ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
          >
            {showCompleted ? '📂 View Active Production' : `✅ View Completed Archives (${completedProjects.length})`}
          </button>
        </div>
        
        {!showCompleted && (
          <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', marginBottom: '40px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>✨ Initialize Workspace Pipeline</h3>
            <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Enter Project Name..." 
                  value={projectName} 
                  onChange={(e) => setProjectName(e.target.value)} 
                  style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', flex: 1, minWidth: '260px', fontSize: '15px', outline: 'none', background: 'white' }} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Provide a brief description..." 
                  value={projectDesc} 
                  onChange={(e) => setProjectDesc(e.target.value)} 
                  style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', flex: 2, minWidth: '300px', fontSize: '15px', outline: 'none', background: 'white' }} 
                />
              </div>
              <button type="submit" style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', width: 'fit-content', alignSelf: 'flex-start' }}>
                🚀 Deploy to Database & Launch Board
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>
          <h2 style={{ color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: '700' }}>
            {showCompleted ? '🏁 Completed Archive Registries' : '📂 Active Production Environments'}
          </h2>
          <span style={{ background: showCompleted ? '#10b981' : '#2563eb', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
            {showCompleted ? completedProjects.length : projects.length} Total
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#486581', fontWeight: '600' }}>🔄 Accessing database clusters...</div>
        ) : !showCompleted ? (
          projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.5)', border: '2px dashed #9fb3c8', backdropFilter: 'blur(5px)' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
              <p style={{ color: '#486581', fontStyle: 'italic', margin: 0, fontSize: '15px', fontWeight: '500' }}>All environments successfully cleared or marked done! Deploy a new stack to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
              {projects.map((project) => (
                <div key={project._id} style={{ border: '1px solid rgba(255,255,255,0.7)', padding: '24px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'between', backdropFilter: 'blur(5px)' }}>
                  <div>
                    <h3 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>{project.name}</h3>
                    <p style={{ color: '#486581', fontSize: '14px', lineHeight: '1.5', margin: '0 0 16px 0', minHeight: '42px' }}>{project.description}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ background: '#fffbeb', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid #fde68a' }}>
                      ⚡ In Progress
                    </span>
                    <button onClick={() => handleOpenBoard(project)} style={{ color: '#2563eb', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                      Open Console →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          completedProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.5)', border: '2px dashed #9fb3c8', backdropFilter: 'blur(5px)' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
              <p style={{ color: '#486581', fontStyle: 'italic', margin: 0, fontSize: '15px', fontWeight: '500' }}>No archives found. Complete all tasks on a board to archive a project here.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
              {completedProjects.map((project) => (
                <div key={project._id} style={{ border: '1px solid rgba(255,255,255,0.7)', padding: '24px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'between', backdropFilter: 'blur(5px)' }}>
                  <div>
                    <h3 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>{project.name}</h3>
                    <p style={{ color: '#486581', fontSize: '14px', lineHeight: '1.5', margin: '0 0 16px 0', minHeight: '42px' }}>{project.description}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ background: '#dcfce7', color: '#14532d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid #bbf7d0' }}>
                      ✅ Completed
                    </span>
                    <button onClick={() => handleOpenBoard(project)} style={{ color: '#10b981', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                      Review Done Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
