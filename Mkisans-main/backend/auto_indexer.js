const fs = require('fs');
const path = require('path');

/**
 * MKisans JARVIS — Auto-Update Ingestion Pipeline
 * Scans the project for feature manifests and updates the Knowledge Base.
 */

class AutoIndexer {
  constructor() {
    this.kbPath = path.join(__dirname, 'config', 'knowledge_base.json');
    this.modulesDir = path.join(__dirname, 'modules');
  }

  async run() {
    console.log('[JARVIS-INDEXER] Scanning for new features...');
    
    // 1. Ensure Knowledge Base exists
    if (!fs.existsSync(this.kbPath)) {
      fs.writeFileSync(this.kbPath, JSON.stringify({ modules: {} }, null, 2));
    }

    const kb = JSON.parse(fs.readFileSync(this.kbPath, 'utf8'));
    if (!kb.modules) kb.modules = {};

    // 2. Scan modules directory for manifest.json files
    const foundManifests = this.findManifests(this.modulesDir);
    console.log(`[JARVIS-INDEXER] Found ${foundManifests.length} manifests.`);

    let updated = false;
    foundManifests.forEach(manifestPath => {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const moduleId = manifest.module_id;

      if (!kb.modules[moduleId]) {
        console.log(`[JARVIS-INDEXER] Indexing NEW feature: ${moduleId}`);
        kb.modules[moduleId] = {
          id: moduleId,
          description: manifest.purpose,
          route: manifest.route,
          voice_intro: manifest.tutorial.intro,
          actions: manifest.actions,
          tutorial_steps: manifest.tutorial.steps,
          queries: manifest.queries,
          indexed_at: new Date().toISOString()
        };
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(this.kbPath, JSON.stringify(kb, null, 2));
      console.log('[JARVIS-INDEXER] Knowledge Base updated successfully.');
    } else {
      console.log('[JARVIS-INDEXER] No new features found.');
    }
  }

  findManifests(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        this.findManifests(filePath, fileList);
      } else if (file === 'manifest.json') {
        fileList.push(filePath);
      }
    });
    return fileList;
  }
}

const indexer = new AutoIndexer();
indexer.run();
