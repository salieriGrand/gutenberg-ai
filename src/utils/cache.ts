import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'books_default.json');
const CACHE_TTL = 3600 * 1000; // 1 hour

export async function getCachedBooks() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    if (fs.existsSync(CACHE_FILE)) {
      const stats = fs.statSync(CACHE_FILE);
      const isExpired = Date.now() - stats.mtimeMs > CACHE_TTL;

      if (!isExpired) {
        const data = fs.readFileSync(CACHE_FILE, 'utf-8');
        return JSON.parse(data);
      }
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }
  return null;
}

export async function setCachedBooks(data: any) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data), 'utf-8');
  } catch (error) {
    console.error('Cache write error:', error);
  }
}
