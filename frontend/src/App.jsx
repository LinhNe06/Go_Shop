import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const emptyForm = { name: '', price: '', description: '' }

export default function App() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  async function fetchProducts() {
    try {
      const response = await axios.get('/api/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Could not load products', error)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function resetForm() {
    setForm(emptyForm)
    setImageFile(null)
    setEditingId(null)
    const input = document.getElementById('imageInput')
    if (input) input.value = ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', form.name)
      data.append('price', form.price)
      data.append('description', form.description)
      if (imageFile) data.append('image', imageFile)
      if (editingId) await axios.put(`/api/products/${editingId}`, data)
      else await axios.post('/api/products', data)
      resetForm()
      await fetchProducts()
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm({ name: product.name, price: product.price, description: product.description })
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    if (!window.confirm('Xoá sản phẩm này?')) return
    await axios.delete(`/api/products/${id}`)
    await fetchProducts()
  }

  return <main className="container">
    <h1>🛒 Go Shop — Quản lý sản phẩm</h1>
    <form className="card" onSubmit={handleSubmit}>
      <h2>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
      <input name="name" placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} required />
      <input name="price" type="number" min="0" placeholder="Giá (VND)" value={form.price} onChange={handleChange} required />
      <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />
      <input id="imageInput" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} />
      <div className="actions">
        <button type="submit" disabled={loading}>{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
        {editingId && <button type="button" onClick={resetForm}>Huỷ</button>}
      </div>
    </form>
    <section className="grid">
      {products.map((product) => <article className="card product" key={product.id}>
        {product.image ? <img src={product.image} alt={product.name} /> : <div className="no-image">Chưa có ảnh</div>}
        <h3>{product.name}</h3>
        <p className="price">{Number(product.price).toLocaleString('vi-VN')} ₫</p>
        <p>{product.description}</p>
        <div className="actions"><button onClick={() => startEdit(product)}>Sửa</button><button className="danger" onClick={() => handleDelete(product.id)}>Xoá</button></div>
      </article>)}
      {products.length === 0 && <p>Chưa có sản phẩm nào — thêm sản phẩm đầu tiên ở form trên 👆</p>}
    </section>
  </main>
}
