import { sealData, unsealData } from 'iron-session';

// Get the session password from environment variables
const sessionPassword = process.env.SESSION_PASSWORD;

// Validate that the password is set
if (!sessionPassword) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_PASSWORD environment variable is required in production');
  } else {
    console.warn('SESSION_PASSWORD not set. Using a default value for development only.');
  }
}

// Use a default for development only (never in production)
const effectivePassword = sessionPassword || 'dev-only-unsafe-default-password';

export async function createSession(data) {
  return await sealData(data, { 
    password: effectivePassword,
    ttl: 60 * 60 // 1 hour expiration
  });
}

export async function getSessionData(sealedData) {
  return await unsealData(sealedData, { password: effectivePassword });
}