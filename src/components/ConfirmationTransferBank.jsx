import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getBankTransferInfo, postBankTransferComprobante } from "../services/BankTransfer.service";

export default function DropPdf() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setError("Solo se permiten archivos PDF.");
      setFile(null);
    } else {
      setFile(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      setError("No hay archivo para subir.");
      return;
    }

    setLoading(true);

    try {
      const userId = "c39a1f40-56b5-4e91-b20e-79c0d2de799f"; // reemplazá según tu lógica
      const packageId = "PACK123"; // idem

      const response = await postBankTransferComprobante({
        userId,
        packageId,
        file,
      });

      console.log("Comprobante subido:", response);
      alert("Comprobante subido con éxito");
    } catch (err) {
      console.error(err);
      alert("Error al subir el comprobante");
    } finally {
      setLoading(false);
    }
  };

  const getInfo = async () => {
    try {
      const response = await getBankTransferInfo();
      console.log("Comprobante subido:", response);
    } catch (err) {
      console.error(err);
      alert("Error al subir el comprobante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="payment-button" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Soltá el PDF acá...</p>
        ) : (
          <p>Arrastrá un PDF o hacé click para subir</p>
        )}
        {file && (
          <p>
            📄 Archivo: <strong>{file.name}</strong>
          </p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div className="button-center">
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Subiendo..." : "Subir comprobante"}
        </button>

        <button
          className="btn btn-primary"
          onClick={getInfo}
          disabled={loading}
        >
          {loading ? "Subiendo..." : "Subir comprobante"}
        </button>
      </div>

      <style jsx>{`
        .payment-button {
          padding: 15px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          text-align: center;
          border-radius: 8px;
          border: 1px solid var(--border-color-light);
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--subtext-color);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
        }
        .button-center {
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }
      `}</style>
    </div>
  );
}
