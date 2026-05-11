const { exec } = require('child_process');
const path = require('path');

/**
 * Wrapper to run the Auto-Indexer script as a separate process
 * to ensure it doesn't block the main server thread.
 */

function runIndexer() {
  return new Promise((resolve, reject) => {
    console.log('[JARVIS-INDEXER] Initializing dynamic feature ingestion...');
    const indexerPath = path.join(__dirname, 'auto_indexer.js');
    
    exec(`node "${indexerPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[JARVIS-INDEXER] Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.warn(`[JARVIS-INDEXER] Stderr: ${stderr}`);
      }
      console.log(stdout);
      resolve();
    });
  });
}

module.exports = { runIndexer };
