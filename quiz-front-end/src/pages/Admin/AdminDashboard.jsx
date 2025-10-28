import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/admin/create-quiz">Create Quiz</Link>
                    </li>
                    <li>
                        <Link to="/admin/manage-quizzes">Manage Quizzes</Link>
                    </li>
                    <li>
                        <Link to="/admin/view-results">View Results</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminDashboard;