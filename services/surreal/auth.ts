import { User } from '../../types';
import { surreal, dbClient } from './core';

// We assume a 'user' scope is defined in SurrealDB:
// DEFINE SCOPE user SESSION 24h SIGNUP ( CREATE user SET email = $email, pass = crypto::argon2::generate($pass) ) ...

const mockAuth = (email: string, name?: string): User => {
    return { 
        id: `user:${email.replace(/[^a-zA-Z0-9]/g, '_')}`, 
        email, 
        name: name || email.split('@')[0], 
        role: 'USER' as any, 
        credits: 100, 
        token: 'mock_token_' + Date.now() 
    };
};

export const signin = async (email: string, pass: string): Promise<User> => {
  const start = Date.now();
  await surreal.isReady;

  if (!surreal.connected) {
      // Offline Fallback
      await new Promise(r => setTimeout(r, 500)); // Simulate latency
      if (email.includes('@')) {
          const user = mockAuth(email);
          localStorage.setItem('mnemosyne_user', JSON.stringify(user));
          return user;
      }
      throw new Error("Invalid email for offline mode");
  }

  try {
    const token = await dbClient.signin({
      namespace: 'mnemosyne',
      database: 'core',
      scope: 'user', // Assuming 'user' scope exists
      email,
      pass,
    });

    if (!token) throw new Error("Auth failed");

    // Fetch user details
    const [user] = await dbClient.query<User[][]>(`SELECT * FROM user WHERE email = $email`, { email });
    
    if (!user || !user[0]) throw new Error("User not found after login");

    const userData = { ...user[0], token };
    localStorage.setItem('mnemosyne_user', JSON.stringify(userData));
    surreal.logRequest('/auth/signin', 'POST', 200, Date.now() - start);
    return userData;
  } catch (err: any) {
    surreal.logRequest('/auth/signin', 'POST', 401, Date.now() - start);
    throw err;
  }
};

export const signup = async (name: string, email: string, pass: string): Promise<User> => {
  const start = Date.now();
  await surreal.isReady;

  if (!surreal.connected) {
      // Offline Fallback
      await new Promise(r => setTimeout(r, 500));
      const user = mockAuth(email, name);
      localStorage.setItem('mnemosyne_user', JSON.stringify(user));
      return user;
  }

  try {
    const token = await dbClient.signup({
      namespace: 'mnemosyne',
      database: 'core',
      scope: 'user',
      name,
      email,
      pass,
    });

    // In Surreal, signup returns token. We query to get ID.
    const [user] = await dbClient.query<User[][]>(`SELECT * FROM user WHERE email = $email`, { email });
    
    const userData = { ...user[0], token };
    localStorage.setItem('mnemosyne_user', JSON.stringify(userData));
    surreal.logRequest('/auth/signup', 'POST', 201, Date.now() - start);
    return userData;

  } catch (err) {
    surreal.logRequest('/auth/signup', 'POST', 500, Date.now() - start);
    throw err;
  }
};

export const logout = () => {
  if (surreal.connected) {
    dbClient.invalidate();
  }
  localStorage.removeItem('mnemosyne_user');
};

export const getUser = (): User | null => {
  const stored = localStorage.getItem('mnemosyne_user');
  return stored ? JSON.parse(stored) : null;
};