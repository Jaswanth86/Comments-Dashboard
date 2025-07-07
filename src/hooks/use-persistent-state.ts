"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function usePersistentState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => defaultValue);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        setState(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      setState(defaultValue);
    }
  }, [key, defaultValue]);

  useEffect(() => {
    // Avoid setting the default value on initial load if a stored value was just loaded.
    // This prevents overwriting the loaded state with the default state.
    if (state !== defaultValue) {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error writing to localStorage for key "${key}":`, error);
        }
    } else {
        // If state is the default value, check if there's something in storage.
        // If not, then set it. This handles the case where the user resets to default.
        const storedValue = localStorage.getItem(key);
        if(storedValue !== JSON.stringify(defaultValue)) {
             try {
                localStorage.setItem(key, JSON.stringify(state));
            } catch (error) {
                console.error(`Error writing to localStorage for key "${key}":`, error);
            }
        }
    }
  }, [key, state, defaultValue]);

  return [state, setState];
}

export { usePersistentState };
