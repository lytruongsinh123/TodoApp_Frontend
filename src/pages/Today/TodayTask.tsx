import React, { useEffect, useState } from "react";
import "./TodayTask.css";
import type { Task } from "../../types/task";
import Header from "../../layout/Header";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const TodayTask: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            const today = new Date().toISOString().slice(0, 10);
            try {
                const res = await fetch(
                    `${backendUrl}/api/tasks/by-date?date=${today}`
                );
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
    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        const todayTasks = tasks.filter(
            (task) => task.dueDate === today && !task.completed
        );
        if ("Notification" in window && todayTasks.length > 0) {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification(
                        `Bạn có ${todayTasks.length} công việc cần làm hôm nay!`
                    );
                }
            });
        }
    }, [tasks]);
    const handleCompleteTask = async (task: Task) => {
        await fetch(`${backendUrl}/api/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                completed: true,
            }),
        });
        // Sau khi hoàn thành, reload lại danh sách
        const res = await fetch(
            `${backendUrl}/api/tasks/by-date?date=${today}`
        );
        const data = res.ok ? await res.json() : [];
        setTasks(data);
    };
    const fetchTasksToday = async () => {
        const today = new Date().toISOString().slice(0, 10);
        const res = await fetch(
            `${backendUrl}/api/tasks/by-date?date=${today}`
        );
        const data = res.ok ? await res.json() : [];
        setTasks(data);
    };
    // Lọc ra các task có ngày đến hạn là hôm nay và chưa hoàn thành
    const today = new Date().toISOString().slice(0, 10);
    const todayTasks = tasks.filter(
        (task) => task.dueDate === today && !task.completed
    );

    return (
        <>
            <Header fetchTasksToday={fetchTasksToday} />
            <div className="today-task-wrapper">
                <div className="today-task-container">
                    <h2 className="today-task-title">
                        🗓️ Things to do today
                    </h2>
                    {loading ? (
                        <div className="today-task-loading">Loading...</div>
                    ) : todayTasks.length === 0 ? (
                        <div className="today-task-empty">
                            No work to do today!
                        </div>
                    ) : (
                        <ul className="today-task-list">
                            {todayTasks.map((task) => (
                                <li className="today-task-card" key={task.id}>
                                    <div className="today-task-main">
                                        <span className="today-task-name">
                                            {task.title}
                                        </span>
                                        <span className="today-task-importance">
                                            {task.importance === 2
                                                ? "🔥 Urgent"
                                                : task.importance === 1
                                                ? "⚡ Priority"
                                                : "Normal"}
                                        </span>
                                    </div>
                                    {task.description && (
                                        <div className="today-task-desc">
                                            {task.description}
                                        </div>
                                    )}
                                    <div className="today-task-meta">
                                        <span>
                                            Start Date: <b>{task.startDate}</b>
                                        </span>
                                        <span>
                                            Due Date: <b>{task.dueDate} Hôm nay</b>
                                        </span>
                                    </div>
                                    <div>
                                        <button
                                            className="complete-tody-task"
                                            onClick={async () => {
                                                handleCompleteTask(task);
                                            }}>
                                            Finish
                                        </button>
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

export default TodayTask;
