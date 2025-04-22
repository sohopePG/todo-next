"use client";
import { useState, useEffect } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // TodoリストをAPIから取得
  async function fetchTodos() {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      alert("Failed to load todos");
    }
  }

  // 初回レンダリング時に取得
  useEffect(() => {
    fetchTodos();
  }, []);

  // Todoを追加
  async function addTodo() {
    if (!newTodo.trim()) return;
    const tempId = crypto.randomUUID();
    const optimisticTodo = { id: tempId, title: newTodo, completed: false };
    setTodos([...todos, optimisticTodo]);
    setNewTodo("");
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ title: newTodo }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to add");
    } catch (error) {
      setTodos(todos.filter((todo) => todo.id !== tempId));
      alert("Failed to add todo");
    }
  }

  // 完了状態を切り替え
  async function toggleComplete(id, completed) {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)));
    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        body: JSON.stringify({ id, completed: !completed }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (error) {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)));
      alert("Failed to update todo");
    }
  }

  // Todoを削除
  async function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchTodos();
    } catch (error) {
      setTodos([...todos, todos.find((todo) => todo.id === id)]);
      alert("Failed to delete todo");
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white space-y-6">
      <h1 className="text-2xl font-bold text-center">Todo List</h1>
      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new todo..."
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center px-2 py-2 rounded gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.completed)}
              className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
            />
            <span className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}>
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              DELETE
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}