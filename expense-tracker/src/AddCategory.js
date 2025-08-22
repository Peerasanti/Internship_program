import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./AddCategory.css";

export default function AddCategory() {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/categories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName }),
            });
            if (response.ok) {
                setCategoryName('');
                fetchCategories(); 
            } else {
                console.error('Error adding category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCategories(); 
            } else {
                console.error('Error deleting category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="add-category-container">
            <Navbar />
            <h1>Add Category</h1>
            <form onSubmit={handleSubmit} className="category-form">
                <label>
                    Category Name:
                    <input
                        type="text"
                        name="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Add Category</button>
            </form>

            ---

            <h2>Category List</h2>
            <table className="category-table">
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>
                                <button onClick={() => handleDelete(category._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}