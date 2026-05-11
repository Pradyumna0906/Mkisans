/**
 * MKisans JARVIS — Layer 4: Knowledge Integration
 * Deep understanding of app features, UI, and workflows.
 */

const intentRouter = require('./intent_router');
const functions = require('./function_registry');
const fs = require('fs');
const path = require('path');

class JarvisKnowledgeProcessor {
  constructor() {
    this.kbPath = path.join(__dirname, 'config', 'knowledge_base.json');
    this.loadKnowledge();
  }

  loadKnowledge() {
    const data = fs.readFileSync(this.kbPath, 'utf8');
    this.kb = JSON.parse(data);
  }

  async handle(query, context = {}) {
    const { intent } = intentRouter.classify(query);
    const q = query.toLowerCase();

    console.log(`[JARVIS-KB] Processing with App Knowledge: ${intent}`);

    // 1. Workflow / "How-to" Detection
    if (q.includes('kaise') || q.includes('how to') || q.includes('step')) {
       return this.solveWorkflowQuery(q);
    }

    // 2. Navigation Node Detection
    if (q.includes('kholo') || q.includes('open') || q.includes('dikhao')) {
       return this.solveNavigationQuery(q);
    }

    // 3. Fallback to Layer 3 Execution (Data/Actions)
    // For brevity in this turn, I'm delegating the rest to the execution engine
    const engine = require('./jarvis_processor'); 
    return await engine.processRequest(query, context);
  }

  solveWorkflowQuery(q) {
    if (q.includes('listing') || q.includes('jode') || q.includes('crop')) {
      const steps = this.kb.features_deep_dive.crop_listing.workflow;
      return {
        text: `फसल जोड़ने के लिए इन चरणों का पालन करें: ${steps.join('। ')}। क्या मैं यह स्क्रीन खोलूँ?`,
        type: 'WORKFLOW_GUIDE',
        route: 'MyCrops'
      };
    }
    if (q.includes('logistics') || q.includes('booking') || q.includes('gadi')) {
      const steps = this.kb.features_deep_dive.logistics_booking.workflow;
      return {
        text: `गाड़ी बुक करने के लिए: ${steps.join('। ')}।`,
        type: 'WORKFLOW_GUIDE',
        route: 'LogisticsMap'
      };
    }
    return { text: "माफ़ कीजिये, इस फीचर का स्टेप-बाय-स्टेप गाइड अभी उपलब्ध नहीं है।" };
  }

  solveNavigationQuery(q) {
    const screens = this.kb.navigation_graph.tabs.concat(Object.keys(this.kb.navigation_graph.stack_screens));
    for (const screen of screens) {
      if (q.includes(screen.toLowerCase())) {
        return { text: `${screen} स्क्रीन खोल रहा हूँ...`, route: screen };
      }
    }
    return { text: "मैं समझ नहीं पाया कि आप कौन सी स्क्रीन खोलना चाहते हैं।" };
  }
}

const processor = new JarvisKnowledgeProcessor();

module.exports = {
  processRequest: async (q, ctx) => processor.handle(q, ctx)
};
