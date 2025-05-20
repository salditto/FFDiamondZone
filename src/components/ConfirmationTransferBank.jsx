import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function DropPdf() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

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
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

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
         <button className="btn btn-primary">Subir comprobante</button>
      </div>
     

      <style jsx>{`
        .payment-button {
          padding: 15px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px; /* Reducir gap para acomodar bonus */
          text-align: center;
          position: relative; /* Para posicionar bonus si es necesario */
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
