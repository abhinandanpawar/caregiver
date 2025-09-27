import React from 'react';
import KPI from './KPI.jsx';

function KPICard({ data }) {
    return (
        <div className="card full-width">
            <h2>Organization-Wide Snapshot</h2>
            <div className="kpi-container">
                <KPI title="Overall Wellness Score" value={data.overallScore} />
                <KPI title="Departments at Risk" value={data.departmentsAtRisk} />
                <KPI title="Positive Trend" value={data.positiveTrend} />
            </div>
        </div>
    );
}

export default KPICard;