'use client';

// Simple hash function for generating consistent IDs
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Generate device fingerprint based on browser characteristics
function generateFingerprint(): string {
  if (typeof window === 'undefined') return 'server';
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('NepoWatch', 10, 10);
  const canvasFingerprint = canvas.toDataURL();
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasFingerprint.slice(-50) // Last 50 chars of canvas fingerprint
  ].join('|');
  
  return simpleHash(fingerprint).toString();
}

// Generate persistent device ID
export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server-' + Date.now();
  
  const stored = localStorage.getItem('nepowatch-device-id');
  if (stored) return stored;
  
  const deviceId = generateFingerprint() + '-' + Date.now().toString(36);
  localStorage.setItem('nepowatch-device-id', deviceId);
  return deviceId;
}

// Anonymous name generation
const adjectives = [
  'Brave', 'Silent', 'Digital', 'Free', 'Bold', 'Swift', 'Fierce', 'Noble',
  'Proud', 'Strong', 'Wise', 'Calm', 'Wild', 'Pure', 'Sharp', 'Quick'
];

const animals = [
  'Yak', 'Eagle', 'Tiger', 'Rhino', 'Leopard', 'Elephant', 'Hawk', 'Wolf',
  'Bear', 'Falcon', 'Lion', 'Deer', 'Fox', 'Crane', 'Panda', 'Raven'
];

export function getAnonymousName(deviceId: string): string {
  if (typeof window === 'undefined') return 'Anonymous User';
  
  const stored = localStorage.getItem('nepowatch-user-name');
  if (stored) return stored;
  
  const hash = simpleHash(deviceId);
  const adjective = adjectives[hash % adjectives.length];
  const animal = animals[(hash >> 4) % animals.length];
  const name = `${adjective} ${animal}`;
  
  localStorage.setItem('nepowatch-user-name', name);
  return name;
}

// Get user identity (device ID + name)
export function getUserIdentity() {
  const deviceId = getDeviceId();
  const userName = getAnonymousName(deviceId);
  
  return {
    id: deviceId,
    name: userName
  };
}