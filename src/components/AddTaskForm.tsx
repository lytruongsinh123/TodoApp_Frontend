import React, { useState } from "react";
import "./AddTaskForm.css";
import type { Task } from "../types/task";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
interface AddTaskFormProps {
    setIsOpen?: (open: boolean) => void;
    setTasks?: (tasks: Task[]) => void;
    fetchTasksToday?: () => void;
}

const TaskForm: React.FC<AddTaskFormProps> = ({
    setIsOpen,
    setTasks,
    fetchTasksToday,
}) => {
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [importance, setImportance] = useState(0);
    const [description, setDescription] = useState("");
    async function saveTaskToDatabase(task: Omit<Task, "id">) {
        try {
            const res = await fetch(`${backendUrl}/api/tasks-create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });
            return res.ok;
        } catch {
            return false;
        }
    }
    const onAdd = async (
        title: string,
        importance: number,
        startDate?: string,
        dueDate?: string,
        description?: string
    ) => {
        const newTask = {
            title,
            importance: importance,
            startDate: startDate || "",
            dueDate,
            description: description || "",
            completed: false,
            createdAt: new Date().toISOString(),
        };
        const ok = await saveTaskToDatabase(newTask);
        if (ok) {
            if (setTasks) {
                try {
                    const res = await fetch(`${backendUrl}/api/tasks`);
                    if (res.ok) {
                        const data = await res.json();
                        setTasks(data);
                        
                    }
                } catch {
                    // Có thể xử lý lỗi nếu muốn
                }
            }
            if (fetchTasksToday) fetchTasksToday();
            alert("Đã thêm nhiệm vụ thành công!");
            if (setIsOpen) setIsOpen(false);
        } else {
            alert("Lỗi khi lưu nhiệm vụ hoặc không thể kết nối tới server!");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd(title, importance, startDate, dueDate, description);
            setTitle("");
            setStartDate("");
            setDueDate("");
            setDescription("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="task-form-group">
                <label>Job Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter job name"
                    required
                />
            </div>
            <div className="task-form-group">
                <label>Level of importance</label>
                <select
                    value={importance}
                    onChange={(e) => setImportance(Number(e.target.value))}>
                    <option value={0}>Normal</option>
                    <option value={1}>Prioritize</option>
                    <option value={2}>Urgent</option>
                </select>
            </div>
            <div className="task-form-group">
                <label>Start date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div className="task-form-group">
                <label>Due date</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <div className="task-form-group" style={{ flex: "2 1 100%" }}>
                <label>Job Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed job description (optional)"
                    rows={4}
                />
            </div>
            <div className="task-form-actions">
                <button type="submit">Add job</button>
            </div>
        </form>
    );
};

export default TaskForm;
