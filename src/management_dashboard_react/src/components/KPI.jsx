import React from 'react';

function KPI({ title, value }) {
    return (
        <div className="kpi">
            <h3>{value}</h3>
            <p>{title}</p>
        </div>
    );
}

export default KPI;