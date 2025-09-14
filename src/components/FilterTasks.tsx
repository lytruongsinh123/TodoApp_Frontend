import React from "react";
import type { Task } from "../types/task";
import "./FilterTasks.css";
interface FilterTasksProps {
    tasks: Task[];
    status: string;
}

const FilterTasks: React.FC<FilterTasksProps> = ({ tasks, status }) => {
    if (!tasks || tasks.length === 0) {
        return <div>No jobs available.</div>;
    }

    return (
        <div className="filter-task-table-wrapper">
            <table className="filter-task-table">
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Start Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td className="filter-task-title">{task.title}</td>
                            <td>{task.startDate}</td>
                            <td>{task.dueDate || "-"}</td>
                            <td>{status}</td>
                            <td>
                                {task.description ? (
                                    <span className="filter-task-desc">
                                        {task.description}
                                    </span>
                                ) : (
                                    <span style={{ color: "#888" }}>-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FilterTasks;
