"use client";

import { useState, useEffect } from "react";

type Filter = "all" | "active" | "done";

interface Task {
  id: number;
  text: string;
  done: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  const save = (next: Task[]) => {
    setTasks(next);
    localStorage.setItem("tasks", JSON.stringify(next));
  };

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    save([{ id: Date.now(), text, done: false }, ...tasks]);
    setInput("");
  };

  const toggle = (id: number) =>
    save(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: number) => save(tasks.filter((t) => t.id !== id));

  const clearDone = () => save(tasks.filter((t) => !t.done));

  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );

  const activeCount = tasks.filter((t) => !t.done).length;

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📝 TODO</h1>

        {/* 入力欄 */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none bg-white text-gray-800 transition"
            placeholder="新しいタスクを入力..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button
            onClick={addTask}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white rounded-xl text-xl font-bold transition"
          >
            ＋
          </button>
        </div>

        {/* フィルター */}
        <div className="flex gap-2 mb-4">
          {(["all", "active", "done"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm border-2 transition font-medium ${
                filter === f
                  ? "bg-indigo-500 border-indigo-500 text-white"
                  : "bg-white border-gray-200 text-gray-500 hover:border-indigo-300"
              }`}
            >
              {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了"}
            </button>
          ))}
        </div>

        {/* タスク一覧 */}
        <div className="flex flex-col gap-2">
          {visible.length === 0 ? (
            <p className="text-center text-gray-400 py-10">タスクがありません</p>
          ) : (
            visible.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggle(task.id)}
                  className="w-5 h-5 accent-indigo-500 cursor-pointer flex-shrink-0"
                />
                <span
                  className={`flex-1 text-base break-all ${
                    task.done ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => remove(task.id)}
                  className="text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-md px-1.5 py-0.5 transition text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* フッター */}
        {tasks.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-400 px-1">
            <span>残り {activeCount} 件 / 全 {tasks.length} 件</span>
            <button
              onClick={clearDone}
              className="underline hover:text-red-400 transition"
            >
              完了済みを削除
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
