import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../shared/models/auth-user.model';

const DB_NAME = 'holnex';
const DB_VERSION = 1;
const STORE_NAME = 'user';

/**
 * Lightweight IndexedDB service for caching user profile data.
 *
 * - API is always the source of truth.
 * - IndexedDB is used exclusively as a read-through cache
 *   to improve startup performance (instant UI render).
 * - No tokens are ever stored here.
 */
@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  private isBrowser: boolean;
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Open (or create) the IndexedDB database.
   */
  private openDb(): Promise<IDBDatabase> {
    if (!this.isBrowser) {
      return Promise.reject(new Error('Not in browser'));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    return this.dbPromise;
  }

  /**
   * Get the cached user by ID from IndexedDB.
   * Returns `null` if not found.
   */
  async getUser(id: string): Promise<User | null> {
    try {
      const db = await this.openDb();
      return new Promise<User | null>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(id);
        request.onsuccess = () => resolve((request.result as User) ?? null);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return null;
    }
  }

  /**
   * Save or update the user in IndexedDB.
   */
  async saveUser(user: User): Promise<void> {
    try {
      const db = await this.openDb();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(user);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      // Silently fail — cache miss is not critical
    }
  }

  /**
   * Remove the user from IndexedDB.
   */
  async removeUser(id: string): Promise<void> {
    try {
      const db = await this.openDb();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      // Silently fail
    }
  }

  /**
   * Remove all data from the user store.
   */
  async clear(): Promise<void> {
    try {
      const db = await this.openDb();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      // Silently fail
    }
  }
}