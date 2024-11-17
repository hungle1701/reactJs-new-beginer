import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const url = 'http://localhost:3000/news'; // URL của JSON Server
  const [news, setNews] = useState([]);
  
  const [editingId, setEditingId] = useState(null); // ID của bài viết đang chỉnh sửa
  const [editData, setEditData] = useState({ title: '', description: '', image: '' }); // Dữ liệu láy để chỉnh sửa

  // Lấy dữ liệu từ server
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setNews(data));
  }, []);

  // Hàm xóa bài viết
  const removeProduct = (id) => {
    fetch(`http://localhost:3000/news/${id}`, {
      method: "DELETE",
    }).then(() => setNews(news.filter((item) => item.id !== id)));
  };

  // Hàm kích hoạt update
  const startEditing = (item) => {
    setEditingId(item.id); // Gán ID bài viết đang chỉnh sửa
    setEditData({ title: item.title, description: item.description, image: item.image }); // Gán dữ liệu vào form
  };

  // Hàm xử lý cập nhật bài viết
  const updateProduct = (id) => {
    fetch(`http://localhost:3000/news/${id}`, {
      method: "PATCH", // chỗ này dùng "PUT" cũng được
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    }).then(() => {
      // Cập nhật danh sách bài viết sau khi chỉnh sửa
      setNews(news.map((item) => (item.id === id ? { ...item, ...editData } : item)));
      setEditingId(null); // Thoát chế độ chỉnh sửa
      setEditData({ title: '', description: '', image: '' }); // Reset form
    });
  };

  return (
    <>
      <h1>News</h1>
      {news.map((item) => (
        <div key={item.id} className='box-news'>
          <div className='box-news-item1'>
            <h6>{item.id}</h6>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
          </div>
          <div className='box-news-item2'>
            <img src={item.image} alt={item.title} />
          </div>
          <button onClick={() => removeProduct(item.id)}>Delete</button>
          <button onClick={() => startEditing(item)}>Edit</button>
        </div>
      ))}
       {/* nếu bấm vào edit thì sẽ hiện thị lên form */}
      {editingId && (
        <div className='edit-form'>
          <h2>Edit News</h2>
          <label>
            Title:
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              value={editData.image}
              onChange={(e) => setEditData({ ...editData, image: e.target.value })}
            />
          </label>
          <button onClick={() => updateProduct(editingId)}>Save</button>
          <button onClick={() => setEditingId(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default App;