require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const axios = require('axios');

/**
 * MKisans AI Engine — Groq LPU Integration (v3.0)
 * Full intelligence system: site tutorials, Q&A, navigation, and farming advice.
 */
class GroqAIEngine {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama-3.3-70b-versatile';
    this.fallbackModel = 'llama-3.1-8b-instant';
    
    // Tools registry
    this.functionRegistry = require('./function_registry');
  }

  buildSystemPrompt(context = {}) {
    const userName = context.name || 'User';
    const userRole = context.role || 'officer';
    let dynamicFeatures = "";
    
    try {
       const kbPath = require('path').join(__dirname, 'config', 'knowledge_base.json');
       if (require('fs').existsSync(kbPath)) {
          const kb = JSON.parse(require('fs').readFileSync(kbPath, 'utf8'));
          if (kb.modules) {
             dynamicFeatures = Object.values(kb.modules).map(m => `- ${m.id} (${m.route}): ${m.description}`).join('\n');
          }
       }
    } catch(e) { }

    return `You are JARVIS — the intelligent AI assistant for the MKisans platform, a government-backed agricultural technology platform in India.

## YOUR IDENTITY & CONSTRAINTS
- Name: JARVIS (Just A Rather Very Intelligent System)
- Platform: MKisans — connecting farmers, zonal officers, delivery partners, and consumers
- You are strictly an App Copilot + Agricultural Operations Assistant.
- CRITICAL RULE: If the user asks an unrelated question (e.g. "IPL कौन जीतेगा?", "tell me a joke", politics, etc), you MUST respond EXACTLY with: "मैं MKisans सहायक हूँ और कृषि व ऐप संबंधित सहायता के लिए उपलब्ध हूँ।" DO NOT answer off-topic questions.
- You speak naturally in both Hindi (primary) and English/Hinglish.

## CURRENT USER
- Name: ${userName}
- Role: ${userRole}

## MODES

### 1. APP TUTORIAL MODE
If the user requests "App Tutorial" or asks to learn about the app:
- Act like an interactive voice onboarding guide.
- Start with: "नमस्ते किसान भाई, मैं MKisans AI सहायक हूँ। आइए मैं आपको इस ऐप की सभी सुविधाओं के बारे में बताता हूँ।"
- Then explain the following features step-by-step:
  - Dashboard: dashboard overview, alerts, activity summary.
  - Crop Listing: how to list crops, upload photos, set expected price.
  - Orders: view active, pending, and completed orders.
  - Mandi Prices: live mandi prices, crop comparison.
  - Weather: local weather, rainfall alerts, crop advisory.
  - Logistics: pickup booking, delivery estimation, vehicle tracking.
  - Payments: earnings, payment status.
  - Support: complaint resolution, issue reporting.
- Profile Management: update name, state, district, village, and address via voice commands.
- Format it nicely with bullet points.
- Pause or say "आप 'अगला' बोल सकते हैं" to encourage interaction.

### 2. QUERY / TASK MODE
If the user is asking practical questions (Market Intelligence, Order Management, Weather, Logistics, etc.):
- Use your tools to fetch live database answers for Mandi prices, Orders, Earnings, Weather, etc.
- Answer in HINDI (or Hinglish) naturally. Keep it conversational like a smart voice assistant.
- Give short, concise answers suitable for Voice Output.

## PLATFORM FEATURES & AUTO-UPDATION
Below are the CURRENT features of the platform (auto-updated from Knowledge Base). You have COMPLETE access to this knowledge:
1. Dashboard (/): Quick stats, alerts.
2. Farmers (/farmers): Manage farmers.
3. Mandi Intelligence (/mandi-intelligence): Real-time mandi prices, AI price predictions.
4. Logistics Map (/logistics-map): Smart booking, freight costs, route tracking.
5. Social Feed (/social): Farmer posts, crop photos.
6. Weather (/weather-advisories): Advisories and forecasts.
7. Orders (/orders): View incoming and outgoing orders.
8. Earnings (/earnings): Check wallet balances.
${dynamicFeatures}

## RESPONSE FORMAT
- Keep responses concise (2-4 sentences for simple queries).
- Use emojis sparingly.
- Speak in Hindi mostly, unless English is requested.`;
  }

  async generateResponse(query, context = {}, history = []) {
    if (!this.apiKey) {
      console.error('[GroqAI] Error: API Key missing. Check .env file.');
      return {
        text: "I'm currently unable to connect to the AI service. Please ensure the system is configured correctly.",
        error: 'API_KEY_MISSING'
      };
    }

    const messages = [
      { role: 'system', content: this.buildSystemPrompt(context) }
    ];

    // Add conversation history (last 10 messages max)
    if (history && history.length > 0) {
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text || msg.content
        });
      }
    }

    // Add current query
    messages.push({ role: 'user', content: query });

    // Define Tools
    const tools = [
      {
        type: "function",
        function: {
          name: "getMandiPrices",
          description: "Get real-time market prices for a specific crop",
          parameters: {
            type: "object",
            properties: {
              commodity: { type: "string", description: "Name of the crop (e.g. wheat, gehu, tomato)" }
            },
            required: ["commodity"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getOrders",
          description: "Get latest orders. ALWAYS use this if the user asks about their orders, regardless of their role.",
          parameters: {
            type: "object",
            properties: {}
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getEarnings",
          description: "Get total earnings for the current user",
          parameters: {
            type: "object",
            properties: {}
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getWeather",
          description: "Get current weather advisory",
          parameters: {
            type: "object",
            properties: {}
          }
        }
      },
      {
        type: "function",
        function: {
          name: "listCropForSale",
          description: "Automate adding a new crop for sale. Use this when the farmer says they want to sell or list a crop.",
          parameters: {
            type: "object",
            properties: {
              commodity: { type: "string", description: "Name of the crop to sell" },
              quantity: { type: "string", description: "Quantity (e.g., 10 quintal, 50 kg)" },
              price: { type: "number", description: "Expected price" }
            },
            required: ["commodity"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "draftMessageToManager",
          description: "Draft a message or complain to the Zonal Manager.",
          parameters: {
            type: "object",
            properties: {
              message: { type: "string", description: "The content of the message to send" }
            },
            required: ["message"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "updateProfile",
          description: "Update the user's profile information such as full name, state, district, village, or address.",
          parameters: {
            type: "object",
            properties: {
              full_name: { type: "string", description: "Full name of the user" },
              email: { type: "string", description: "Email address" },
              state: { type: "string", description: "State name" },
              district: { type: "string", description: "District name" },
              village: { type: "string", description: "Village name" },
              pin_code: { type: "string", description: "PIN code" },
              address: { type: "string", description: "Detailed address" }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getProfile",
          description: "Fetch the user's current profile information and identify missing fields.",
          parameters: {
            type: "object",
            properties: {}
          }
        }
      }
    ];

    try {
      console.log(`[GroqAI] Querying ${this.model} for: "${query.substring(0, 80)}..."`);

      let response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages,
          tools,
          tool_choice: "auto",
          temperature: 0.5,
          max_tokens: 1024,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      );

      let responseMessage = response.data.choices[0].message;

      // Handle Tool Calls
      if (responseMessage.tool_calls) {
        messages.push(responseMessage); // Add assistant message with tool_calls

        for (const toolCall of responseMessage.tool_calls) {
          const fnName = toolCall.function.name;
          const args = JSON.parse(toolCall.function.arguments);
          console.log(`[GroqAI] Executing tool: ${fnName}(${JSON.stringify(args)})`);
          
          let functionResult = "";
          try {
             if (fnName === 'getMandiPrices') {
                functionResult = await this.functionRegistry.getMandiPrices(args.commodity);
             } else if (fnName === 'getOrders') {
                functionResult = await this.functionRegistry.getOrders(context.userId || 1);
             } else if (fnName === 'getEarnings') {
                functionResult = await this.functionRegistry.getEarnings(context.userId || 1);
             } else if (fnName === 'getWeather') {
                functionResult = await this.functionRegistry.getWeather();
             } else if (fnName === 'listCropForSale') {
                functionResult = await this.functionRegistry.listCropForSale(context.userId || 1, args);
             } else if (fnName === 'draftMessageToManager') {
                functionResult = await this.functionRegistry.draftMessageToManager(context.userId || 1, args);
             } else if (fnName === 'updateProfile') {
                functionResult = await this.functionRegistry.updateProfile(context.userId || 1, args);
             } else if (fnName === 'getProfile') {
                functionResult = await this.functionRegistry.getProfile(context.userId || 1);
             } else {
                functionResult = "Function not implemented.";
             }
          } catch (e) {
             functionResult = `Error executing function: ${e.message}`;
          }

          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: fnName,
            content: typeof functionResult === 'string' ? functionResult : JSON.stringify(functionResult)
          });
        }

        // Second API call with tool results
        response = await axios.post(
          this.apiUrl,
          {
            model: this.model,
            messages,
            temperature: 0.7,
            max_tokens: 800,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );
        responseMessage = response.data.choices[0].message;
      }

      const aiText = responseMessage.content;
      console.log(`[GroqAI] Success. Response length: ${aiText?.length} chars`);

      // Detect navigation intent from response
      const route = this.detectRoute(aiText, query);

      return {
        text: aiText,
        source: 'Groq-LPU',
        model: this.model,
        route: route || undefined,
      };
    } catch (err) {
      console.error('[GroqAI] Primary model failed:', err.response?.data?.error?.message || err.message);

      // Try fallback model
      try {
        console.log(`[GroqAI] Trying fallback model: ${this.fallbackModel}`);
        const fallbackResponse = await axios.post(
          this.apiUrl,
          {
            model: this.fallbackModel,
            messages,
            temperature: 0.7,
            max_tokens: 600,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 12000
          }
        );

        const fallbackText = fallbackResponse.data.choices[0].message.content;
        const route = this.detectRoute(fallbackText, query);

        return {
          text: fallbackText,
          source: 'Groq-LPU-Fallback',
          model: this.fallbackModel,
          route: route || undefined,
        };
      } catch (fallbackErr) {
        console.error('[GroqAI] Fallback also failed:', fallbackErr.message);
        return {
          text: "I'm experiencing connectivity issues right now. Please try again in a moment. Meanwhile, you can navigate the platform using the sidebar menu.",
          error: 'AI_UNAVAILABLE',
          source: 'fallback-static',
        };
      }
    }
  }

  detectRoute(responseText, query) {
    const q = (query + ' ' + responseText).toLowerCase();
    const routeMap = [
      { keywords: ['farmer', 'kisan', 'किसान'], route: '/farmers' },
      { keywords: ['delivery', 'partner', 'डिलीवरी'], route: '/delivery-partners' },
      { keywords: ['mandi', 'market price', 'भाव', 'rate', 'मंडी'], route: '/mandi-intelligence' },
      { keywords: ['social', 'feed', 'post', 'photo', 'सोशल'], route: '/social' },
      { keywords: ['logistics', 'transport', 'freight', 'गाड़ी', 'लॉजिस्टिक'], route: '/logistics-map' },
      { keywords: ['weather', 'mausam', 'barish', 'मौसम', 'बारिश'], route: '/weather-advisories' },
      { keywords: ['trade', 'analytics', 'revenue', 'एनालिटिक्स'], route: '/trade-analytics' },
      { keywords: ['alert', 'emergency', 'अलर्ट'], route: '/alerts' },
      { keywords: ['setting', 'profile', 'सेटिंग'], route: '/settings' },
      { keywords: ['crop', 'sell', 'list', 'फसल', 'बेचना', 'add crop'], route: '/my-crops' },
      { keywords: ['manager', 'chat', 'support', 'मैनेजर', 'संदेश'], route: '/support' },
    ];

    // Only detect route if user is explicitly asking to navigate
    const navWords = ['open', 'go to', 'show', 'navigate', 'take me', 'kholo', 'dikhao', 'le chalo'];
    const isNavRequest = navWords.some(w => q.includes(w));

    if (isNavRequest) {
      for (const entry of routeMap) {
        if (entry.keywords.some(k => q.includes(k))) {
          return entry.route;
        }
      }
    }
    return null;
  }
}

module.exports = new GroqAIEngine();
