/**
 * Cryptographic operations based on Web Crypto API (crypto.subtle)
 * Supporting RSA-2048, SHA-256, X.509 structure, and PAdES signature simulation
 */

// Helper to convert ArrayBuffer to Hex string
export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// Helper to convert Hex string to Uint8Array
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Convert ArrayBuffer to base64
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Format Public Key as PEM
export function spkiToPem(spkiBuffer: ArrayBuffer): string {
  const base64 = bufferToBase64(spkiBuffer);
  const formatted = base64.match(/.{1,64}/g)?.join('\n') || base64;
  return `-----BEGIN PUBLIC KEY-----\n${formatted}\n-----END PUBLIC KEY-----`;
}

// Calculate SHA-256 of text or binary
export async function calculateSha256(data: string | ArrayBuffer | Uint8Array): Promise<string> {
  let buffer: ArrayBuffer;
  if (typeof data === 'string') {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    buffer = encoded.buffer as ArrayBuffer;
  } else if (data instanceof Uint8Array) {
    buffer = data.buffer as ArrayBuffer;
  } else {
    buffer = data;
  }

  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
  return bufferToHex(hashBuffer);
}

// Generate RSA-2048 KeyPair
export async function generateRsaKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: { name: 'SHA-256' },
    },
    true, // extractable
    ['sign', 'verify']
  );
}

// Export Public Key to PEM
export async function exportPublicKeyPem(key: CryptoKey): Promise<string> {
  const spki = await window.crypto.subtle.exportKey('spki', key);
  return spkiToPem(spki);
}

// Sign data using RSA Private Key
export async function signDataWithRsa(privateKey: CryptoKey, data: Uint8Array | string): Promise<string> {
  let buffer: ArrayBuffer;
  if (typeof data === 'string') {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    buffer = encoded.buffer as ArrayBuffer;
  } else {
    buffer = data.buffer as ArrayBuffer;
  }

  const signature = await window.crypto.subtle.sign(
    {
      name: 'RSASSA-PKCS1-v1_5',
    },
    privateKey,
    buffer
  );

  return bufferToHex(signature);
}

// Verify RSA signature with Public Key
export async function verifyRsaSignature(
  publicKey: CryptoKey,
  signatureHex: string,
  data: Uint8Array | string
): Promise<boolean> {
  try {
    let buffer: ArrayBuffer;
    if (typeof data === 'string') {
      const encoder = new TextEncoder();
      const encoded = encoder.encode(data);
      buffer = encoded.buffer as ArrayBuffer;
    } else {
      buffer = data.buffer as ArrayBuffer;
    }

    const signatureBytes = hexToBytes(signatureHex);
    return await window.crypto.subtle.verify(
      {
        name: 'RSASSA-PKCS1-v1_5',
      },
      publicKey,
      signatureBytes.buffer as ArrayBuffer,
      buffer
    );
  } catch (err) {
    console.error('Signature verification failed:', err);
    return false;
  }
}

// Import public key from PEM
export async function importPublicKeyFromPem(pem: string): Promise<CryptoKey> {
  const cleanPem = pem
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s+/g, '');
  const binaryString = window.atob(cleanPem);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return await window.crypto.subtle.importKey(
    'spki',
    bytes.buffer as ArrayBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    true,
    ['verify']
  );
}

// Generate serial number for X.509
export function generateCertificateSerial(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(':');
}
