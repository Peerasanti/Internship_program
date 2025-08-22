import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import "./AddCategory.css";

const EditModal = ({ category, onSave, onClose }) => {
    const [newName, setNewName] = useState(category.name);

    const handleSave = () => {
        onSave(category._id, newName);
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>แก้ไขหมวดหมู่</h3>
                <label>
                    หมวดหมู่ใหม่:
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </label>
                <div className="modal-actions">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default function AddCategory() {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null); 

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/categories`, {
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

    const handleDelete = useCallback(async (categoryId) => {
        try {
            const response = await fetch(`${apiUrl}/categories/${categoryId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCategories();
            } else {
                const errorData = await response.json();
                console.error('Error updating category:', errorData.error);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }, [apiUrl, fetchCategories]);

    const handleEditClick = (category) => {
        setEditingCategory(category);
    };

    const handleSaveEdit = useCallback(async (categoryId, newName) => {
        try {
            const response = await fetch(`${apiUrl}/categories/${categoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });
            if (response.ok) {
                fetchCategories();
                setEditingCategory(null); 
            } else {
                console.error('Error updating category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    }, [apiUrl, fetchCategories]);

    return (
        <>
            <Navbar/>
            <div className="add-category-container">
                
                <h1>เพิ่มหมวดหมู่</h1>
                <form onSubmit={handleSubmit} className="category-form">
                    <label>
                        ชื่อหมวดหมู่:
                        <input
                            type="text"
                            name="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">เพิ่ม</button>
                </form>

                <h2>รายการหมวดหมู่ทั้งหมด</h2>
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>ชื่อหมวดหมู่</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>
                                    <button onClick={() => handleEditClick(category)}>Edit</button>
                                    <button onClick={() => handleDelete(category._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {editingCategory && (
                    <EditModal
                        category={editingCategory}
                        onSave={handleSaveEdit}
                        onClose={() => setEditingCategory(null)}
                    />
                )}
            </div>
        </>
    );
}