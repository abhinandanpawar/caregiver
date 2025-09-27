import React from 'react';

function DepartmentList({ departments }) {
    return (
        <div className="card full-width department-list">
            <h2>Wellness by Department</h2>
            <ul>
                {departments.map(dept => (
                    <li key={dept.name}>
                        <span className="name">{dept.name}</span>
                        <span className="score">{dept.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DepartmentList;