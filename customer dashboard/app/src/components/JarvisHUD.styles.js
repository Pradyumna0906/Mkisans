import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width, height } = Dimensions.get('window');

export const hudStyles = StyleSheet.create({
  // Master Layer
  masterContainer: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    left: 0, 
    top: 0, 
    zIndex: 99999 
  },

  // Floating Trigger
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#051008',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.indiaGreen,
    elevation: 10,
    shadowColor: COLORS.indiaGreen,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  fabInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(19,136,8,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  // Fullscreen HUD Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0,10,5,0.96)',
    zIndex: 100000,
  },
  scanline: {
    position: 'absolute',
    width: width,
    height: 2,
    backgroundColor: 'rgba(19,136,8,0.2)',
    zIndex: 1,
  },
  
  // Header & Badges
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 30, 
    marginTop: 40 
  },
  badgeRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 4, 
    borderWidth: 1, 
    backgroundColor: 'rgba(19,136,8,0.05)' 
  },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  intentBadge: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4 
  },
  intentText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1 },

  // The Kinetic Orb
  orbContainer: { alignItems: 'center', marginTop: 40 },
  orbOuterRing: { 
    width: 160, 
    height: 160, 
    borderRadius: 80, 
    borderWidth: 1, 
    borderStyle: 'dashed', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  orbMiddleRing: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowRadius: 20, 
    shadowOpacity: 0.6 
  },
  orbCore: { width: 40, height: 40, borderRadius: 20 },

  // Message UI
  msgBox: { 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderRadius: 12, 
    padding: 25, 
    borderLeftWidth: 4, 
    margin: 30 
  },
  msgText: { color: '#fff', fontSize: 18, lineHeight: 28, fontWeight: '300' },
  
  // Controls
  footer: { position: 'absolute', bottom: 50, width: width, alignItems: 'center' },
  micButton: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  micHint: { color: 'rgba(255,255,255,0.3)', marginTop: 20, fontSize: 12, letterSpacing: 1 },
});
