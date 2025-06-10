// pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import { useSnackbar } from "../context/SnackBarContext";
import {
  getAllReceipts,
  updateReceiptStatus,
} from "../services/AdminPanelService";
import { getPdfFile } from "../services/BankTransfer.service";

export default function AdminPanel() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { showSnackbar } = useSnackbar();

  // Estados posibles para los comprobantes
  const statusOptions = {
    0: { label: "Pendiente", color: "#ff9500", bgColor: "#ff950020" },
    1: { label: "Procesando", color: "#00aaff", bgColor: "#00aaff20" },
    2: { label: "Aprobado", color: "#00ff88", bgColor: "#00ff8820" },
    3: { label: "Diamantes Cargados", color: "#b86bff", bgColor: "#b86bff20" },
    4: { label: "Fallido", color: "#ff4757", bgColor: "#ff475720" },
    5: { label: "Cancelado", color: "#999", bgColor: "#99999920" },
  };

  // Cargar datos desde la API
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const response = await getAllReceipts();
        console.log(response);
        setReceipts(response);
      } catch (error) {
        showSnackbar("Error al cargar los comprobantes", "error");
        console.error("Error fetching receipts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const filteredReceipts = receipts.filter((receipt) => {
    if (filter === "all") return true;
    return receipt.status.toString() === filter;
  });

  const handleStatusChange = async (transferId, receiptId, newStatus) => {
    console.log(transferId);
    console.log(receiptId);
    console.log(newStatus);

    try {
      const response = await updateReceiptStatus({
        transferId: transferId,
        status: newStatus,
        id: receiptId,
      });
      console.log(response);
      // Si la API responde con 204, recargar desde el servidor
      if (response?.status === 204 || response === undefined) {
        const updatedReceipts = await getAllReceipts();
        setReceipts(updatedReceipts);
      } else {
        // Caso alternativo: actualizar localmente (si se devuelve algo útil)
        setReceipts((prev) =>
          prev.map((receipt) =>
            receipt.id === receiptId
              ? {
                  ...receipt,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : receipt
          )
        );
      }

      showSnackbar("Estado actualizado correctamente", "success");
      setShowModal(false);
    } catch (error) {
      showSnackbar("Error al actualizar el estado", "error");
      console.error("Error updating status:", error);
    }
  };

  const openModal = (receipt) => {
    setSelectedReceipt(receipt);
    setShowModal(true);
  };

  const openFile = async (receipt) => {
    console.log(receipt);
    try {
      setLoading(true);
      const response = await getPdfFile({ idFile: receipt });
      console.log(response);
      setReceipts(response);
    } catch (error) {
      showSnackbar("Error al cargar los comprobantes", "error");
      console.error("Error fetching receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-AR");
  };

  const getPackageName = (packageId) => {
    const packages = {
      "100_diamonds": "100 Diamantes",
      "310_diamonds": "310 Diamantes",
      "520_diamonds": "520 Diamantes",
      "1060_diamonds": "1060 Diamantes",
      "2180_diamonds": "2180 Diamantes",
      "5600_diamonds": "5600 Diamantes",
    };
    return packages[packageId] || packageId;
  };

  if (loading) {
    return (
      <div className="admin-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando comprobantes...</p>
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
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Panel de Administración</h1>
        </div>

        <div className="filters-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Todos ({receipts.length})
            </button>
            <button
              className={`filter-btn ${filter === "0" ? "active" : ""}`}
              onClick={() => setFilter("0")}
            >
              Pendientes ({receipts.filter((r) => r.status === 0).length})
            </button>
            <button
              className={`filter-btn ${filter === "1" ? "active" : ""}`}
              onClick={() => setFilter("1")}
            >
              Procesando ({receipts.filter((r) => r.status === 1).length})
            </button>
            <button
              className={`filter-btn ${filter === "2" ? "active" : ""}`}
              onClick={() => setFilter("2")}
            >
              Aprobados ({receipts.filter((r) => r.status === 2).length})
            </button>
            <button
              className={`filter-btn ${filter === "3" ? "active" : ""}`}
              onClick={() => setFilter("3")}
            >
              Diamantes Cargados (
              {receipts.filter((r) => r.status === 3).length})
            </button>
            <button
              className={`filter-btn ${
                filter === "4" || filter === "5" ? "active" : ""
              }`}
              onClick={() => setFilter("4")}
            >
              Rechazados ({receipts.filter((r) => r.status === 4).length})
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="receipts-table">
            <thead>
              <tr>
                <th>Usuario FF</th>
                <th>Región</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td className="user-cell">
                    <div className="user-info">
                      <span className="ff-user">{receipt.ffUser}</span>

                    </div>
                  </td>
                  <td>{receipt.ffRegion}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        color: statusOptions[receipt.status].color,
                        backgroundColor: statusOptions[receipt.status].bgColor,
                      }}
                    >
                      {statusOptions[receipt.status].label}
                    </span>
                  </td>
                  <td className="date-cell">{formatDate(receipt.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => openModal(receipt)}
                      >
                        Ver Detalles
                      </button>
                      {receipt.proofUrl && (
                        <a
                          onClick={() => openFile(receipt.proofUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="proof-btn"
                        >
                          Ver Comprobante
                        </a>
                      )}
                      {receipt.status === 2 && (
                        <a>
                          <button
                            onClick={() =>
                              handleStatusChange(receipt.id, receipt.userId, 3)
                            }
                            className="confirm-btn"
                          >
                            Confirmar diamantes cargados
                          </button>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReceipts.length === 0 && (
            <div className="no-data">
              <p>No hay comprobantes para mostrar</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para gestionar comprobante */}
      {showModal && selectedReceipt && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gestionar Comprobante</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="receipt-details">
                <div className="detail-row">
                  <span className="detail-label">Usuario FF:</span>
                  <span className="detail-value">{selectedReceipt.ffUser}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Región:</span>
                  <span className="detail-value">
                    {selectedReceipt.ffRegion}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Estado Actual:</span>
                  <span
                    className="status-badge"
                    style={{
                      color: statusOptions[selectedReceipt.status].color,
                      backgroundColor:
                        statusOptions[selectedReceipt.status].bgColor,
                    }}
                  >
                    {statusOptions[selectedReceipt.status].label}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Creado:</span>
                  <span className="detail-value">
                    {formatDate(selectedReceipt.createdAt)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Actualizado:</span>
                  <span className="detail-value">
                    {formatDate(selectedReceipt.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="status-actions">
                <h4>Cambiar Estado:</h4>
                <div className="status-buttons">
                  {Object.entries(statusOptions).map(([status, config]) => (
                    <button
                      key={status}
                      className={`status-action-btn ${
                        selectedReceipt.status.toString() === status
                          ? "current"
                          : ""
                      }`}
                      style={{
                        borderColor: config.color,
                        backgroundColor:
                          selectedReceipt.status.toString() === status
                            ? config.bgColor
                            : "transparent",
                      }}
                      onClick={() =>
                        handleStatusChange(
                          selectedReceipt.id,
                          selectedReceipt.userId,
                          parseInt(status)
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

        .confirm-btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          background: #b86bff20;
          border-color: rgb(184, 107, 255);
          border: 2px solid;
          color: #b86bff;
        }

        .confirm-btn:hover {
          opacity: 0.7
          transform: translateY(-1px);
        }

        .admin-subtitle {
          color: #9b4dff;
          font-size: 1.1rem;
        }

        .filters-section {
          margin-bottom: 2rem;
        }

        .filter-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .filter-btn {
          padding: 0.75rem 1.5rem;
          background: #2b2145;
          border: 2px solid #9b4dff;
          border-radius: 0.5rem;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .filter-btn:hover {
          background: #9b4dff22;
          transform: translateY(-2px);
        }

        .filter-btn.active {
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
          min-width: 180px;
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

        .user-id {
          font-size: 0.85rem;
          color: #9b4dff;
        }

        .package-cell {
          font-weight: 500;
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
        .proof-btn {
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

          .filter-buttons {
            justify-content: center;
          }

          .filter-btn {
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
  );
}
