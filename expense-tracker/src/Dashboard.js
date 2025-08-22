import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import {ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, } from "recharts";


export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [error, setError] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [sortDateOrder, setSortDateOrder] = useState("desc");

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTotalExpenses = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/expenses/all");
      const data = await response.json();
      const total = data.reduce((acc, exp) => acc + exp.amount, 0);
      setTotalExpenses(total);
    } catch (error) {
      console.error("Error fetching total expenses:", error);
    }
  };

  const fetchExpenses = async (startDate = "", endDate = "", categoryId = "", minAmount = "", maxAmount = "") => {
    try {
      if (minAmount && maxAmount && Number(maxAmount) < Number(minAmount)) {
        setError("รายจ่ายสูงสุดจะต้องมีค่ามากกว่าหรือเท่ากับรายจ่ายต่ําสุด");
        return; 
      }
      
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        setError("วันที่สิ้นสุดจะต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น");
        return; 
      }


      let url = "http://localhost:3001/api/expenses";
      const params = new URLSearchParams();
      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
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
      setError("");
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
    fetchTotalExpenses();
  }, []);

  const categorySummary = expenses.reduce((acc, exp) => {
    const categoryName = exp.categoryId?.name || "ไม่มีหมวดหมู่";
    acc[categoryName] = (acc[categoryName] || 0) + exp.amount;
    return acc;
  }, {});

  const dateSummary = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + exp.amount;
    return acc;
  }, {});

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360; 
    return `hsl(${hue}, 70%, 50%)`;   
  }

  const chartData = Object.values(
    expenses.reduce((acc, exp) => {
      const date = new Date(exp.date).toLocaleDateString(); 
      if (!acc[date]) {
        acc[date] = { date, totalAmount: 0 };
      }
      acc[date].totalAmount += exp.amount;
      return acc;
    }, {})
  );

  const calculateSumFromStart = (expensesArray, startDate) => {
    return expensesArray
      .filter(exp => new Date(exp.date) >= startDate)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const todayStart = new Date(filterStart || new Date());
  todayStart.setHours(0,0,0,0);

  const sevenDaysAgoStart = new Date();
  sevenDaysAgoStart.setDate(todayStart.getDate() - 6);
  sevenDaysAgoStart.setHours(0,0,0,0);

  const oneMonthAgoStart = new Date();
  oneMonthAgoStart.setMonth(todayStart.getMonth() - 1);
  oneMonthAgoStart.setHours(0,0,0,0);

  const totalToday = calculateSumFromStart(expenses, todayStart);
  const total7Days = calculateSumFromStart(expenses, sevenDaysAgoStart);
  const total1Month = calculateSumFromStart(expenses, oneMonthAgoStart);

  const sortByDate = () => {
    const newOrder = sortDateOrder === "desc" ? "asc" : "desc";
    setSortDateOrder(newOrder);

    const sortedExpenses = [...expenses].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return newOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setExpenses(sortedExpenses);
  };

  return (
    <>
      <Navbar/>
      <div className="dashboard-container">
        
        <h1>แดชบอร์ดแสดงรายจ่าย</h1>
        <div className="filter-container">
          <h4>เรียง / กรอง:</h4>
          <label>
            วันที่เริ่มต้น:{" "}
            <input
              type="date"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
            />
          </label>
          <label>
            วันที่สิ้นสุด:{" "}
            <input
              type="date"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
            />
          </label>
          <label>
            หมวดหมู่:
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
            รายจ่ายต่ำสุด:
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              min="0"
            />
          </label>
          <label>
            รายจ่ายสูงสุด:
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              min="0"
            />
          </label>
          <label>
            <button onClick={() => fetchExpenses(filterStart, filterEnd, filterCategory, minAmount, maxAmount)}>
              กรอง
            </button>
          </label>
        </div>

        <div classNmae="error-container">
          {error && <p className="error">{error}</p>}
        </div>

        <div className="card-container">
        <div className="card">
          <h3>วันนี้</h3>
          <p>{totalToday.toFixed(2)} ฿</p>
        </div>
        <div className="card">
          <h3>1 สัปดาห์ย้อนหลัง</h3>
          <p>{total7Days.toFixed(2)} ฿</p>
        </div>
        <div className="card">
          <h3>1 เดือนย้อนหลัง</h3>
          <p>{total1Month.toFixed(2)} ฿</p>
        </div>
      </div>


        <div className="dashboard-main">
          <div className="summary-container">
            <h1>รวมรายจ่ายทั้งหมด: {totalExpenses.toFixed(2)} ฿</h1>
            <h2>รวมจากหมวดหมู่</h2>
            <ul>
              {Object.keys(categorySummary).map((cat) => (
                <li key={cat}>
                  {cat}:   {categorySummary[cat].toFixed(2)} ฿
                </li>
              ))}
            </ul>
            <h2>รวมจากวันที่</h2>
            <ul>
              {Object.keys(dateSummary).map((cat) => (
                <li key={cat}>
                  วันที่ {cat}:   {dateSummary[cat].toFixed(2)} ฿
                </li>
              ))}
            </ul>
          </div>

          <div className="chart-container">
            <h2>กราฟตามหมวดหมู่</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(categorySummary).map(([name, value]) => ({
                    name,
                    value,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {Object.keys(categorySummary).map(([name], index) => (
                    <Cell key={`cell-${index}`} fill={stringToColor(name)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="linechart-container">
            <h2>รายจ่ายตามเวลา</h2>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalAmount" name="รายจ่ายรวม (฿)" fill="#111" />
                <Line type="monotone" dataKey="totalAmount" name="แนวโน้ม" stroke="#E63946" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>


        <div className="table-container">
          <h2>รายการค่าใช้จ่ายทั้งหมด</h2>
          <table>
            <thead>
              <tr>
                <th ClassName="th-date">วันที่
                   <button 
                      onClick={sortByDate} 
                      className="sort-button"
                    >
                      {sortDateOrder === "desc" ? "↓ มากไปน้อย" : "↑ น้อยไปมาก"}
                    </button>
                </th>
                <th>หมวดหมู่</th>
                <th>โน๊ตความจำ</th>
                <th>รายจ่าย (฿)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{new Date(exp.date).toLocaleString()}</td>
                  <td>{exp.categoryId?.name || "ไม่มีหมวดหมู่"}</td>
                  <td>{exp.description}</td>
                  <td>{exp.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}