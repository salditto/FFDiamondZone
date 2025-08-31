// pages/AdminPanel.jsx
import { useEffect, useState } from 'react'
import { useSnackbar } from '../context/SnackBarContext'
import {
  getAllReceipts,
  updateReceiptStatus
} from '../services/AdminPanelService'
import { getPdfFile } from '../services/BankTransfer.service'
import { isAdmin } from '../services/AuthService'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel () {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(null)
  const [filter, setFilter] = useState('all')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()

  // Estados posibles para los comprobantes
  const statusOptions = {
    1: { label: 'Pendiente', color: '#ff9500', bgColor: '#ff950020' },
    2: { label: 'Procesando', color: '#00aaff', bgColor: '#00aaff20' },
    3: { label: 'Aprobado', color: '#00ff88', bgColor: '#00ff8820' },
    4: { label: 'Diamantes Cargados', color: '#b86bff', bgColor: '#b86bff20' },
    5: { label: 'Fallido', color: '#ff4757', bgColor: '#ff475720' },
    6: { label: 'Cancelado', color: '#999', bgColor: '#99999920' }
  }

  // Payment method types
  const paymentMethods = {
    1: { label: 'Stripe', color: '#635bff', icon: '💳' },
    2: { label: 'MercadoPago', color: '#00b1ea', icon: '💰' },
    3: { label: 'Crypto', color: '#f7931a', icon: '₿' },
    4: { label: 'Transferencia Bancaria', color: '#28a745', icon: '🏦' }
  }

  useEffect(() => {
    const checkAccess = async () => {
      const allowed = await isAdmin()
      console.log(allowed)
      setAuthorized(allowed)
      if (!allowed) {
        console.log('Access denied')
        showSnackbar('No tenés acceso al panel', 'error')
        navigate('/')
      }
    }
    checkAccess()
  }, [])

  // Cargar datos desde la API
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true)
        const response = await getAllReceipts()
        setReceipts(response)
      } catch (error) {
        showSnackbar('Error al cargar los pagos', 'error')
        console.error('Error fetching receipts:', error)
      } finally {
        setLoading(false)
      }
    }

    if (authorized) {
      fetchReceipts()
    }
  }, [authorized])

  const filteredReceipts = receipts
    .filter(receipt => {
      if (filter === 'all') return true
      if (filter === 'pending_bank') {
        return receipt.method === 4 && receipt.status === 1
      }
      if (filter.startsWith('method_')) {
        const methodId = Number.parseInt(filter.split('_')[1])
        return receipt.method === methodId
      }
      return receipt.status.toString() === filter
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date, most recent first

  const handleStatusChange = async (transferId, receiptId, newStatus) => {
    try {
      const response = await updateReceiptStatus({
        transferId: transferId, // This should be the payment ID
        status: newStatus,
        id: receiptId // This should be the user ID
      })
      if (response?.status === 204 || response === undefined) {
        const updatedReceipts = await getAllReceipts()
        setReceipts(updatedReceipts)
      } else {
        setReceipts(prev =>
          prev.map(receipt =>
            receipt.id === receiptId
              ? {
                  ...receipt,
                  status: newStatus,
                  updatedAt: new Date().toISOString()
                }
              : receipt
          )
        )
      }

      showSnackbar('Estado actualizado correctamente', 'success')
      setShowModal(false)
    } catch (error) {
      showSnackbar('Error al actualizar el estado', 'error')
      console.error('Error updating status:', error)
    }
  }

  const openModal = receipt => {
    setSelectedReceipt(receipt)
    setShowModal(true)
  }

  const openFile = async receipt => {
    try {
      setLoading(true)
      const response = await getPdfFile({ idFile: receipt })
      const url = window.URL.createObjectURL(response)
      window.open(url, '_blank')
    } catch (error) {
      showSnackbar('Error al cargar el comprobante', 'error')
      console.error('Error fetching file:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    // Convert to GMT-3 (Argentina timezone)
    const argentinaTime = new Date(date.getTime() - 3 * 60 * 60 * 1000)
    return argentinaTime.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const getPaymentMethodInfo = methodId => {
    return (
      paymentMethods[methodId] || {
        label: 'Desconocido',
        color: '#666',
        icon: '❓'
      }
    )
  }

  // Calculate statistics
  const stats = {
    total: receipts.length,
    pending: receipts.filter(r => r.status === 1).length,
    processing: receipts.filter(r => r.status === 2).length,
    approved: receipts.filter(r => r.status === 3).length,
    completed: receipts.filter(r => r.status === 4).length,
    failed: receipts.filter(r => r.status === 5 || r.status === 6).length,
    totalRevenue: receipts
      .filter(r => r.status === 4)
      .reduce((sum, r) => sum + (r.amount || 0), 0),
    byMethod: Object.keys(paymentMethods).reduce((acc, methodId) => {
      acc[methodId] = receipts.filter(
        r => r.method === Number.parseInt(methodId)
      ).length
      return acc
    }, {})
  }

  if (loading && !authorized) {
    return (
      <div className='admin-wrapper'>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Verificando permisos...</p>
        </div>
        <style jsx>{`
          .admin-wrapper {
            background-color: #0e0b1f;
            color: #fff;
            min-height: 100vh;
            padding: 2rem;
          }

          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 50vh;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #2b2145;
            border-top: 3px solid #9b4dff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <div className='admin-wrapper'>
      <div className='admin-container'>
        <div className='admin-header'>
          <h1 className='admin-title'>Panel de Administración</h1>
          <p className='admin-subtitle'>Gestión de Pagos y Transacciones</p>
        </div>

        {/* Statistics Cards */}
        <div className='stats-grid'>
          <div className='stat-card'>
            <div className='stat-icon'>📊</div>
            <div className='stat-content'>
              <h3>Total Transacciones</h3>
              <p className='stat-number'>{stats.total}</p>
            </div>
          </div>
          <div className='stat-card'>
            <div className='stat-icon'>⏳</div>
            <div className='stat-content'>
              <h3>Pendientes</h3>
              <p className='stat-number'>{stats.pending}</p>
            </div>
          </div>
          <div className='stat-card'>
            <div className='stat-icon'>✅</div>
            <div className='stat-content'>
              <h3>Completadas</h3>
              <p className='stat-number'>{stats.completed}</p>
            </div>
          </div>
          <div className='stat-card'>
            <div className='stat-icon'>💰</div>
            <div className='stat-content'>
              <h3>Ingresos Totales</h3>
              <p className='stat-number'>
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className='filters-section'>
          <div className='filter-buttons'>
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos ({stats.total})
            </button>
            <button
              className={`filter-btn ${
                filter === 'pending_bank' ? 'active' : ''
              }`}
              onClick={() => setFilter('pending_bank')}
            >
              🏦 Transferencias Pendientes (
              {receipts.filter(r => r.method === 4 && r.status === 1).length})
            </button>
            <button
              className={`filter-btn ${filter === '1' ? 'active' : ''}`}
              onClick={() => setFilter('1')}
            >
              ⏳ Pendientes ({stats.pending})
            </button>
            <button
              className={`filter-btn ${filter === '2' ? 'active' : ''}`}
              onClick={() => setFilter('2')}
            >
              🔄 Procesando ({stats.processing})
            </button>
            <button
              className={`filter-btn ${filter === '3' ? 'active' : ''}`}
              onClick={() => setFilter('3')}
            >
              ✅ Aprobados ({stats.approved})
            </button>
            <button
              className={`filter-btn ${filter === '4' ? 'active' : ''}`}
              onClick={() => setFilter('4')}
            >
              💎 Completados ({stats.completed})
            </button>
          </div>

          <div className='method-filters'>
            <h4>Filtrar por Método de Pago:</h4>
            <div className='method-buttons'>
              {Object.entries(paymentMethods).map(([methodId, method]) => (
                <button
                  key={methodId}
                  className={`method-btn ${
                    filter === `method_${methodId}` ? 'active' : ''
                  }`}
                  onClick={() => setFilter(`method_${methodId}`)}
                  style={{ borderColor: method.color }}
                >
                  {method.icon} {method.label} ({stats.byMethod[methodId] || 0})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='table-container'>
          <table className='receipts-table'>
            <thead>
              <tr>
                <th>Usuario FF</th>
                <th>Región</th>
                <th>Método de Pago</th>
                <th>Monto</th>
                <th>Diamantes</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.map(receipt => {
                const paymentMethod = getPaymentMethodInfo(receipt.method)
                return (
                  <tr key={receipt.id}>
                    <td className='user-cell'>
                      <div className='user-info'>
                        <span className='ff-user'>{receipt.ffUser}</span>
                      </div>
                    </td>
                    <td>{receipt.ffRegion}</td>
                    <td>
                      <div
                        className='payment-method'
                        style={{ color: paymentMethod.color }}
                      >
                        <span className='method-icon'>
                          {paymentMethod.icon}
                        </span>
                        <span className='method-label'>
                          {paymentMethod.label}
                        </span>
                      </div>
                    </td>
                    <td className='amount-cell'>
                      {receipt.amount ? formatCurrency(receipt.amount) : 'N/A'}
                    </td>
                    <td className='diamonds-cell'>
                      <span className='diamonds-count'>
                        💎 {receipt.diamonds}
                      </span>
                    </td>
                    <td>
                      <span
                        className='status-badge'
                        style={{
                          color: statusOptions[receipt.status].color,
                          backgroundColor: statusOptions[receipt.status].bgColor
                        }}
                      >
                        {statusOptions[receipt.status].label}
                      </span>
                    </td>
                    <td className='date-cell'>
                      {formatDate(receipt.createdAt)}
                    </td>
                    <td>
                      <div className='action-buttons'>
                        <button
                          className='view-btn'
                          onClick={() => openModal(receipt)}
                        >
                          Ver Detalles
                        </button>
                        {receipt.id && receipt.method === 4 && (
                          <button
                            onClick={() => openFile(receipt.id)}
                            className='proof-btn'
                          >
                            Ver Comprobante
                          </button>
                        )}
                        {receipt.status === 3 && (
                          <button
                            onClick={
                              () =>
                                handleStatusChange(receipt.id, receipt.id, 4) // Use receipt.id for both parameters
                            }
                            className='confirm-btn'
                          >
                            Confirmar Carga
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredReceipts.length === 0 && (
            <div className='no-data'>
              <p>No hay transacciones para mostrar</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para gestionar comprobante */}
      {showModal && selectedReceipt && (
        <div className='modal-overlay' onClick={() => setShowModal(false)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>Gestionar Transacción</h3>
              <button className='close-btn' onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <div className='modal-body'>
              <div className='receipt-details'>
                <div className='detail-row'>
                  <span className='detail-label'>Usuario FF:</span>
                  <span className='detail-value'>{selectedReceipt.ffUser}</span>
                </div>
                <div className='detail-row'>
                  <span className='detail-label'>Región:</span>
                  <span className='detail-value'>
                    {selectedReceipt.ffRegion}
                  </span>
                </div>
                <div className='detail-row'>
                  <span className='detail-label'>Método de Pago:</span>
                  <div
                    className='payment-method'
                    style={{
                      color: getPaymentMethodInfo(selectedReceipt.method).color
                    }}
                  >
                    <span className='method-icon'>
                      {getPaymentMethodInfo(selectedReceipt.method).icon}
                    </span>
                    <span className='method-label'>
                      {getPaymentMethodInfo(selectedReceipt.method).label}
                    </span>
                  </div>
                </div>
                <div className='detail-row'>
                  <span className='detail-label'>Monto:</span>
                  <span className='detail-value'>
                    {selectedReceipt.amount
                      ? formatCurrency(selectedReceipt.amount)
                      : 'N/A'}
                  </span>
                </div>
                <div className='detail-row'>
                  <span className='detail-label'>Diamantes:</span>
                  <span className='detail-value'>
                    💎 {selectedReceipt.diamonds}
                  </span>
                </div>
                <div className='detail-row'>
                  <span className='detail-label'>Estado Actual:</span>
                  <span
                    className='status-badge'
                    style={{
                      color: statusOptions[selectedReceipt.status].color,
                      backgroundColor:
                        statusOptions[selectedReceipt.status].bgColor
                    }}
                  >
                    {statusOptions[selectedReceipt.status].label}
                  </span>
                </div>
                <div className='detail-row'>
                  <span className='detail-label'>Creado:</span>
                  <span className='detail-value'>
                    {formatDate(selectedReceipt.createdAt)}
                  </span>
                </div>
                <div className='detail-row'>
                  <span className='detail-label'>Actualizado:</span>
                  <span className='detail-value'>
                    {formatDate(selectedReceipt.updatedAt)}
                  </span>
                </div>
              </div>

              <div className='status-actions'>
                <h4>Cambiar Estado:</h4>
                <div className='status-buttons'>
                  {Object.entries(statusOptions).map(([status, config]) => (
                    <button
                      key={status}
                      className={`status-action-btn ${
                        selectedReceipt.status.toString() === status
                          ? 'current'
                          : ''
                      }`}
                      style={{
                        borderColor: config.color,
                        backgroundColor:
                          selectedReceipt.status.toString() === status
                            ? config.bgColor
                            : 'transparent'
                      }}
                      onClick={() =>
                        handleStatusChange(
                          selectedReceipt.id,
                          selectedReceipt.userId,
                          Number.parseInt(status)
                        )
                      }
                      disabled={selectedReceipt.status.toString() === status}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-wrapper {
          background-color: #0e0b1f;
          color: #fff;
          min-height: 100vh;
          padding: 2rem;
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .admin-title {
          font-size: 2.5rem;
          color: #d4bfff;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px #9b4dff88;
        }

        .admin-subtitle {
          color: #9b4dff;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #1c1534;
          border: 2px solid #9b4dff;
          border-radius: 0.75rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 0 15px #9b4dff44;
        }

        .stat-icon {
          font-size: 2rem;
          background: #9b4dff22;
          padding: 0.75rem;
          border-radius: 0.5rem;
        }

        .stat-content h3 {
          margin: 0 0 0.5rem 0;
          color: #d4bfff;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .stat-number {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
          color: #9b4dff;
        }

        .filters-section {
          margin-bottom: 2rem;
        }

        .filter-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .method-filters {
          text-align: center;
        }

        .method-filters h4 {
          color: #d4bfff;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .method-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .filter-btn,
        .method-btn {
          padding: 0.75rem 1.5rem;
          background: #2b2145;
          border: 2px solid #9b4dff;
          border-radius: 0.5rem;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .method-btn {
          border-color: #666;
        }

        .filter-btn:hover,
        .method-btn:hover {
          background: #9b4dff22;
          transform: translateY(-2px);
        }

        .filter-btn.active,
        .method-btn.active {
          background: #9b4dff;
          box-shadow: 0 0 15px #9b4dff88;
        }

        .table-container {
          background: #1c1534;
          border: 2px solid #9b4dff;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 0 20px #9b4dff44;
        }

        .receipts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .receipts-table th {
          background: #2b2145;
          padding: 1rem;
          text-align: left;
          color: #d4bfff;
          font-weight: 600;
          border-bottom: 2px solid #9b4dff;
        }

        .receipts-table td {
          padding: 1rem;
          border-bottom: 1px solid #9b4dff33;
          vertical-align: middle;
        }

        .receipts-table tr:hover {
          background: #9b4dff11;
        }

        .user-cell {
          min-width: 150px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .ff-user {
          font-weight: 600;
          color: #d4bfff;
        }

        .payment-method {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .method-icon {
          font-size: 1.2rem;
        }

        .amount-cell {
          font-weight: 600;
          color: #00ff88;
        }

        .diamonds-cell {
          font-weight: 600;
          color: #c77dff;
        }

        .status-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid currentColor;
        }

        .date-cell {
          font-size: 0.9rem;
          color: #b8b8b8;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .view-btn,
        .proof-btn,
        .confirm-btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.85rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-weight: 500;
        }

        .view-btn {
          background: #9b4dff;
          color: white;
        }

        .view-btn:hover {
          background: #b86bff;
          transform: translateY(-1px);
        }

        .proof-btn {
          background: #00ff88;
          color: #0e0b1f;
        }

        .proof-btn:hover {
          background: #33ff99;
          transform: translateY(-1px);
        }

        .confirm-btn {
          background: #b86bff20;
          border: 2px solid #b86bff;
          color: #b86bff;
        }

        .confirm-btn:hover {
          opacity: 0.7;
          transform: translateY(-1px);
        }

        .no-data {
          text-align: center;
          padding: 3rem;
          color: #9b4dff;
          font-size: 1.1rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(14, 11, 31, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: #1c1534;
          border: 2px solid #9b4dff;
          border-radius: 0.75rem;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 0 30px #9b4dff88;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #9b4dff33;
        }

        .modal-header h3 {
          color: #d4bfff;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #9b4dff;
          font-size: 2rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .close-btn:hover {
          color: #c77dff;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .receipt-details {
          margin-bottom: 2rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #9b4dff22;
        }

        .detail-label {
          font-weight: 600;
          color: #9b4dff;
        }

        .detail-value {
          color: #d4bfff;
        }

        .status-actions h4 {
          color: #d4bfff;
          margin-bottom: 1rem;
        }

        .status-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .status-action-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid;
          border-radius: 0.5rem;
          background: transparent;
          color: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .status-action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(155, 77, 255, 0.3);
        }

        .status-action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-action-btn.current {
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .admin-wrapper {
            padding: 1rem;
          }

          .admin-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filter-buttons,
          .method-buttons {
            justify-content: center;
          }

          .filter-btn,
          .method-btn {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .receipts-table {
            font-size: 0.9rem;
          }

          .receipts-table th,
          .receipts-table td {
            padding: 0.75rem 0.5rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .modal-content {
            margin: 1rem;
          }

          .status-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
