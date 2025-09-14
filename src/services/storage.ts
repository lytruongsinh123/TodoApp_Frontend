import type { Task } from "../types/task";

const STORAGE_KEY = "tasks";

export function loadTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveTasks(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function removeTaskById(id: string) {
    const tasks = loadTasks();
    const updated = tasks.filter((task) => task.id !== id);
    saveTasks(updated);
}
