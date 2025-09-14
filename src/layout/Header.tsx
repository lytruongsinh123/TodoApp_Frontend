import "./Header.css";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import AddTaskForm from "../components/AddTaskForm";
import { useState } from "react";
import type { Task } from "../types/task";
import NavigationBar from "../pages/NavigationBar/NavigationBar";
interface HeaderProps {
    setTasks?: (tasks: Task[]) => void;
    fetchTasksToday?: () => void;
}
const Header: React.FC<HeaderProps> = ({ setTasks, fetchTasksToday }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="header-content">
                        <div className="logo">
                            <FontAwesomeIcon
                                icon={faListCheck}
                                className="icon-lg"
                            />
                            <h1 className="logo-text">TimeFlow VN</h1>
                        </div>
                        <button className="btn" onClick={() => setIsOpen(true)}>
                            <FontAwesomeIcon
                                icon={faPlusCircle}
                                className="icon-sm"
                            />
                            Add Task
                        </button>
                    </div>
                </div>
                <NavigationBar />
            </header>
            <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
                <AddTaskForm
                    setIsOpen={setIsOpen}
                    setTasks={setTasks}
                    fetchTasksToday={fetchTasksToday}
                />
            </Modal>
        </>
    );
};
export default Header;
