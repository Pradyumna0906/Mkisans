import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, Animated, 
  ActivityIndicator, StyleSheet, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import axios from 'axios';
import QuantumBlob from './QuantumBlob';

const { width, height } = Dimensions.get('window');
const API_URL = 'http://127.0.0.1:5000/api/jarvis';

export default function JarvisAssistant({ navigation, userSession }) {
  const [active, setActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("नमस्ते! मैं आपकी कैसे सहायता कर सकता हूँ?");
  const [audioEnergy, setAudioEnergy] = useState(0);
  const [micError, setMicError] = useState(null);

  // Animation Refs
  const slideAnim = useRef(new Animated.Value(200)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pre-load voices for selection
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    if (active) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, tension: 40, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 200, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true })
      ]).start();
    }
  }, [active]);


  // Handle Pulsing while listening
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt to find "Prabhat" voice (Microsoft Edge Natural Voice)
      const voices = window.speechSynthesis.getVoices();
      const prabhatVoice = voices.find(v => v.name.includes('Prabhat') || v.name.includes('Hindi') && v.name.includes('Natural'));
      
      if (prabhatVoice) {
        utterance.voice = prabhatVoice;
      } else {
        utterance.lang = 'hi-IN';
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      let frame = 0;
      const interval = setInterval(() => {
        frame++;
        setAudioEnergy(0.4 + Math.sin(frame * 0.8) * 0.3 + Math.random() * 0.3);
      }, 50);

      utterance.onend = () => {
        clearInterval(interval);
        setAudioEnergy(0);
      };

      window.speechSynthesis.speak(utterance);
    }
  };


  const handleQuery = async (input) => {
    if (!input) return;
    setLoading(true);
    try {
      const token = userSession?.token;
      const res = await axios.post(`${API_URL}/query`, { 
        query: input,
        userContext: { 
          userId: userSession?.id || 1, 
          role: userSession?.role || 'farmer',
          name: userSession?.name || 'Kisan'
        } 
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage(res.data.text);
      speak(res.data.text);
      if (res.data.route && navigation) navigation.navigate(res.data.route);
    } catch (e) {
      // Fallback mode for development
      console.warn("JARVIS-FALLBACK:", e.message);
      const fallbackMsg = "क्षमा करें, नेटवर्क धीमा है, पर मैं आपकी बात सुन रहा हूँ।";
      setMessage(fallbackMsg);
      speak(fallbackMsg);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setMicError(null);
      // "Bubbling" waveform effect
      let frame = 0;
      const interval = setInterval(() => {
        if (!isListening) {
           clearInterval(interval);
           return;
        }
        frame++;
        setAudioEnergy(0.5 + Math.sin(frame * 1.5) * 0.4);
      }, 30);
    };

    recognition.onresult = (e) => {
      setIsListening(false);
      setAudioEnergy(0);
      const transcript = e.results[0][0].transcript;
      handleQuery(transcript);
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      setAudioEnergy(0);
      console.error("Mic Error:", e.error);
      if (e.error === 'not-allowed') setMicError("Permission denied. Enable microphone.");
    };

    try {
      recognition.start();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.masterContainer} pointerEvents="box-none">
      
      {/* 1. PASSIVE SEED */}
      {!active && (
        <TouchableOpacity 
          style={styles.passiveBlobContainer} 
          onPress={() => setActive(true)}
          activeOpacity={0.8}
        >
          <View style={styles.seedWrapper}>
            <QuantumBlob audioEnergy={0.1} size={80} />
            <View style={styles.micOverlaySmall}>
               <Ionicons name="mic" size={18} color="#FFF" />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* 2. ACTIVE HUB */}
      {active && (
        <Animated.View style={[styles.activeHub, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          <TouchableOpacity 
            style={styles.closeBtn} 
            onPress={() => { setActive(false); window.speechSynthesis.cancel(); }}
          >
            <Ionicons name="close-circle" size={32} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>

          <View style={styles.bubble}>
             {loading ? (
               <ActivityIndicator color={COLORS.indiaGreen} />
             ) : (
               <Text style={styles.bubbleText}>{message}</Text>
             )}
             {micError && <Text style={styles.errorText}>{micError}</Text>}
          </View>

          <TouchableOpacity style={styles.activeCore} onPress={startListening}>
            <Animated.View style={[styles.glowRing, { transform: [{ scale: pulseAnim }] }]} />
            <QuantumBlob audioEnergy={audioEnergy} size={220} />
            <Text style={styles.coreStatus}>{isListening ? "LISTENING..." : "TAP TO SPEAK"}</Text>
          </TouchableOpacity>

        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { position: 'absolute', bottom: 0, right: 0, left: 0, top: 0, zIndex: 99999 },
  passiveBlobContainer: { position: 'absolute', bottom: 30, right: 20, width: 90, height: 90, justifyContent: 'center', alignItems: 'center' },
  seedWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(5, 16, 8, 0.4)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(19, 136, 8, 0.3)' },
  micOverlaySmall: { position: 'absolute', bottom: 8, right: 8, backgroundColor: COLORS.indiaGreen, padding: 8, borderRadius: 15, borderWidth: 1, borderColor: '#FFF', elevation: 4 },
  activeHub: { position: 'absolute', bottom: 30, right: 20, alignItems: 'flex-end', width: 340 },
  bubble: { backgroundColor: 'rgba(5, 16, 8, 0.95)', padding: 20, borderRadius: 24, borderBottomRightRadius: 4, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(19, 136, 8, 0.3)', width: '100%' },
  bubbleText: { color: '#FFF', fontSize: 16, lineHeight: 22, fontWeight: '500', textAlign: 'right' },
  errorText: { color: '#ff4444', fontSize: 12, marginTop: 10, textAlign: 'right' },
  activeCore: { width: 220, height: 220, backgroundColor: 'rgba(5, 10, 5, 0.8)', borderRadius: 110, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  glowRing: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(19, 136, 8, 0.2)', borderWidth: 2, borderColor: COLORS.indiaGreen },
  coreStatus: { position: 'absolute', bottom: 25, color: COLORS.indiaGreen, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  closeBtn: { marginBottom: 10, marginRight: 10 }
});
