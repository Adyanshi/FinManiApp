import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListGroup, Button } from 'react-bootstrap';
import { Layout as LayoutIcon, LogOut, PieChart, List, TrendingUp, TrendingDown } from 'react-feather';

export default function Layout({ children, user, onLogout }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const menuItems = [
    { path: '/', icon: <PieChart size={20} />, label: 'Dashboard' },
    { path: '/transactions', icon: <List size={20} />, label: 'Transactions' },
    { path: '/income', icon: <TrendingUp size={20} />, label: 'Income' },
    { path: '/expenses', icon: <TrendingDown size={20} />, label: 'Expenses' },
];

return (
    <div className="layout-wrapper">
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
            <Button
            variant="link"
            className="toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            >
            <LayoutIcon size={20} />
            </Button>
            {!isCollapsed && (
            <h4 className="mb-0">💰FinMani </h4>
        )}
        </div>
        <ListGroup variant="flush">
            {menuItems.map(item => (
            <ListGroup.Item
                key={item.path}
                as={Link}
                to={item.path}
                active={location.pathname === item.path}
            >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
            </ListGroup.Item>
        ))}
        </ListGroup>
        <div className="sidebar-footer">
            <Button
            variant="link"
            className="logout-btn"
            onClick={onLogout}
            >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
            </Button>
        </div>
        </div>
    <div className="main-content">
        <div className="content-header">
            <h3>Welcome back, {user?.name}</h3>
        </div>
        <div className="content-body">
            {children}
        </div>
        </div>
    </div>
    );
}