import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserProfilePage.css";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [editedName, setEditedName] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://localhost:7083/api/Category");
      setCategories(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת קטגוריות", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את הקטגוריה?")) return;
    await axios.delete(`https://localhost:7083/api/Category/${id}`);
    fetchCategories();
  };

  const startEdit = (cat: any) => {
    setEditedName(cat.name);
    setEditId(cat.categoryId);
  };

  const handleSave = async () => {
    if (editId === null) return;
    const form = new FormData();
    form.append("CategoryId", editId.toString());
    form.append("Name", editedName);
    await axios.put(`https://localhost:7083/api/Category/${editId}`, form);
    setEditId(null);
    setEditedName("");
    fetchCategories();
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const form = new FormData();
    form.append("CategoryId", "0");
    form.append("Name", newCategoryName);
    await axios.post("https://localhost:7083/api/Category", form);
    setNewCategoryName("");
    fetchCategories();
  };

  return (
    <div className="wallet-style">
      <h2 className="admin-title">🗂 ניהול קטגוריות</h2>

      <div className="user-actions">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="שם קטגוריה חדשה"
        />
        <button onClick={handleAddCategory}>➕ הוסף</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>מס'</th>
            <th>שם קטגוריה</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr key={cat.categoryId}>
              <td>{index + 1}</td>
              <td>
                {editId === cat.categoryId ? (
                  <input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td>
                {editId === cat.categoryId ? (
                  <>
                    <button onClick={handleSave}>שמור</button>
                    <button onClick={() => setEditId(null)}>ביטול</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(cat)}>ערוך</button>
                    <button onClick={() => handleDelete(cat.categoryId)}>מחק</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategoriesPage;
