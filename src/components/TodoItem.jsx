import { useState } from 'react'

function TodoItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(task.text)

  function commitEdit() {
    const trimmed = draft.trim()
    if (trimmed) {
      onEdit(task.id, trimmed)
    } else {
      setDraft(task.text)
    }
    setIsEditing(false)
  }

  return (
    <li className={task.done ? 'todo-item done' : 'todo-item'}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.text}" as ${task.done ? 'active' : 'done'}`}
      />

      {isEditing ? (
        <input
          type="text"
          className="todo-edit-input"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit()
            if (e.key === 'Escape') {
              setDraft(task.text)
              setIsEditing(false)
            }
          }}
        />
      ) : (
        <span className="todo-text" onDoubleClick={() => setIsEditing(true)}>
          {task.text}
        </span>
      )}

      <button
        type="button"
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete "${task.text}"`}
      >
        ✕
      </button>
    </li>
  )
}

export default TodoItem
