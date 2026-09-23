const calculateActiveProjects = (allProjects, projectStatusMap) => {
  return allProjects.filter(p => projectStatusMap[p._id] !== 'Completed');
};

describe('Sandeep Project Hub - Week 5 Core Test Suite', () => {
  
  test('TC-VALID-01: Should correctly calculate total active environments', () => {
    const mockProjects = [
      { _id: 'p1', name: 'Database Cluster A' },
      { _id: 'p2', name: 'Express Router Pipeline B' }
    ];
    const mockStatusMap = {
      'p1': 'In Progress',
      'p2': 'In Progress'
    };
    
    const active = calculateActiveProjects(mockProjects, mockStatusMap);
    expect(active.length).toBe(2);
  });

  test('TC-FILTER-02: Should automatically filter out completed production layers', () => {
    const mockProjects = [
      { _id: 'p1', name: 'Database Cluster A' },
      { _id: 'p2', name: 'Express Router Pipeline B' }
    ];
    const mockStatusMap = {
      'p1': 'Completed',
      'p2': 'In Progress'
    };
    
    const active = calculateActiveProjects(mockProjects, mockStatusMap);
    expect(active.length).toBe(1);
  });

});
