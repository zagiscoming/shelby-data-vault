import { useState } from 'react';
import { Database, ShieldCheck } from 'lucide-react';
import FileUploader from './components/FileUploader';
import VaultList from './components/VaultList';

export default function App() {
  const [vaultFiles, setVaultFiles] = useState([]);

  const handleUploadSuccess = (newFile) => {
    setVaultFiles(prev => [newFile, ...prev]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <Database size={32} className="logo-icon" />
          <h1 className="logo-text">Shelby Data Vault</h1>
        </div>

        <div className="status-badge">
          <div className="status-dot"></div>
          Connected to Aptos DevNet
        </div>
      </header>

      <main>
        <div className="dashboard-grid">
          {/* Main Content Area - File Uploader */}
          <section className="upload-section">
            <div className="info-banner glass-panel" style={{ marginBottom: '2rem', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderColor: 'var(--accent-tertiary)' }}>
              <ShieldCheck size={24} color="var(--accent-tertiary)" />
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Cloud-Grade Hot Storage</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Files uploaded here are encrypted and distributed across the Shelby verification node network for sub-second retrieval.</p>
              </div>
            </div>

            <div className="info-banner glass-panel" style={{ marginBottom: '2rem', padding: '1rem 1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--accent-primary)' }}>Simulation Mode: Active</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                The Shelby S3 Gateway is currently TBD in official docs. The app is now simulating high-performance hot storage operations locally to demonstrate the intended user flow and sub-second speeds.
              </p>
            </div>

            <FileUploader onUploadSuccess={handleUploadSuccess} />
          </section>

          {/* Sidebar - Vault List */}
          <aside className="vault-sidebar" style={{ height: '600px' }}>
            <VaultList files={vaultFiles} />
          </aside>
        </div>
      </main>
    </div>
  );
}
