import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchExpenses = async (startDate = "", endDate = "", categoryId = "", minAmount = "", maxAmount = "") => {
    try {
      let url = "http://localhost:3001/api/expenses";
      const params = new URLSearchParams();
      if (startDate && endDate) {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }
      if (categoryId) {
        params.append("categoryId", categoryId);
      }
      if (minAmount) {
        params.append("minAmount", minAmount);
      }
      if (maxAmount) {
        params.append("maxAmount", maxAmount);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  const categorySummary = expenses.reduce((acc, exp) => {
    const categoryName = exp.categoryId?.name || "ไม่มีหมวดหมู่";
    acc[categoryName] = (acc[categoryName] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/add-expense" className="nav-link">Add Expense</Link>
      </nav>

      <h1>Expense Dashboard</h1>

      <div className="filter-container">
        <label>Sort / Filter:</label>
        <label>
          Start Date:{" "}
          <input
            type="date"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
          />
        </label>
        <label>
          Category:
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Minimum Amount:
          <input
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            min="0"
          />
        </label>
        <label>
          Maximum Amount:
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            min="0"
          />
        </label>
        <label>
          End Date:{" "}
          <input
            type="date"
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
          />
        </label>
        <label>
          <button onClick={() => fetchExpenses(filterStart, filterEnd, filterCategory, minAmount, maxAmount)}>
            Filter
          </button>
        </label>
      </div>

      <div className="summary-container">
        <h2>Summary by Category</h2>
        <ul>
          {Object.keys(categorySummary).map((cat) => (
            <li key={cat}>
              {cat}: {categorySummary[cat].toFixed(2)} ฿
            </li>
          ))}
        </ul>
      </div>

      <div className="table-container">
        <h2>Expense Records</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount (฿)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.date}</td>
                <td>{exp.categoryId?.name || "ไม่มีหมวดหมู่"}</td>
                <td>{exp.description}</td>
                <td>{exp.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}