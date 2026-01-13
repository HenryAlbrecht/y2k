import { useState } from 'react';
import { Window } from './Window';
import { useAppStore } from '../store/useAppStore';

export const ProjectsWindow = () => {
  const { projects, tasks, addProject, deleteProject } = useAppStore();
  const [projectName, setProjectName] = useState('');
  const [projectColor, setProjectColor] = useState('#0078d7');
  const [projectDesc, setProjectDesc] = useState('');

  const handleAddProject = () => {
    if (!projectName) return;
    addProject(projectName, projectColor, projectDesc);
    setProjectName('');
    setProjectColor('#0078d7');
    setProjectDesc('');
  };

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const completed = projectTasks.filter((t) => t.completed).length;
    const inProgress = projectTasks.filter((t) => t.status === 'in-progress').length;
    const total = projectTasks.length;
    return { total, completed, inProgress, pending: total - completed };
  };

  return (
    <Window
      id="projects"
      title="Project Manager v1.0"
      icon="📁"
      defaultPosition={{ x: 200, y: 80 }}
      defaultSize={{ width: 500, height: 500 }}
    >
      <div className="add-task-form" style={{ background: '#e0f0ff', borderColor: 'var(--neon-cyan)' }}>
        <label style={{ fontWeight: 'bold' }}>New Project:</label>
        <input
          type="text"
          placeholder="Project Name..."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddProject()}
        />
        <textarea
          rows={2}
          placeholder="Description (optional)..."
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
          style={{ resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold' }}>Color:</label>
          <input
            type="color"
            value={projectColor}
            onChange={(e) => setProjectColor(e.target.value)}
            style={{ width: '60px', height: '30px', cursor: 'pointer' }}
          />
          <button className="retro-btn primary" onClick={handleAddProject} style={{ marginLeft: 'auto' }}>
            Create Project
          </button>
        </div>
      </div>

      <h3 style={{ marginTop: '15px', marginBottom: '10px' }}>Your Projects ({projects.length}):</h3>
      <ul className="task-list">
        {projects.map((project) => {
          const stats = getProjectStats(project.id);
          const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
          
          return (
            <li key={project.id} className="task-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  background: project.color, 
                  border: '2px solid #000',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <span className="task-title">📁 {project.name}</span>
                  {project.description && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                      {project.description}
                    </div>
                  )}
                  
                  <div style={{ marginTop: '8px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>Progress: {progress}%</span>
                      <span>{stats.completed}/{stats.total} tasks</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '12px', 
                      background: '#fff', 
                      border: '2px inset #ccc',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: project.color,
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      marginTop: '5px',
                      fontSize: '11px',
                      color: '#666'
                    }}>
                      <span>▶ {stats.inProgress} in progress</span>
                      <span>⏸ {stats.pending} pending</span>
                      <span>✓ {stats.completed} done</span>
                    </div>
                  </div>
                </div>
                <button
                  className="retro-btn"
                  style={{ fontSize: '12px' }}
                  onClick={() => {
                    if (confirm('Delete project? Tasks will lose their association.')) {
                      deleteProject(project.id);
                    }
                  }}
                >
                  DEL
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </Window>
  );
};
