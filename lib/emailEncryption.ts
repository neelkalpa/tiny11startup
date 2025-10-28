import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

export function encryptEmail(email: string): string {
  const key = process.env.ENCRYPT_EMAIL_KEY;
  if (!key) {
    throw new Error('ENCRYPT_EMAIL_KEY not found');
  }

  // Generate random 10 character alphanumeric strings
  const leftPadding = generateRandomString(10);
  const rightPadding = generateRandomString(10);
  
  // Combine: leftPadding + email + rightPadding
  const paddedEmail = leftPadding + email + rightPadding;
  
  // Create cipher with proper key handling
  const keyBuffer = crypto.scryptSync(key, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  
  // Encrypt the padded email
  let encrypted = cipher.update(paddedEmail, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Prepend IV to encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptEmail(encryptedId: string): string {
  const key = process.env.ENCRYPT_EMAIL_KEY;
  if (!key) {
    throw new Error('ENCRYPT_EMAIL_KEY not found');
  }

  try {
    // Split IV and encrypted data
    const parts = encryptedId.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = parts[1];
    
    // Create decipher with proper key handling
    const keyBuffer = crypto.scryptSync(key, 'salt', 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
    
    // Decrypt the encrypted string
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Remove padding (first 10 and last 10 characters)
    const email = decrypted.slice(10, -10);
    
    return email;
  } catch {
    throw new Error('Failed to decrypt email');
  }
}

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
