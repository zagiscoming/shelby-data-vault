/**
 * Shelby Protocol Simulation Client
 * 
 * Since the official S3 Gateway endpoint is TBD, this client simulates 
 * Shelby's high-performance hot storage behavior locally.
 */

// Simulated internal "vault" storage
const mockVault = new Map();

/**
 * Simulates uploading a file to the Shelby network.
 * Demonstrates the encryption and distribution process.
 * @param {File} file - The file object to upload.
 * @returns {Promise<Object>} - Contains simulated file meta.
 */
export const uploadFileToShelby = async (file) => {
    console.log(`[Shelby-Sim] Encrypting and fragmenting file: ${file.name}`);

    // Simulate network & encryption latency (Shelby is fast, but not instant)
    await new Promise(resolve => setTimeout(resolve, 800));

    const fileKey = `sim-vault/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const mockEtag = Math.random().toString(36).substring(2, 12);

    // Store metadata locally for simulation
    mockVault.set(fileKey, {
        name: file.name,
        size: file.size,
        type: file.type,
        content: URL.createObjectURL(file) // Create a local preview URL
    });

    console.log(`[Shelby-Sim] Successfully stored in hash-node: ${mockEtag}`);

    return {
        success: true,
        key: fileKey,
        etag: mockEtag,
        originalFile: file
    };
};

/**
 * Simulates sub-second data retrieval from Shelby.
 * @param {string} fileKey - The object key
 * @returns {Promise<string>} - The local simulation URL
 */
export const getShelbyFileUrl = async (fileKey) => {
    // Simulate Shelby's sub-second "Hot Read" speed
    await new Promise(resolve => setTimeout(resolve, 150));

    const fileData = mockVault.get(fileKey);
    if (!fileData) {
        throw new Error("File not found in simulated Shelby network.");
    }

    return fileData.content;
};
