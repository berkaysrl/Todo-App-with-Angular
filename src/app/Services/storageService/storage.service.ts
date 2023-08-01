import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // This service will be provided at the root level, making it a singleton across the app
})
export class StorageService {
  constructor() { }
   /**
   * Retrieves a value from local storage.
   * 
   * @param key - The key to fetch the value for.
   * @returns The retrieved value from local storage, parsed from JSON. Returns null if not found.
   */
  get(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
    /**
   * Stores a key-value pair in local storage.
   * 
   * @param key - The key to store the value under.
   * @param value - The value to be stored. This will be stringified to JSON format.
   */
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  /**
   * Removes a key-value pair from local storage.
   * 
   * @param key - The key to be removed.
   */
  delete(key: string): void {
    
    localStorage.removeItem(key);
  }
}
