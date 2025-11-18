import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  const apiUrl = 'http://localhost:8080/api/todos';

  useEffect(() => {
    axios.get(apiUrl)
      .then(res => setTodos(res.data))
      .catch(console.error);
  }, []);

  const addTodo = () => {
    if (!newTitle.trim()) return;
    axios.post(apiUrl, { title: newTitle, completed: false })
      .then(res => {
        setTodos([...todos, res.data]);
        setNewTitle('');
      })
      .catch(console.error);
  };

  const toggleTodo = (todo) => {
    axios.put(`${apiUrl}/${todo.id}`, {
      ...todo,
      completed: !todo.completed
    }).then(res => {
      setTodos(todos.map(t => t.id === todo.id ? res.data : t));
    }).catch(console.error);
  };

  const deleteTodo = (id) => {
    axios.delete(`${apiUrl}/${id}`)
      .then(() => {
        setTodos(todos.filter(t => t.id !== id));
      })
      .catch(console.error);
  };

  return (
    <div className="container">
    <h1 className="heading">NoteMe</h1>
  
      <div className="input-group">
        <input
          className="input"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Enter a new task"
          onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
        />
        <button className="button" onClick={addTodo}>Add</button>
      </div>

      <ul className="list">
        {todos.map(todo => (
          <li key={todo.id} className="list-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
              className="checkbox"
            />
            <span className={`todo-title${todo.completed ? ' completed' : ''}`}>
              {todo.title}
            </span>
            <button className="delete-button" onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.title}`}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
