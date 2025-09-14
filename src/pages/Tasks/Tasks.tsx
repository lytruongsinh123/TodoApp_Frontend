const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Header from "../../layout/Header";
import { useEffect, useState } from "react";
import TaskList from "../../components/TaskList";
import type { Task } from "../../types/task";
import "./Tasks.css"; 
const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    async function fetchTasks() {
        try {
            const res = await fetch(`${backendUrl}/api/tasks`);
            if (!res.ok) throw new Error("Lỗi khi lấy danh sách task");
            const data = await res.json();
            setTasks(data);
        } catch {
            setTasks([]);
        }
    }
    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <>
            <Header setTasks={setTasks}/>
            <div className="task-wrapper">
                <div className="task-container">
                    <TaskList tasks={tasks} setTasks={setTasks} />
                </div>
            </div>
        </>
    );
};

export default Tasks;
