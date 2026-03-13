import { useState } from 'react';
import { Download, File as FileIcon, Clock, HardDrive } from 'lucide-react';
import { getShelbyFileUrl } from '../utils/shelbyClient';
import './VaultList.css';

export default function VaultList({ files }) {
    const [downloadingId, setDownloadingId] = useState(null);

    if (!files || files.length === 0) {
        return (
            <div className="vault-empty glass-panel">
                <HardDrive size={48} className="empty-icon" />
                <h3>Vault is Empty</h3>
                <p>Your uploaded files will appear here with sub-second access speeds.</p>
            </div>
        );
    }

    const handleDownload = async (file) => {
        if (!file.key) {
            alert("This is a mock file without a Shelby Key.");
            return;
        }

        try {
            setDownloadingId(file.id);

            // Get the fast read URL from our Shelby Client
            const url = await getShelbyFileUrl(file.key);

            // Open the file in a new tab or trigger download
            window.open(url, '_blank');

        } catch (error) {
            console.error("Failed to fetch from Shelby:", error);
            alert("Failed to retrieve the file from the hot storage network.");
        } finally {
            setDownloadingId(null);
        }
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    const renderFileIcon = (type) => {
        return <FileIcon className="type-icon" size={24} />;
    };

    return (
        <div className="vault-list-container">
            <div className="vault-header">
                <h2>Your Data Vault</h2>
                <span className="file-count">{files.length} Item{files.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="vault-grid">
                {files.map((file) => (
                    <div key={file.id} className="vault-item glass-panel">
                        <div className="item-icon-wrapper">
                            {renderFileIcon(file.type)}
                        </div>

                        <div className="item-details">
                            <h4 className="item-name" title={file.name}>{file.name}</h4>
                            <div className="item-meta">
                                <span className="meta-size">{formatSize(file.size)}</span>
                                <span className="meta-dot">•</span>
                                <span className="meta-time">
                                    <Clock size={12} className="meta-icon" />
                                    {formatDate(file.timestamp)}
                                </span>
                            </div>
                        </div>

                        <button
                            className="download-btn"
                            title="Fetch via Shelby"
                            onClick={() => handleDownload(file)}
                            disabled={downloadingId === file.id}
                        >
                            {downloadingId === file.id ? (
                                <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                            ) : (
                                <Download size={18} />
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
