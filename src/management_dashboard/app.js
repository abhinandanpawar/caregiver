'use strict';

const e = React.createElement;
const API_BASE_URL = 'http://127.0.0.1:8001';

// --- Reusable Chart Components ---

function BubbleChart({ data, options }) {
    const canvasRef = React.useRef(null);
    const chartRef = React.useRef(null);

    React.useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        chartRef.current = new window.Chart(ctx, {
            type: 'bubble',
            data: data,
            options: options,
        });
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data, options]);

    return e('canvas', { ref: canvasRef });
}

function LineChart({ data, options }) {
    const canvasRef = React.useRef(null);
    const chartRef = React.useRef(null);

    React.useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        chartRef.current = new window.Chart(ctx, {
            type: 'line',
            data: data,
            options: options,
        });
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data, options]);

    return e('canvas', { ref: canvasRef });
}


// --- UI Components ---

function Header() {
    return e('header', { className: 'header' }, e('h1', null, 'Management Wellness Dashboard'));
}

function KPI({ title, value }) {
    return e('div', { className: 'kpi' }, e('h3', null, value), e('p', null, title));
}

function KPICard({ data }) {
    if (!data) return e('div', { className: 'card full-width' }, e('p', null, 'Loading KPIs...'));
    return e(
        'div',
        { className: 'card full-width' },
        e('h2', null, 'Organization-Wide Snapshot'),
        e(
            'div',
            { className: 'kpi-container' },
            e(KPI, { title: 'Overall Wellness Score', value: data.overall_score }),
            e(KPI, { title: 'Departments at Risk', value: data.departments_at_risk }),
            e(KPI, { title: 'Positive Trend', value: data.positive_trend })
        )
    );
}

function HeatmapCard() {
    const [chartData, setChartData] = React.useState(null);

    React.useEffect(() => {
        fetch(`${API_BASE_URL}/api/v1/dashboard/heatmap`)
            .then(response => response.json())
            .then(data => {
                const datasets = data.map((dept, index) => ({
                    label: dept.label,
                    data: [{ x: dept.x, y: dept.y, r: dept.r / 2 }],
                    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`,
                }));
                setChartData({ datasets });
            })
            .catch(err => console.error("Error fetching heatmap data:", err));
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
            x: { title: { display: true, text: 'Burnout Risk Score' }, min: 0, max: 100 },
            y: { title: { display: true, text: 'Focus Score' }, min: 40, max: 100 },
        },
    };

    return e(
        'div', { className: 'card half-width' },
        e('h2', null, 'Department Wellness Heatmap'),
        e('div', { className: 'chart-container' },
            chartData ? e(BubbleChart, { data: chartData, options: chartOptions }) : e('p', null, 'Loading chart...')
        )
    );
}

function TrendsCard() {
    const [chartData, setChartData] = React.useState(null);

    React.useEffect(() => {
        fetch(`${API_BASE_URL}/api/v1/dashboard/trends`)
            .then(response => response.json())
            .then(data => {
                const labels = data.map(d => new Date(d.date).toLocaleDateString());
                const scores = data.map(d => d.score);
                setChartData({
                    labels,
                    datasets: [{
                        label: 'Overall Wellness Score',
                        data: scores,
                        fill: true,
                        backgroundColor: 'rgba(74, 144, 164, 0.2)',
                        borderColor: 'rgb(74, 144, 164)',
                        tension: 0.4
                    }]
                });
            })
            .catch(err => console.error("Error fetching trends data:", err));
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: false, min: 60, max: 100, title: { display: true, text: 'Wellness Score' } },
            x: { title: { display: true, text: 'Date' } },
        },
    };

    return e(
        'div', { className: 'card half-width' },
        e('h2', null, 'Wellness Trends (30 Days)'),
        e('div', { className: 'chart-container' },
            chartData ? e(LineChart, { data: chartData, options: chartOptions }) : e('p', null, 'Loading chart...')
        )
    );
}


function DepartmentList({ departments }) {
    if (departments.length === 0) return e('div', { className: 'card full-width' }, e('p', null, 'Loading departments...'));
    return e(
        'div',
        { className: 'card full-width department-list' },
        e('h2', null, 'Wellness by Department'),
        e('ul', null,
            departments.map(dept =>
                e('li', { key: dept.name },
                    e('span', { className: 'name' }, dept.name),
                    e('span', { className: 'score' }, dept.score)
                )
            )
        )
    );
}


// --- Main App Component ---
function App() {
    const [kpiData, setKpiData] = React.useState(null);
    const [departmentData, setDepartmentData] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        fetch(`${API_BASE_URL}/api/v1/dashboard/kpis`)
            .then(res => res.json())
            .then(data => setKpiData(data))
            .catch(err => setError('Could not load KPI data.'));

        fetch(`${API_BASE_URL}/api/v1/dashboard/departments`)
            .then(res => res.json())
            .then(data => setDepartmentData(data))
            .catch(err => setError('Could not load department data.'));
    }, []);

    if (error) {
        return e('div', { className: 'container' }, e('h1', null, 'Error'), e('p', null, error));
    }

    return e(
        'div',
        null,
        e(Header),
        e(
            'div',
            { className: 'dashboard-container' },
            e(KPICard, { data: kpiData }),
            e(HeatmapCard, null),
            e(TrendsCard, null),
            e(DepartmentList, { departments: departmentData })
        )
    );
}

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(App));