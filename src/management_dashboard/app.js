'use strict';

const e = React.createElement;

// --- Header Component ---
function Header() {
    return e(
        'header',
        { className: 'header' },
        e('h1', null, 'Management Wellness Dashboard')
    );
}

// --- KPI Component ---
function KPI({ title, value }) {
    return e(
        'div',
        { className: 'kpi' },
        e('h3', null, value),
        e('p', null, title)
    );
}

// --- KPI Card Component ---
function KPICard({ data }) {
    return e(
        'div',
        { className: 'card full-width' },
        e('h2', null, 'Organization-Wide Snapshot'),
        e(
            'div',
            { className: 'kpi-container' },
            e(KPI, { title: 'Overall Wellness Score', value: data.overallScore }),
            e(KPI, { title: 'Departments at Risk', value: data.departmentsAtRisk }),
            e(KPI, { title: 'Positive Trend', value: data.positiveTrend })
        )
    );
}

// --- Heatmap Card Component ---
function HeatmapCard() {
    return e(
        'div',
        { className: 'card half-width' },
        e('h2', null, 'Department Wellness Heatmap'),
        e('div', { className: 'heatmap-placeholder' }, 'Heatmap visualization will be here.')
    );
}

// --- Trends Card Component ---
function TrendsCard() {
    return e(
        'div',
        { className: 'card half-width' },
        e('h2', null, 'Wellness Trends'),
        e('div', { className: 'trends-placeholder' }, 'Organizational trends chart will be here.')
    );
}

// --- Department List Component ---
function DepartmentList({ departments }) {
    return e(
        'div',
        { className: 'card full-width department-list' },
        e('h2', null, 'Wellness by Department'),
        e(
            'ul',
            null,
            departments.map(dept => e(
                'li',
                { key: dept.name },
                e('span', { className: 'name' }, dept.name),
                e('span', { className: 'score' }, dept.score)
            ))
        )
    );
}


// --- Main App Component ---
function App() {
    // Placeholder data, to be replaced by API calls
    const kpiData = {
        overallScore: 82,
        departmentsAtRisk: 2,
        positiveTrend: '+3%'
    };

    const departmentData = [
        { name: 'Engineering', score: 88 },
        { name: 'Sales', score: 75 },
        { name: 'Marketing', score: 81 },
        { name: 'Human Resources', score: 92 },
        { name: 'Product', score: 79 }
    ];

    return e(
        'div',
        null,
        e(Header),
        e(
            'div',
            { className: 'dashboard-container' },
            e(KPICard, { data: kpiData }),
            e(HeatmapCard),
            e(TrendsCard),
            e(DepartmentList, { departments: departmentData })
        )
    );
}

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(App));