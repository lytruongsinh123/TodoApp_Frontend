import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tasks from "./pages/Tasks/Tasks";
import TodayTask from "./pages/Today/TodayTask";
import OverDueTask from "./pages/OverDueTask/OverDueTask";
import Analytics from "./pages/Analytics/Analytics";
import Calendar from "./pages/Calendar/Calendar";
import Home from "./pages/Home/Home"
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/overdue-tasks" element={<OverDueTask />} />
                <Route path="/today" element={<TodayTask />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
