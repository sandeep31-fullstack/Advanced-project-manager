import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FullStackDashboard from 'C:/advanced-project-manager/src/FullStackDashboard.jsx';
import FullStackKanban from 'C:/advanced-project-manager/src/FullStackKanban.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Landing Page */}
        <Route path="/" element={<FullStackDashboard />} />
        
        {/* Dedicated Full-Stack Routes */}
        <Route path="/fullstack-dashboard" element={<FullStackDashboard />} />
        <Route path="/kanban/:projectId" element={<FullStackKanban />} />
      </Routes>
    </Router>
  );
}

export default App;
