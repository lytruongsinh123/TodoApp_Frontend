import React, { useEffect, useState } from "react";
import "./OverDueTask.css";
import type { Task } from "../../types/task";
import Header from "../../layout/Header";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const OverDueTask: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const res = await fetch(`${backendUrl}/api/tasks/overdue`);
                const data = res.ok ? await res.json() : [];
                setTasks(data);
            } catch {
                setTasks([]);
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();
    }, []);

    // Lọc các task chưa hoàn thành trong tháng hiện tại
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const monthTasks = tasks.filter((task) => {
        if (task.completed) return false;
        if (!task.dueDate) return false;
        const [year, month] = task.dueDate.split("-").map(Number);
        return year === currentYear && month === currentMonth;
    });

    return (
        <>
            <Header />
            <div className="overdue-task-wrapper">
                <div className="overdue-task-container">
                    <h2 className="overdue-task-title">
                        📅 Work not completed this month
                    </h2>
                    {loading ? (
                        <div className="overdue-task-loading">Loading...</div>
                    ) : monthTasks.length === 0 ? (
                        <div className="overdue-task-empty">
                            No unfinished work this month!
                        </div>
                    ) : (
                        <ul className="overdue-task-list">
                            {monthTasks.map((task) => (
                                <li className="overdue-task-card" key={task.id}>
                                    <div className="overdue-task-main">
                                        <span className="overdue-task-name">
                                            {task.title}
                                        </span>
                                        <span className="overdue-task-importance">
                                            {task.importance === 2
                                                ? "🔥 Urgent"
                                                : task.importance === 1
                                                ? "⚡ Priority"
                                                : "Normal"}
                                        </span>
                                    </div>
                                    {task.description && (
                                        <div className="overdue-task-desc">
                                            {task.description}
                                        </div>
                                    )}
                                    <div className="overdue-task-meta">
                                        <span>
                                            Start Date: <b>{task.startDate}</b>
                                        </span>
                                        <span>
                                            Due Date: <b>{task.dueDate}</b>
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default OverDueTask;
