import { Link } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = () => (
    <nav className="NavigationBar-todoapp">
        <ul>
            <li>
                <Link to="/tasks">To do list</Link>
            </li>
            <li>
                <Link to="/today">Today's work</Link>
            </li>
            <li>
                <Link to="/analytics">Performance</Link>
            </li>
            <li>
                <Link to="/overdue-tasks">Overdue Task</Link>
            </li>
            <li>
                <Link to="/calendar">Task Calendar</Link>
            </li>
        </ul>
    </nav>
);

export default NavigationBar;
