import React, { useState, useMemo } from 'react';

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Low',
  });
  const [filter, setFilter] = useState({
    priority: '',
    startDate: '',
    endDate: '',
  });

  const priorities = {
    High: 'red',
    Medium: 'orange',
    Low: 'green',
  };

  // Add a task
  const addTask = (e) => {
    e.preventDefault();
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Low',
    });
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Update a task
  const updateTask = (id, updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const priorityMatch =
        !filter.priority || task.priority === filter.priority;
      const startDateMatch =
        !filter.startDate ||
        new Date(task.dueDate) >= new Date(filter.startDate);
      const endDateMatch =
        !filter.endDate || new Date(task.dueDate) <= new Date(filter.endDate);
      return priorityMatch && startDateMatch && endDateMatch;
    });
  }, [tasks, filter]);

  // Statistics
  const stats = useMemo(() => {
    const highPriorityCount = tasks.filter(
      (task) => task.priority === 'High'
    ).length;
    return { total: tasks.length, highPriority: highPriorityCount };
  }, [tasks]);

  return (
    <div className="task-app">
      <h1>Task Manager</h1>
      <div className="summary">
        <p>Total Tasks: {stats.total}</p>
        <p>High Priority: {stats.highPriority}</p>
      </div>
      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          {Object.keys(priorities).map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <button type="submit">Add Task</button>
      </form>
      <div className="filter-form">
        <select
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          {Object.keys(priorities).map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Start Date"
          onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
        />
        <input
          type="date"
          placeholder="End Date"
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
        />
      </div>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onUpdate={updateTask}
            priorities={priorities}
          />
        ))}
      </ul>
    </div>
  );
};

const TaskItem = ({ task, onDelete, onUpdate, priorities }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = () => {
    if (isEditing) {
      onUpdate(task.id, editedTask);
    }
    setIsEditing(!isEditing);
  };

  return (
    <li
      style={{ borderLeft: `5px solid ${priorities[task.priority]}` }}
      className="task-item"
    >
      {isEditing ? (
        <>
          <input
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
          />
          <textarea
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
          />
          <input
            type="date"
            value={editedTask.dueDate}
            onChange={(e) =>
              setEditedTask({ ...editedTask, dueDate: e.target.value })
            }
          />
          <select
            value={editedTask.priority}
            onChange={(e) =>
              setEditedTask({ ...editedTask, priority: e.target.value })
            }
          >
            {Object.keys(priorities).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>
            Due: {task.dueDate} | Priority:{' '}
            <span style={{ color: priorities[task.priority] }}>
              {task.priority}
            </span>
          </p>
        </>
      )}
      <div>
        <button onClick={handleEdit}>{isEditing ? 'Save' : 'Edit'}</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>
  );
};

export default TaskApp;

// CSS styles injected into the document
const styles = `
.task-app {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.summary, .task-form, .filter-form {
  margin-bottom: 20px;
}

.task-form input, .task-form textarea, .task-form select, .filter-form input, .filter-form select {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
}

.task-item {
  background: #fff;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.task-item button {
  margin-right: 5px;
}

@media (max-width: 600px) {
  .task-form, .filter-form {
    flex-direction: column;
  }
}
`;

// Inject styles into the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
