# Architecture Overview

## Shelby Data Vault

The Shelby Data Vault is a client-side application designed to demonstrate the high-performance capabilities of the **Shelby Protocol**.

### Component Breakdown

1.  **Frontend (React)**:
    *   State management for simulating network latency.
    *   Premium UI components using glassmorphism and modern CSS.
2.  **Simulation Engine**:
    *   Located in `src/utils/shelbyClient.js`.
    *   Mimics the fragmentation and encryption flows of the Shelby Protocol.
3.  **Hot Storage Protocol**:
    *   Simulates sub-second data retrieval across a distributed node network.

### Security Model

*   **Fragmentation**: Data is split into fragments before transit.
*   **Encryption**: Each Fragment is encrypted using AES-256 (simulated).
*   **Redundancy**: Reed-Solomon erasure coding ensures data availability (simulated).
