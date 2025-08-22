import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="navbar">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/add-expense" className="nav-link">Add Expense</Link>
            <Link to="/add-category" className="nav-link">Add Category</Link>
        </div>
    );
}