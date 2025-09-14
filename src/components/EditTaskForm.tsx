import React, { useState } from "react";
import "./EditTaskForm.css";
import type { Task } from "../types/task";

interface EditTaskFormProps {
    task: Task;
    setIsOpen: (open: boolean) => void;
    onUpdate: (updatedTask: Task) => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
    task,
    setIsOpen,
    onUpdate,
}) => {
    const [title, setTitle] = useState(task.title);
    const [importance, setImportance] = useState(task.importance);
    const [startDate, setStartDate] = useState(task.startDate);
    const [dueDate, setDueDate] = useState(task.dueDate || "");
    const [description, setDescription] = useState(task.description);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTask: Task = {
            ...task,
            title,
            importance,
            startDate,
            dueDate,
            description,
        };
        onUpdate(updatedTask);
        setIsOpen(false);
    };

    return (
        <form className="edit-task-form" onSubmit={handleSubmit}>
            <div className="edit-task-header">
                <h2>📝 Edit assignment</h2>
                <button
                    type="button"
                    className="edit-task-close"
                    onClick={() => setIsOpen(false)}
                    aria-label="Đóng">
                    ×
                </button>
            </div>
            <div className="edit-task-fields">
                <div className="edit-task-field">
                    <label>Job Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter job name"
                    />
                </div>
                <div className="edit-task-field">
                    <label>Level of importance</label>
                    <select
                        value={importance}
                        onChange={(e) => setImportance(Number(e.target.value))}>
                        <option value={0}>Normal</option>
                        <option value={1}>Priority</option>
                        <option value={2}>Urgent</option>
                    </select>
                </div>
            </div>
            <div className="edit-task-fields">
                <div className="edit-task-field">
                    <label>Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="edit-task-field">
                    <label>Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
            </div>
            <div className="edit-task-field" style={{ width: "100%" }}>
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed job description (optional)"
                    rows={4}
                />
            </div>
            <div className="edit-task-actions">
                <button type="submit" className="edit-task-save">
                    💾 Save changes
                </button>
                <button
                    type="button"
                    className="edit-task-cancel"
                    onClick={() => setIsOpen(false)}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditTaskForm;
