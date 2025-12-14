import React, { useState, useEffect } from 'react'
import { useNavigate } from '../hooks/useNavigate'
import { sweetsApi, inventoryApi } from '../lib/api'
import { ChevronLeft, Plus, Edit2, Trash2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

interface Sweet {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  created_at: string
  updated_at: string
}

type ModalType = 'add' | 'edit' | 'restock' | null

export const Admin: React.FC = () => {
  const { setPage } = useNavigate()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [modalType, setModalType] = useState<ModalType>(null)
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: ''
  })

  useEffect(() => {
    loadSweets()
  }, [])

  const loadSweets = async () => {
    try {
      setLoading(true)
      const data = await sweetsApi.getAll()
      setSweets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sweets')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSweet = () => {
    setFormData({ name: '', category: '', price: '', quantity: '', description: '' })
    setEditingSweet(null)
    setModalType('add')
  }

  const handleEditSweet = (sweet: Sweet) => {
    setEditingSweet(sweet)
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      description: sweet.description || ''
    })
    setModalType('edit')
  }

  const handleRestockSweet = (sweet: Sweet) => {
    setEditingSweet(sweet)
    setFormData({ ...formData, quantity: '' })
    setModalType('restock')
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      if (modalType === 'add') {
        await sweetsApi.create({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity) || 0,
          description: formData.description
        })
        setMessage('Sweet added successfully!')
      } else if (modalType === 'edit' && editingSweet) {
        await sweetsApi.update(editingSweet.id, {
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity) || 0,
          description: formData.description
        })
        setMessage('Sweet updated successfully!')
      } else if (modalType === 'restock' && editingSweet) {
        const qty = parseInt(formData.quantity)
        if (isNaN(qty) || qty <= 0) throw new Error('Enter a valid quantity')
        await inventoryApi.restock(editingSweet.id, qty)
        setMessage(`Restocked ${editingSweet.name} with ${qty} units!`)
      }

      setModalType(null)
      await loadSweets()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed')
    }
  }

  const handleDeleteSweet = async (sweetId: string) => {
    if (confirm('Are you sure you want to delete this sweet?')) {
      try {
        setError('')
        await sweetsApi.delete(sweetId)
        setMessage('Sweet deleted successfully!')
        await loadSweets()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Deletion failed')
      }
    }
  }

  return (
    <div>
      <nav style={{
        background: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '16px 0',
        marginBottom: '40px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AIKata - Admin Panel
          </div>
          <button
            onClick={() => setPage('dashboard')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8B5CF6',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ChevronLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            gap: '8px'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div style={{
            background: '#DBEAFE',
            color: '#0369A1',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            gap: '8px'
          }}>
            <CheckCircle size={20} />
            <span>{message}</span>
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Manage Sweets</h1>
          <button
            onClick={handleAddSweet}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={20} />
            Add New Sweet
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.1rem', color: '#6B7280' }}>
            Loading sweets...
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  background: '#F3F4F6',
                  borderBottom: '2px solid #E5E7EB'
                }}>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '700',
                    color: '#374151'
                  }}>Name</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '700',
                    color: '#374151'
                  }}>Category</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '700',
                    color: '#374151'
                  }}>Price</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '700',
                    color: '#374151'
                  }}>Stock</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '700',
                    color: '#374151'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sweets.map((sweet, idx) => (
                  <tr key={sweet.id} style={{
                    borderBottom: idx < sweets.length - 1 ? '1px solid #E5E7EB' : 'none',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px', fontWeight: '600' }}>{sweet.name}</td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>{sweet.category}</td>
                    <td style={{ padding: '16px', fontWeight: '600' }}>${sweet.price.toFixed(2)}</td>
                    <td style={{
                      padding: '16px',
                      fontWeight: '600',
                      color: sweet.quantity === 0 ? '#EF4444' : (sweet.quantity < 5 ? '#F59E0B' : '#10B981')
                    }}>
                      {sweet.quantity}
                    </td>
                    <td style={{
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '12px'
                    }}>
                      <button
                        onClick={() => handleEditSweet(sweet)}
                        style={{
                          background: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.9rem'
                        }}
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleRestockSweet(sweet)}
                        style={{
                          background: '#10B981',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.9rem'
                        }}
                      >
                        <RefreshCw size={16} />
                        Restock
                      </button>
                      <button
                        onClick={() => handleDeleteSweet(sweet.id)}
                        style={{
                          background: '#EF4444',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.9rem'
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalType && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '24px'
            }}>
              {modalType === 'add' ? 'Add New Sweet' : modalType === 'edit' ? 'Edit Sweet' : 'Restock Sweet'}
            </h2>

            <form onSubmit={handleSubmitForm}>
              {modalType !== 'restock' && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Sweet Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Chocolate, Candy, Gummy"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Initial Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        minHeight: '100px'
                      }}
                    />
                  </div>
                </>
              )}

              {modalType === 'restock' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Quantity to Add
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#E5E7EB',
                    color: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#8B5CF6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {modalType === 'restock' ? 'Restock' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
