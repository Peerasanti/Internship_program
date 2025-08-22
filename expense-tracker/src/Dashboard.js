import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const mockExpenses = [
  { id: 1, category: "Food", amount: 120, date: "2025-08-01", description: "Lunch" },
  { id: 2, category: "Transport", amount: 50, date: "2025-08-02", description: "Bus ticket" },
  { id: 3, category: "Shopping", amount: 500, date: "2025-08-10", description: "Clothes" },
  { id: 4, category: "Food", amount: 200, date: "2025-07-25", description: "Dinner" },
];

export default function Dashboard() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState(mockExpenses);

  useEffect(() => {
    if (!filterStart && !filterEnd) {
      setFilteredExpenses(expenses);
      return;
    }

    const start = filterStart ? new Date(filterStart) : new Date("2000-01-01");
    const end = filterEnd ? new Date(filterEnd) : new Date();

    const result = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= start && expDate <= end;
    });
    setFilteredExpenses(result);
  }, [filterStart, filterEnd, expenses]);

  // summary by category
  const categorySummary = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <h1>Expense Dashboard</h1>

      <div className="filter-container">
        <label>
          Start Date:{" "}
          <input
            type="date"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
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
      </div>

      <div className="summary-container">
        <h2>Summary by Category</h2>
        <ul>
          {Object.keys(categorySummary).map((cat) => (
            <li key={cat}>
              {cat}: {categorySummary[cat]} ฿
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
            {filteredExpenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.date}</td>
                <td>{exp.category}</td>
                <td>{exp.description}</td>
                <td>{exp.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
