import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import EventFormScreen from './src/screens/EventFormScreen';
import { loadEvents, saveEvents } from './src/utils/storage';
import { scheduleReminder, cancelReminder } from './src/utils/notifications';

export default function App() {
  const [events, setEvents] = useState([]);        
  const [loading, setLoading] = useState(true);      
  const [screen, setScreen] = useState('home');     
  const [editingEvent, setEditingEvent] = useState(null); 


  useEffect(() => {
    async function init() {
      const saved = await loadEvents();
      setEvents(saved);
      setLoading(false);
    }
    init();
  }, []);

  
  useEffect(() => {
    if (!loading) {
      saveEvents(events);
    }
  }, [events, loading]);

 
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'form') {
        closeForm();
        return true; 
      }
      return false; 
    });
    return () => subscription.remove();
  }, [screen]);

  function openCreateForm() {
    setEditingEvent(null);
    setScreen('form');
  }

  function openEditForm(event) {
    setEditingEvent(event);
    setScreen('form');
  }

  function closeForm() {
    setEditingEvent(null);
    setScreen('home');
  }

 
  async function handleSave(data) {
    let event;

    if (editingEvent) {
      
      await cancelReminder(editingEvent.notificationId);
      event = { ...editingEvent, ...data };
    } else {
     
      event = { id: Date.now().toString(), ...data };
    }

       event.notificationId = await scheduleReminder(event);

    if (editingEvent) {
      setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    } else {
      setEvents((prev) => [...prev, event]);
    }
    closeForm();
  }

 
  async function handleDelete(event) {
    await cancelReminder(event.notificationId);
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      {screen === 'home' ? (
        <HomeScreen
          events={events}
          onAdd={openCreateForm}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      ) : (
        <EventFormScreen
          initialEvent={editingEvent}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: StatusBar.currentHeight || 0, // Android status bar space
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
