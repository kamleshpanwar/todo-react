import { useEffect, useMemo, useState } from 'react'
import TodoItem from './TodoItem'
import './TodoApp.css'

const STORAGE_KEY = 'daily-todo.tasks'

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function TodoApp() {
  const [tasks, setTasks] = useState(loadTasks)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks((prev) => [
      { id: crypto.randomUUID(), text: trimmed, done: false },
      ...prev,
    ])
    setText('')
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function editTask(id, newText) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t)),
    )
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.done))
  }

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.done)
    if (filter === 'completed') return tasks.filter((t) => t.done)
    return tasks
  }, [tasks, filter])

  const remaining = tasks.filter((t) => !t.done).length

  return (
    <div className="todo-app">
      <header className="todo-header">
        <h1>Daily To-Do</h1>
        <p className="todo-date">{todayLabel()}</p>
      </header>

      <form className="todo-form" onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you need to do today?"
          aria-label="New task"
        />
        <button type="submit">Add</button>
      </form>

      <div className="todo-filters">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter(f)}
            type="button"
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {visibleTasks.length === 0 && (
          <li className="todo-empty">
            {tasks.length === 0
              ? 'Nothing here yet — add your first task.'
              : 'No tasks match this filter.'}
          </li>
        )}
        {visibleTasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        ))}
      </ul>

      <footer className="todo-footer">
        <span>
          {remaining} {remaining === 1 ? 'task' : 'tasks'} left
        </span>
        <button
          type="button"
          className="clear-btn"
          onClick={clearCompleted}
          disabled={tasks.every((t) => !t.done)}
        >
          Clear completed
        </button>
      </footer>
    </div>
  )
}

export default TodoApp
