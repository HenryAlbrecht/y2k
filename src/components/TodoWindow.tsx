import { useState } from 'react';
import { Window } from './Window';
import { useAppStore } from '../store/useAppStore';

export const TodoWindow = () => {
  const { tasks, taskFilter, projects, addTask, toggleTask, deleteTask, setTaskFilter, updateTaskStatus } =
    useAppStore();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [date, setDate] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);

  const getDeadlineStatus = (dateStr: string) => {
    if (!dateStr) return null;
    const taskDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays <= 3) return 'soon';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return '#808080';
      case 'in-progress': return '#ffa500';
      case 'completed': return '#00aa00';
      case 'cancelled': return '#ff0000';
      default: return '#808080';
    }
  };

  const handleAddTask = () => {
    if (!title) {
      alert('Error: Task title is missing! System failure imminent!');
      return;
    }

    addTask({ title, desc, priority, date, projectId });
    setTitle('');
    setDesc('');
    setDate('');
    setProjectId(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === 'pending') return !task.completed;
    if (taskFilter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityScore = { high: 3, medium: 2, low: 1 };
    return priorityScore[b.priority] - priorityScore[a.priority];
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const countMessage = pendingCount === 0 ? 'ALL TASKS CLEARED! ✨' : `${pendingCount} PENDING • ${inProgressCount} IN PROGRESS`;

  return (
    <Window
      id="todo"
      title="My Tasks.exe"
      icon="📝"
      defaultPosition={{ x: 150, y: 50 }}
      defaultSize={{ width: 600, height: 650 }}
    >
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <img src="https://media.tenor.com/On7kbqW4tK8AAAAi/sparkles-glitter.gif" width="30" alt="sparkles" />
        <span className="glitter-text" style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px' }}>
          {countMessage}
        </span>
        <img src="https://media.tenor.com/On7kbqW4tK8AAAAi/sparkles-glitter.gif" width="30" alt="sparkles" />
      </div>

      <div className="add-task-form">
        <input
          type="text"
          placeholder="What needs doing?..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow"
        />
        <textarea
          rows={2}
          placeholder="Details (optional)..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{ resize: 'vertical' }}
        />
        <div className="form-row">
          <select value={priority} onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}>
            <option value="high">!!! HIGH !!!</option>
            <option value="medium">Medium</option>
            <option value="low">Low ~chill~</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-grow"
          />
        </div>
        <select value={projectId || 'default'} onChange={(e) => setProjectId(e.target.value === 'default' ? null : e.target.value)}>
          <option value="default">(No Project)</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button className="retro-btn primary" onClick={handleAddTask}>
          ADD TASK!
        </button>
      </div>

      <div className="task-filters">
        <button className="retro-btn" onClick={() => setTaskFilter('all')}>
          All
        </button>
        <button className="retro-btn" onClick={() => setTaskFilter('pending')}>
          Pending
        </button>
        <button className="retro-btn" onClick={() => setTaskFilter('completed')}>
          Done
        </button>
      </div>

      <ul className="task-list">
        {sortedTasks.map((task) => {
          const project = projects.find((p) => p.id === task.projectId);
          const deadlineStatus = getDeadlineStatus(task.date);
          
          return (
            <li key={task.id} className={`task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`}>
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTask(task.id)}
                style={{ cursor: 'pointer' }}
              />
              <div className="task-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span className="task-title">{task.title}</span>
                  {deadlineStatus === 'overdue' && !task.completed && (
                    <span style={{ 
                      background: '#ff0000', 
                      color: 'white', 
                      padding: '2px 6px', 
                      fontSize: '10px', 
                      fontWeight: 'bold',
                      border: '1px solid #000'
                    }}>
                      OVERDUE!
                    </span>
                  )}
                  {deadlineStatus === 'today' && !task.completed && (
                    <span style={{ 
                      background: '#ffa500', 
                      color: 'white', 
                      padding: '2px 6px', 
                      fontSize: '10px', 
                      fontWeight: 'bold',
                      border: '1px solid #000'
                    }}>
                      TODAY
                    </span>
                  )}
                  {deadlineStatus === 'soon' && !task.completed && (
                    <span style={{ 
                      background: '#ffcc00', 
                      color: '#000', 
                      padding: '2px 6px', 
                      fontSize: '10px', 
                      fontWeight: 'bold',
                      border: '1px solid #000'
                    }}>
                      SOON
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as 'not-started' | 'in-progress' | 'completed' | 'cancelled')}
                    style={{
                      padding: '2px 4px',
                      fontSize: '11px',
                      border: `2px solid ${getStatusColor(task.status)}`,
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="not-started">⏸ Not Started</option>
                    <option value="in-progress">▶ In Progress</option>
                    <option value="completed">✓ Completed</option>
                    <option value="cancelled">✕ Cancelled</option>
                  </select>
                  
                  {project && (
                    <span style={{
                      background: project.color,
                      color: 'white',
                      padding: '2px 6px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      border: '1px solid #000'
                    }}>
                      📁 {project.name}
                    </span>
                  )}
                </div>

                <div className="task-meta">
                  {task.date && `📅 ${new Date(task.date).toLocaleDateString('pt-BR')}`}
                  {task.desc && <><br /> &gt; {task.desc}</>}
                </div>
              </div>
              <button
                className="retro-btn"
                style={{ fontSize: '12px', padding: '2px 5px' }}
                onClick={() => {
                  if (confirm('Delete this task? There is no Recycle Bin!')) {
                    deleteTask(task.id);
                  }
                }}
              >
                DEL
              </button>
            </li>
          );
        })}
      </ul>
    </Window>
  );
};
