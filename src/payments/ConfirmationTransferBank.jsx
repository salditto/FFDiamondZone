import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  getBankTransferInfo,
  postBankTransferComprobante,
} from "../services/BankTransfer.service";
import { useTranslation } from "react-i18next";

export default function DropPdf({ userId, FFUser, FFRegion, packageId }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

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

    if (!userId || !FFUser || !FFRegion) {
      setError("Faltan datos obligatorios para subir el comprobante.");
      return;
    }

    setLoading(true);

    try {
      const response = await postBankTransferComprobante({
        userId,
        FFUser,
        FFRegion,
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
          <p>{t("upload.drop_active")}</p>
        ) : (
          <p>{t("upload.drop_prompt")}</p>
        )}
        {file && (
          <p
            dangerouslySetInnerHTML={{
              __html: t("upload.file_label", { filename: file.name }),
            }}
          />
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
