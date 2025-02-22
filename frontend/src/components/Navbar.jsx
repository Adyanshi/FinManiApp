import { Link } from "react-router-dom";

export default function Navbar({ isAuthenticated, onLogout }) {
    return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
            <Link className="navbar-brand" to="/">
            💰 Expense Tracker
            </Link>
            <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">
                        Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/add-expense">
                        Add Expense
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/reports">
                        Reports
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
            <>
                <li className="nav-item">
                <Link className="nav-link" to="/">Dashboard</Link>
                </li>
                <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={onLogout}>Logout</button>
                </li>
            </>
            ) : (
            <>
                <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
                </li>
            </>
            )}
        </ul>
        </div>
        </div>
    </nav>
    );
}
