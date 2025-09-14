import { useEffect, useState } from "react";
import "./Analytics.css";
import type { Task } from "../../types/task";
import { Pie, Bar } from "react-chartjs-2";
import FilterTasks from "../../components/FilterTasks";
import Header from "../../layout/Header";
import {
    Chart,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
Chart.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Analytics = () => {
    const [tasksCompletedOnMonth, setTasksCompletedOnMonth] = useState<Task[]>(
        []
    );
    const [tasksIsCompletingOnMonth, setTasksIsCompletingOnMonth] = useState<
        Task[]
    >([]);
    const [tasksOverDueOnMonth, setTasksOverDueOnMonth] = useState<Task[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("completed");
    const [loading, setLoading] = useState(true);
    async function fetchAnalytics() {
        try {
            // Lấy tháng và năm hiện tại
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            // Gọi API cho từng trạng thái
            const [completedRes, inProgressRes, overdueRes] = await Promise.all(
                [
                    fetch(`${backendUrl}/api/tasks/completed-by-month?year=${year}&month=${month}`),
                    fetch(`${backendUrl}/api/tasks/uncompleted-in-time-by-month?year=${year}&month=${month}`),
                    fetch(`${backendUrl}/api/tasks/overdue-this-month`),
                ]
            );
            const completed = completedRes.ok ? await completedRes.json() : [];
            const inProgress = inProgressRes.ok? await inProgressRes.json(): [];
            const overdue = overdueRes.ok ? await overdueRes.json() : [];
            setTasksCompletedOnMonth(completed);
            setTasksIsCompletingOnMonth(inProgress);
            setTasksOverDueOnMonth(overdue);
        } catch {
            setTasksCompletedOnMonth([]);
            setTasksIsCompletingOnMonth([]);
            setTasksOverDueOnMonth([]);
        } finally {
            setLoading(false); // <-- thêm dòng này
        }
    }
    useEffect(() => {
        fetchAnalytics();
    }, []);

    const completed = tasksCompletedOnMonth.length;
    const inProgress = tasksIsCompletingOnMonth.length;
    const overdue = tasksOverDueOnMonth.length;
    const total = completed + inProgress + overdue;

    // Dữ liệu cho Pie chart
    const pieData = {
        labels: ["Completed", "In progress", "Overdue"],
        datasets: [
            {
                data: [completed, inProgress, overdue],
                backgroundColor: ["#5ff281", "#38bdf8", "#ffb300"],
                borderWidth: 2,
                borderColor: "#23244a",
            },
        ],
    };

    // Dữ liệu cho Bar chart (có thể mở rộng theo ngày/tháng)
    const barData = {
        labels: ["Completed", "In progress", "Overdue"],
        datasets: [
            {
                label: "Number of jobs",
                data: [completed, inProgress, overdue],
                backgroundColor: ["#5ff281", "#38bdf8", "#ffb300"],
                borderRadius: 8,
            },
        ],
    };
    // Chọn danh sách task theo lựa chọn
    let filteredTasks: Task[] = [];
    if (selectedStatus === "completed") filteredTasks = tasksCompletedOnMonth;
    else if (selectedStatus === "inprogress")
        filteredTasks = tasksIsCompletingOnMonth;
    else if (selectedStatus === "overdue") filteredTasks = tasksOverDueOnMonth;
    return (
        <>
            <Header/>
            <div className="analytics-wrapper">
                <div className="analytics-container">
                    <h2 className="analytics-title">
                        📊 Job performance analysis
                    </h2>

                    {loading ? (
                        <div className="analytics-loading">
                            Loading data...
                        </div>
                    ) : total === 0 ? (
                        <div className="analytics-empty">
                            No job data available for analysis.
                        </div>
                    ) : (
                        <>
                            <div className="analytics-charts-row">
                                <div className="analytics-chart analytics-bar">
                                    <Bar
                                        data={barData}
                                        options={{
                                            plugins: {
                                                legend: { display: false },
                                            },
                                            responsive: true,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: { stepSize: 1 },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                                <div className="analytics-chart analytics-pie">
                                    <Pie data={pieData} />
                                </div>
                            </div>
                            <div className="analytics-summary-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Number</th>
                                            <th>Proportion (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ color: "#5ff281" }}>
                                                Completed
                                            </td>
                                            <td>{completed}</td>
                                            <td>
                                                {total > 0
                                                    ? Math.round(
                                                          (completed / total) *
                                                              100
                                                      )
                                                    : 0}
                                                %
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ color: "#38bdf8" }}>
                                                In progress
                                            </td>
                                            <td>{inProgress}</td>
                                            <td>
                                                {total > 0
                                                    ? Math.round(
                                                          (inProgress / total) *
                                                              100
                                                      )
                                                    : 0}
                                                %
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ color: "#ffb300" }}>
                                                Overdue
                                            </td>
                                            <td>{overdue}</td>
                                            <td>
                                                {total > 0
                                                    ? Math.round(
                                                          (overdue / total) *
                                                              100
                                                      )
                                                    : 0}
                                                %
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="analytics-rate">
                                Completed performance:{" "}
                                <b>
                                    {total > 0
                                        ? Math.round((completed / total) * 100)
                                        : 0}
                                    %
                                </b>
                            </div>
                        </>
                    )}

                    {/* Thanh tìm kiếm */}
                    <div className="analytics-filter-select">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value="completed">Completed</option>
                            <option value="inprogress">In progress</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>
                <FilterTasks tasks={filteredTasks} status={selectedStatus} />
            </div>
        </>
    );
};

export default Analytics;
