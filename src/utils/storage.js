// storage.js - save and load events on the phone using AsyncStorage.
// AsyncStorage only stores text, so we convert the list to JSON text.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'EVENTS_V1';

export async function loadEvents() {
  try {
    const text = await AsyncStorage.getItem(STORAGE_KEY);
    return text ? JSON.parse(text) : []; // nothing saved yet -> empty list
  } catch (error) {
    console.log('Could not load events:', error);
    return []; // never crash the app
  }
}

export async function saveEvents(events) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.log('Could not save events:', error);
  }
}
