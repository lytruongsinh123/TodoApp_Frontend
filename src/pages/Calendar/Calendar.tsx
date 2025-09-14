import { useEffect, useState } from "react";
import type { Task } from "../../types/task";
import "./Calendar.css";
import Header from "../../layout/Header";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

const Calendar = () => {
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [selectedDate, setSelectedDate] = useState<string>(
        now.toISOString().slice(0, 10)
    );
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    // Lấy task của tháng hiện tại
    useEffect(() => {
        async function fetchTasks() {
            setLoading(true);
            try {
                const res = await fetch(
                    `${backendUrl}/api/tasks/by-month?month=${
                        currentMonth + 1
                    }&year=${currentYear}`
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
    }, [currentMonth, currentYear]);

    // Tạo mảng ngày trong tháng
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0: Chủ nhật
    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    // Lọc task theo ngày được chọn
    const tasksOfSelectedDate = tasks.filter(
        (task) => task.dueDate === selectedDate
    );

    // Đổi tháng
    const changeMonth = (offset: number) => {
        let newMonth = currentMonth + offset;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        // Nếu ngày đang chọn không thuộc tháng mới, chọn ngày 1
        setSelectedDate(
            `${newYear}-${String(newMonth + 1).padStart(2, "0")}-01`
        );
    };

    return (
        <>
            <Header/>
            <div className="calendar-wrapper">
                <div className="calendar-horizontal">
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <button onClick={() => changeMonth(-1)}>
                                &lt;
                            </button>
                            <span>
                                {currentYear} -{" "}
                                {String(currentMonth + 1).padStart(2, "0")}
                            </span>
                            <button onClick={() => changeMonth(1)}>&gt;</button>
                        </div>
                        <div className="calendar-grid">
                            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(
                                (d) => (
                                    <div key={d} className="calendar-day-name">
                                        {d}
                                    </div>
                                )
                            )}
                            {calendarDays.map((d, idx) =>
                                d ? (
                                    <div
                                        key={idx}
                                        className={
                                            "calendar-day" +
                                            (selectedDate ===
                                            `${currentYear}-${String(
                                                currentMonth + 1
                                            ).padStart(2, "0")}-${String(
                                                d
                                            ).padStart(2, "0")}`
                                                ? " selected"
                                                : "") +
                                            (tasks.some(
                                                (t) =>
                                                    t.dueDate ===
                                                    `${currentYear}-${String(
                                                        currentMonth + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}-${String(d).padStart(
                                                        2,
                                                        "0"
                                                    )}`
                                            )
                                                ? " has-task"
                                                : "")
                                        }
                                        onClick={() =>
                                            setSelectedDate(
                                                `${currentYear}-${String(
                                                    currentMonth + 1
                                                ).padStart(2, "0")}-${String(
                                                    d
                                                ).padStart(2, "0")}`
                                            )
                                        }>
                                        {d}
                                    </div>
                                ) : (
                                    <div
                                        key={idx}
                                        className="calendar-day empty"></div>
                                )
                            )}
                        </div>
                    </div>
                    <div className="calendar-tasks-list">
                        <h3>
                            Daily work{" "}
                            {selectedDate.split("-").reverse().join("/")}
                        </h3>
                        {loading ? (
                            <div>Loading...</div>
                        ) : tasksOfSelectedDate.length === 0 ? (
                            <div>No jobs available.</div>
                        ) : (
                            <ul>
                                {tasksOfSelectedDate.map((task) => (
                                    <li key={task.id}>
                                        <b>{task.title}</b>
                                        {task.description && (
                                            <div className="calendar-task-desc">
                                                {task.description}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Calendar;
