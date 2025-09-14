import React, { useState } from "react";
import "./TaskList.css";
import type { Task } from "../types/task";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faCheckDouble,
    faPen,
} from "@fortawesome/free-solid-svg-icons";
import EditTaskForm from "../components/EditTaskForm";
import Modal from "react-modal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface TaskListProps {
    tasks: Task[];
    setTasks?: (tasks: Task[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks }) => {
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [openDescId, setOpenDescId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${backendUrl}/api/tasks/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (setTasks) {
                // Sau khi xóa, lấy lại danh sách mới từ backend
                const res = await fetch(`${backendUrl}/api/tasks`);
                const data = res.ok ? await res.json() : [];
                setTasks(data);
            }
        } catch {
            // Có thể hiển thị thông báo lỗi nếu muốn
        }
    };
    const handleCompleteTask = async (id: string, completed: boolean) => {
        try {
            await fetch(`${backendUrl}/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed }),
            });
            if (setTasks) {
                const res = await fetch(`${backendUrl}/api/tasks`);
                const data = res.ok ? await res.json() : [];
                setTasks(data);
            }
        } catch {
            // Có thể hiển thị thông báo lỗi nếu muốn
        }
    };
    const handleUpdateTask = async (updatedTask: Task) => {
        try {
            await fetch(`${backendUrl}/api/tasks/${updatedTask.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTask),
            });
            if (setTasks) {
                const res = await fetch(`${backendUrl}/api/tasks`);
                const data = res.ok ? await res.json() : [];
                setTasks(data);
            }
        } catch {}
    };
    const completedTasks = tasks.filter((task) => task.completed);
    const uncompletedTasks = tasks.filter((task) => !task.completed);

    return (
        <div className="task-list">
            <Modal
                isOpen={isEditOpen}
                onRequestClose={() => setIsEditOpen(false)}
                ariaHideApp={false}
                className="modal-content"
                overlayClassName="modal-overlay">
                {editTask && setTasks && (
                    <EditTaskForm
                        task={editTask}
                        setIsOpen={setIsEditOpen}
                        onUpdate={handleUpdateTask}
                    />
                )}
            </Modal>
            <h2 className="uncomplete-task">
                <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{ marginRight: 8 }}
                />
                Unfinished
            </h2>
            {uncompletedTasks.length === 0 && (
                <div
                    style={{
                        color: "#38bdf8",
                        textAlign: "center",
                        marginBottom: 32,
                    }}>
                    There is no unfinished business.
                </div>
            )}
            {uncompletedTasks.map((task) => (
                <div
                    className={`task-card${task.completed ? " completed" : ""}`}
                    key={task.id}>
                    <div className="task-title">
                        {task.title}
                        <div
                            className="edit-task-btn"
                            title="Chỉnh sửa"
                            onClick={() => {
                                setEditTask(task);
                                setIsEditOpen(true);
                            }}>
                            <FontAwesomeIcon icon={faPen} />
                        </div>
                    </div>
                    <div className="task-meta">
                        <span className="task-date">
                            <span role="img" aria-label="start">
                                🟢
                            </span>{" "}
                            {task.startDate}
                        </span>
                        <span className="task-date">
                            <span role="img" aria-label="due">
                                ⏰
                            </span>{" "}
                            {task.dueDate || "-"}
                        </span>
                        <span
                            className="task-badge"
                            style={{
                                background: task.completed
                                    ? "linear-gradient(90deg, #38bdf8 0%, #5ff281 100%)"
                                    : undefined,
                            }}>
                            {task.completed
                                ? "completed"
                                : "uncompleted"}
                        </span>
                        <span className="task-importance">
                            {task.importance === 2
                                ? "🔥 Urgent"
                                : task.importance === 1
                                ? "⚡ Priority"
                                : "Normal"}
                        </span>
                    </div>
                    <span
                        className="more-btn"
                        onClick={() =>
                            setOpenDescId(
                                openDescId === task.id ? null : task.id
                            )
                        }>
                        {openDescId === task.id ? "Hide description" : "See more"}
                    </span>
                    {openDescId === task.id && (
                        <div className="task-desc">
                            <strong>Description:</strong>{" "}
                            {task.description || "No description"}
                        </div>
                    )}
                    <div className="task-meta" style={{ marginTop: 12 }}>
                        <button
                            style={{ minWidth: 100 }}
                            onClick={
                                () => handleCompleteTask(task.id, true) // Hoàn thành
                            }>
                            {task.completed ? "Undo" : "Finish"}
                        </button>
                        <button
                            style={{ minWidth: 80 }}
                            onClick={() => handleDelete(task.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}

            <h2 className="complete-task">
                <FontAwesomeIcon
                    icon={faCheckDouble}
                    style={{ marginRight: 8 }}
                />
                Completed
            </h2>
            {completedTasks.length === 0 && (
                <div
                    style={{
                        color: "#38bdf8",
                        textAlign: "center",
                        marginBottom: 32,
                    }}>
                    No work has been completed.
                </div>
            )}
            {completedTasks.map((task) => (
                <div
                    className={`task-card${task.completed ? " completed" : ""}`}
                    key={task.id}>
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                        <span className="task-date">
                            <span role="img" aria-label="start">
                                🟢
                            </span>{" "}
                            {task.startDate}
                        </span>
                        <span className="task-date">
                            <span role="img" aria-label="due">
                                ⏰
                            </span>{" "}
                            {task.dueDate || "-"}
                        </span>
                        <span
                            className="task-badge"
                            style={{
                                background: task.completed
                                    ? "linear-gradient(90deg, #38bdf8 0%, #5ff281 100%)"
                                    : undefined,
                            }}>
                            {task.completed
                                ? "completed"
                                : "uncompleted"}
                        </span>
                    </div>
                    <div className="task-meta" style={{ marginTop: 12 }}>
                        <button
                            style={{ minWidth: 100 }}
                            onClick={
                                () => handleCompleteTask(task.id, false) // Hoàn thành
                            }>
                            {task.completed ? "Undo" : "Finish"}
                        </button>
                        <button
                            style={{ minWidth: 80 }}
                            onClick={() => handleDelete(task.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
