/**
 * Base64 encode/decode engine  -  all client-side, zero dependencies.
 * Handles UTF-8 safely (unlike btoa/atob which are ASCII-only).
 */

export type Base64Variant = 'standard' | 'base64url';

export interface EncodeResult {
  output: string;
  originalSize: number;
  encodedSize: number;
  variant: Base64Variant;
}

export interface DecodeResult {
  output: string;
  originalSize: number;
  decodedSize: number;
  variant: Base64Variant | null;
  isValid: boolean;
  errorPosition?: number;
}

export interface FileResult {
  output: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isDataURI: boolean;
}

/**
 * UTF-8 safe Base64 encode.
 */
export function encode(input: string, variant: Base64Variant = 'standard'): EncodeResult {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  const binary = Array.from(bytes)
    .map((b) => String.fromCharCode(b))
    .join('');
  let output = btoa(binary);

  if (variant === 'base64url') {
    output = output.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  return {
    output,
    originalSize: bytes.length,
    encodedSize: output.length,
    variant,
  };
}

/**
 * UTF-8 safe Base64 decode.
 */
export function decode(input: string, variant: Base64Variant | null = null): DecodeResult {
  const cleaned = input.replace(/\s/g, '');

  // Auto-detect variant
  const detectedVariant = variant ?? detectVariant(cleaned);

  // Convert Base64URL to standard for decoding
  let standardInput = cleaned;
  if (detectedVariant === 'base64url') {
    standardInput = cleaned.replace(/-/g, '+').replace(/_/g, '/');
    // Restore padding
    const pad = standardInput.length % 4;
    if (pad === 3) standardInput += '=';
    else if (pad === 2) standardInput += '==';
  }

  // Validate
  const validation = validate(standardInput);
  if (!validation.isValid) {
    return {
      output: '',
      originalSize: cleaned.length,
      decodedSize: 0,
      variant: detectedVariant,
      isValid: false,
      errorPosition: validation.errorPosition,
    };
  }

  try {
    const binary = atob(standardInput);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const output = decoder.decode(bytes);

    return {
      output,
      originalSize: cleaned.length,
      decodedSize: bytes.length,
      variant: detectedVariant,
      isValid: true,
    };
  } catch {
    return {
      output: '',
      originalSize: cleaned.length,
      decodedSize: 0,
      variant: detectedVariant,
      isValid: false,
    };
  }
}

/**
 * Detect whether input is Base64, Base64URL, or plain text.
 */
export function detectVariant(input: string): Base64Variant | null {
  const cleaned = input.replace(/\s/g, '');
  if (!cleaned) return null;

  // Base64URL uses - and _ instead of + and /
  if (cleaned.includes('-') || cleaned.includes('_')) {
    return 'base64url';
  }

  return 'standard';
}

/**
 * Check if a string looks like valid Base64.
 */
export function looksLikeBase64(input: string): boolean {
  const cleaned = input.replace(/\s/g, '');
  if (!cleaned) return false;
  // Base64 character set
  const base64Re = /^[A-Za-z0-9+/=_-]+$/;
  // Must match Base64 charset and have reasonable length (multiple of 4 with padding)
  if (!base64Re.test(cleaned)) return false;
  // Heuristic: if it contains + or / or ends with = in a Base64 pattern, likely Base64
  if (/[+/]/.test(cleaned) || /={1,2}$/.test(cleaned)) return true;
  // Otherwise, check if it's mostly Base64-like (long, no spaces, proper length)
  return cleaned.length > 10 && cleaned.length % 4 === 0;
}

/**
 * Validate Base64 string, returning position of first error if invalid.
 */
export function validate(input: string): { isValid: boolean; errorPosition?: number } {
  const cleaned = input.replace(/\s/g, '');
  if (!cleaned) return { isValid: true }; // empty is valid

  const base64Re = /^[A-Za-z0-9+/=]+$/;
  if (!base64Re.test(cleaned)) {
    // Find the first invalid character
    for (let i = 0; i < cleaned.length; i++) {
      if (!/[A-Za-z0-9+/=]/.test(cleaned[i])) {
        return { isValid: false, errorPosition: i };
      }
    }
  }

  // Check length (must be multiple of 4)
  if (cleaned.length % 4 !== 0) {
    return { isValid: false, errorPosition: cleaned.length - (cleaned.length % 4) };
  }

  // Check padding only at end
  const paddingStart = cleaned.indexOf('=');
  if (paddingStart !== -1) {
    const afterPadding = cleaned.substring(paddingStart);
    if (!/^=+$/.test(afterPadding)) {
      return { isValid: false, errorPosition: paddingStart };
    }
    if (afterPadding.length > 2) {
      return { isValid: false, errorPosition: paddingStart };
    }
  }

  return { isValid: true };
}

/**
 * Read a file and return as Base64 data URI (for images) or plain Base64.
 */
export function fileToBase64(file: File): Promise<FileResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataURI = reader.result as string;
      // Extract pure Base64 from data URI
      const base64Match = dataURI.match(/^data:([^;]+);base64,(.+)$/);
      const output = base64Match ? base64Match[2] : dataURI;

      resolve({
        output,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        isDataURI: true,
      });
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    // For text files, read as text and encode; for others, read as data URI
    if (file.type.startsWith('text/') || file.type === 'application/json') {
      reader.readAsText(file);
      // Override  -  for text files we read as text then encode
      const textReader = new FileReader();
      textReader.onload = () => {
        const encoded = encode(textReader.result as string);
        resolve({
          output: encoded.output,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'text/plain',
          isDataURI: false,
        });
      };
      textReader.onerror = () => reject(new Error('Failed to read file'));
      textReader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  });
}

/**
 * Download a string as a file.
 */
export function downloadAsFile(content: string, fileName: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format byte size for display.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
