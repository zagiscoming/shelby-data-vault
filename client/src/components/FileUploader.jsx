import { useState, useCallback } from 'react';
import { UploadCloud, FileType, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFileToShelby } from '../utils/shelbyClient';
import './FileUploader.css';

export default function FileUploader({ onUploadSuccess }) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (selectedFile) => {
        setFile(selectedFile);
        setStatus('idle');
    };

    const uploadToShelbyDataVault = async () => {
        if (!file) return;

        setStatus('uploading');

        try {
            // Connect to Shelby Protocol via S3
            const result = await uploadFileToShelby(file);

            setStatus('success');

            const newUpload = {
                id: result.etag || Math.random().toString(36).substring(7),
                name: file.name,
                size: file.size,
                type: file.type,
                timestamp: new Date().toISOString(),
                key: result.key
            };

            onUploadSuccess(newUpload);

            // Reset after a brief moment
            setTimeout(() => {
                setFile(null);
                setStatus('idle');
            }, 2000);
        } catch (error) {
            console.error("Shelby Protocol Upload Error:", error);
            setStatus('error');

            // Reset back to idle after showing error for a few seconds
            setTimeout(() => {
                setStatus('idle');
            }, 3000);
        }
    };

    return (
        <div className="uploader-card glass-panel">
            <div className="card-header">
                <h2 className="card-title">Upload Data</h2>
                <p className="card-subtitle">Secure hot-storage via Shelby Protocol</p>
            </div>

            <div
                className={`drop-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
            >
                <input
                    type="file"
                    id="file-input"
                    className="hidden-input"
                    onChange={handleFileInput}
                />

                {!file ? (
                    <div className="drop-content">
                        <div className="icon-pulse-wrapper">
                            <UploadCloud size={48} className="upload-icon" />
                        </div>
                        <h3>Drag & default_api:drop</h3>
                        <p>or click to browse files</p>
                    </div>
                ) : (
                    <div className="file-preview">
                        <FileType size={32} className="file-icon" />
                        <div className="file-info">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    </div>
                )}
            </div>

            {file && (
                <button
                    className={`upload-btn ${status}`}
                    onClick={uploadToShelbyDataVault}
                    disabled={status === 'uploading' || status === 'success'}
                >
                    {status === 'idle' && 'Encrypt & Upload to Vault'}
                    {status === 'uploading' && <div className="loader"></div>}
                    {status === 'success' && <><CheckCircle size={18} /> Uploaded Successfully</>}
                    {status === 'error' && <><AlertCircle size={18} /> Upload Failed</>}
                </button>
            )}
        </div>
    );
}
