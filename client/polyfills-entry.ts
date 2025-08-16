// This file must be imported first to set up Node.js polyfills
import { Buffer } from 'buffer';

// Set Buffer globally for all crypto/ethereum dependencies
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = globalThis;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  if (typeof (globalThis as any).global === 'undefined') {
    (globalThis as any).global = globalThis;
  }
}

// Export Buffer for explicit imports
export { Buffer };
