import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { postBankTransferComprobante } from "../services/BankTransfer.service";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../context/SnackBarContext";
import { useAuth } from "../context/AuthContext";

export default function DropPdf({
  userId,
  FFUser,
  FFRegion,
  packageId,
  playerIdError,
}) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setError("Formato no válido. Solo se aceptan archivos PDF o imágenes.");
      setFile(null);
    } else {
      setFile(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: false,
    disabled: !isAuthenticated || !!playerIdError,
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
      await postBankTransferComprobante({
        userId,
        FFUser,
        FFRegion,
        packageId,
        file,
      });
      showSnackbar("Comprobante subido con éxito", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Error al subir el comprobante", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="payment-button" {...getRootProps()}>
        <input
          {...getInputProps()}
          disabled={!isAuthenticated || playerIdError}
        />
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
          disabled={!isAuthenticated || loading || playerIdError}
        >
          {loading ? "Subiendo..." : "Subir comprobante"}
        </button>
      </div>

      {!isAuthenticated && (
        <p style={{ color: "#ff4d4d", fontWeight: "bold", marginTop: "20px", textAlign: "center" }}>
          Necesitás estar logueado para comprar diamantes
        </p>
      )}

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

        .btn:disabled,
        .btn[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: #555;
          border-color: #555;
          color: #ccc;
        }
      `}</style>
    </div>
  );
}
