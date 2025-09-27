import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import KPICard from './components/KPICard.jsx';
import HeatmapCard from './components/HeatmapCard.jsx';
import TrendsCard from './components/TrendsCard.jsx';
import DepartmentList from './components/DepartmentList.jsx';

const API_BASE_URL = 'http://localhost:8001';

function App() {
    const [kpiData, setKpiData] = useState(null);
    const [departmentData, setDepartmentData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch KPI data
        fetch(`${API_BASE_URL}/api/v1/dashboard/kpis`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok for KPIs');
                }
                return response.json();
            })
            .then(data => {
                // The API returns overall_score, departments_at_risk, positive_trend
                // The component expects overallScore, departmentsAtRisk, positiveTrend
                setKpiData({
                    overallScore: data.overall_score,
                    departmentsAtRisk: data.departments_at_risk,
                    positiveTrend: data.positive_trend
                });
            })
            .catch(error => {
                console.error('Error fetching KPI data:', error);
                setError('Could not load KPI data.');
            });

        // Fetch Department data
        fetch(`${API_BASE_URL}/api/v1/dashboard/departments`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok for Departments');
                }
                return response.json();
            })
            .then(data => setDepartmentData(data))
            .catch(error => {
                console.error('Error fetching department data:', error);
                setError('Could not load department data.');
            });
    }, []); // Empty dependency array means this effect runs once on mount

    if (error) {
        return <div className="container"><h1>Error</h1><p>{error}</p></div>;
    }

    return (
        <div>
            <Header />
            <div className="dashboard-container">
                {kpiData ? <KPICard data={kpiData} /> : <div className="card full-width"><p>Loading KPIs...</p></div>}
                <HeatmapCard />
                <TrendsCard />
                {departmentData.length > 0 ? <DepartmentList departments={departmentData} /> : <div className="card full-width"><p>Loading Departments...</p></div>}
            </div>
        </div>
    );
}

export default App;