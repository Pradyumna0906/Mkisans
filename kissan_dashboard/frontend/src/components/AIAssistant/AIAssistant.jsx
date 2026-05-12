import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, RotateCcw, Sparkles, ArrowRight, Minus, Mic, MicOff, BookOpen, Volume2, Terminal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AIAssistant.css';

const API_BASE = 'http://localhost:5000/api/jarvis';

const DEFAULT_SUGGESTIONS = [
  { id: 1, text: "How do I check mandi prices?", icon: "📊" },
  { id: 2, text: "Show me today's weather advisory", icon: "🌤️" },
  { id: 3, text: "How to add a new farmer?", icon: "👨‍🌾" },
  { id: 4, text: "Guide me through logistics booking", icon: "🚛" },
  { id: 5, text: "What features does MKisans have?", icon: "✨" },
  { id: 6, text: "How does the social feed work?", icon: "📱" },
];

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 20); // 20ms per character
    return () => clearInterval(timer);
  }, [text]);
  
  return <>{displayedText}</>;
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { officer } = useAuth();

  // Web Speech API Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(SpeechRecognition ? new SpeechRecognition() : null);

  useEffect(() => {
    if (recognition.current) {
      recognition.current.lang = 'hi-IN'; // Default to Hindi for farmers
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setInput(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          sendMessage(finalTranscript, voiceEnabled);
          recognition.current.stop(); // Stop after one complete sentence
        }
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
      
      recognition.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, [voiceEnabled]);

  const speakText = useCallback(async (text) => {
    if (!voiceEnabled) return;
    
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Stop local speech synthesis as fallback
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    try {
      const res = await fetch(`${API_BASE}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play();
      } else {
        console.error("TTS generation failed");
      }
    } catch (e) {
      console.error("Failed to fetch TTS audio", e);
    }
  }, [voiceEnabled]);

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognition.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const startTutorial = () => {
    const prompt = "Start the app tutorial in Hindi. Introduce all the app features one by one clearly.";
    sendMessage(prompt, true);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  // Health check on mount
  useEffect(() => {
    fetch(`${API_BASE}/ping`)
      .then(r => r.json())
      .then(() => setIsOnline(true))
      .catch(() => setIsOnline(false));
  }, []);

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = useCallback(async (text, shouldSpeak = false) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), time: formatTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const historyForAPI = messages.slice(-8).map(m => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text.trim(),
          history: historyForAPI,
          userContext: {
            name: officer?.name || 'Officer',
            role: officer?.zone ? 'zonal_officer' : 'officer',
          },
        }),
      });

      const data = await res.json();
      setIsOnline(true);

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: data.text || "I couldn't process that. Please try again.",
        time: formatTime(),
        route: data.route || null,
        source: data.source || null,
        responseTime: data.responseTime || null,
      };

      setMessages(prev => [...prev, botMsg]);
      
      if (shouldSpeak) {
        speakText(botMsg.text);
      }

      if (data.route) {
        setTimeout(() => {
          handleRouteNav(data.route);
        }, 2000); // Wait 2s for voice to start
      }
    } catch (err) {
      console.error('[AIAssistant] Error:', err);
      setIsOnline(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: "I'm unable to reach the server. Please check if the backend is running on port 5000.",
        time: formatTime(),
        error: true,
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, officer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input, voiceEnabled);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input, voiceEnabled);
    }
  };

  const handleChipClick = (text) => {
    sendMessage(text, voiceEnabled);
  };

  const handleRouteNav = (route) => {
    if (route) {
      navigate(route);
      setIsOpen(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowSuggestions(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
  };

  const togglePanel = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className={`jarvis-fab ${isOpen ? 'is-open' : ''}`}
        onClick={togglePanel}
        title="JARVIS AI Assistant"
        id="jarvis-fab-trigger"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="jarvis-panel" id="jarvis-chat-panel">
          {/* Header */}
          <div className="jarvis-header">
            <div className="jarvis-header-left">
              <div className="jarvis-avatar">🌾</div>
              <div className="jarvis-header-info">
                <h3>JARVIS Assistant</h3>
                <div className="jarvis-header-status">
                  <div className={`jarvis-status-dot ${isOnline ? '' : 'offline'}`} />
                  <span>{isOnline ? 'Online — Groq LPU' : 'Connecting...'}</span>
                </div>
              </div>
            </div>
            <div className="jarvis-header-actions">
              <button 
                className={`jarvis-header-btn ${isTerminalMode ? 'active' : ''}`} 
                onClick={() => setIsTerminalMode(!isTerminalMode)} 
                title="Toggle Terminal Mode"
              >
                <Terminal size={16} />
              </button>
              <button className="jarvis-header-btn" onClick={clearChat} title="Clear chat">
                <RotateCcw size={16} />
              </button>
              <button className="jarvis-header-btn" onClick={() => setIsOpen(false)} title="Minimize">
                <Minus size={16} />
              </button>
            </div>
          </div>

          {/* Messages or Terminal */}
          {isTerminalMode ? (
            <div className="jarvis-terminal-screen">
              <div className="terminal-header">MKisans OS v3.0 // Jarvis Terminal Initialized</div>
              
              {messages.map((msg) => (
                <div key={msg.id} className={`terminal-line ${msg.role}`}>
                  <span className="terminal-prompt">
                    {msg.role === 'user' ? 'farmer@mkisans:~$ ' : 'JARVIS&gt; '}
                  </span>
                  <span className="terminal-text">
                    {msg.role === 'bot' ? <TypewriterText text={msg.text} /> : msg.text}
                  </span>
                </div>
              ))}
              
              {isListening && (
                 <div className="terminal-line user">
                    <span className="terminal-prompt">farmer@mkisans:~$ </span>
                    <span className="terminal-text listening-text">{input}<span className="terminal-cursor">_</span></span>
                 </div>
              )}
              
              {!isListening && isTyping && (
                 <div className="terminal-line bot">
                    <span className="terminal-prompt">JARVIS&gt; </span>
                    <span className="terminal-text typing-anim">...</span>
                 </div>
              )}
              
              {!isListening && !isTyping && (
                 <div className="terminal-line user">
                    <span className="terminal-prompt">farmer@mkisans:~$ </span>
                    <span className="terminal-text"><span className="terminal-cursor">_</span></span>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="jarvis-messages">
              {messages.length === 0 && (
                <div className="jarvis-welcome">
                  <div className="jarvis-orb-container">
                    <div className={`jarvis-orb ${isListening ? 'listening' : ''}`} />
                  </div>
                  <h4>Welcome to JARVIS</h4>
                  <p>
                    I'm your intelligent MKisans assistant. I can guide you through the app in Hindi, or answer your farming queries.
                  </p>
                  
                  <div className="jarvis-mode-buttons">
                    <button className="jarvis-mode-btn tutorial-btn" onClick={startTutorial}>
                      <Volume2 size={20} />
                      <div>
                        <span>App Tutorial</span>
                        <small>Listen to features in Hindi</small>
                      </div>
                    </button>
                    <button className="jarvis-mode-btn query-btn" onClick={toggleListening}>
                      <Mic size={20} />
                      <div>
                        <span>Voice Queries</span>
                        <small>Ask about Mandi, Weather, etc.</small>
                      </div>
                    </button>
                    <button className="jarvis-mode-btn terminal-mode-btn" onClick={() => setIsTerminalMode(true)}>
                      <Terminal size={20} />
                      <div>
                        <span>Terminal Console</span>
                        <small>Hacker-style voice interface</small>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`jarvis-msg ${msg.role}`}>
                  <div className="jarvis-msg-avatar">
                    {msg.role === 'bot' ? '🌾' : '👤'}
                  </div>
                  <div>
                    <div className="jarvis-msg-bubble">
                      {msg.text}
                      {msg.route && (
                        <div>
                          <button
                            className="jarvis-route-btn"
                            onClick={() => handleRouteNav(msg.route)}
                          >
                            <ArrowRight size={14} />
                            Navigate there
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="jarvis-msg-time">{msg.time}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="jarvis-typing">
                  <div className="jarvis-typing-avatar">🌾</div>
                  <div className="jarvis-typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Suggestion Chips */}
          {showSuggestions && messages.length === 0 && !isTerminalMode && (
            <div className="jarvis-suggestions">
              <div className="jarvis-suggestions-label">
                <Sparkles size={10} style={{ display: 'inline', marginRight: 4 }} />
                Quick Start
              </div>
              {DEFAULT_SUGGESTIONS.map((s) => (
                <button key={s.id} className="jarvis-chip" onClick={() => handleChipClick(s.text)}>
                  <span className="chip-icon">{s.icon}</span>
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="jarvis-input-area" onSubmit={handleSubmit}>
            <button
              type="button"
              className={`jarvis-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Start Voice Input"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <div className="jarvis-input-wrapper">
              <input
                ref={inputRef}
                className="jarvis-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Ask JARVIS anything..."}
                disabled={isTyping}
                id="jarvis-chat-input"
              />
            </div>
            <button
              type="submit"
              className="jarvis-send-btn"
              disabled={!input.trim() || isTyping}
              id="jarvis-send-button"
            >
              <Send size={18} />
            </button>
          </form>

          {/* Powered By */}
          {!isTerminalMode && (
            <div className="jarvis-powered">
              <span>Powered by Groq LPU × Llama 3.3</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
