import React, { useState, useEffect } from "react";
import "./AddExpense.css";
import Navbar from "./components/Navbar";

export default function AddExpense() {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); 

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = date || new Date().toISOString();
      const response = await fetch(`${apiUrl}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          amount: parseFloat(amount),
          date: currentDate,
          description,
        }),
      });
      if (response.ok) {
        setCategoryId("");
        setAmount("");
        setDescription("");
        setDate(new Date().toISOString().slice(0, 10));
      } else {
        console.error("Error adding expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-expense-container">
        

        <h1>บันทึกรายจ่าย</h1>
        <form onSubmit={handleSubmit} className="expense-form">
          <label>
            รายจ่าย:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              required
            />
          </label>
          <label>
            โน๊ตความจำ:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            วันที่:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            หมวดหมู่:
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">บันทึก</button>
        </form>
      </div>
    </>
  );
}