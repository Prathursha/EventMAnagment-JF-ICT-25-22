// notifications.js - everything about reminders (local notifications).
// Uses the expo-notifications library.

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Choices shown in the form. value = minutes before the event (null = no reminder).
export const REMINDER_OPTIONS = [
  { label: 'No reminder', value: null },
  { label: 'At event time', value: 0 },
  { label: '10 min before', value: 10 },
  { label: '1 hour before', value: 60 },
  { label: '1 day before', value: 1440 },
];

export function reminderLabel(value) {
  const found = REMINDER_OPTIONS.find((o) => o.value === value);
  return found ? found.label : 'No reminder';
}

// Show the notification even if the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Ask the user for permission (needed on Android 13+ and iOS).
// Returns true if allowed.
export async function requestNotificationPermission() {
  try {
    // Android needs a "channel". It must exist BEFORE asking permission on Android 13+.
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('events', {
        name: 'Event reminders',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    const current = await Notifications.getPermissionsAsync();
    if (current.status === 'granted') return true;

    const asked = await Notifications.requestPermissionsAsync();
    return asked.status === 'granted';
  } catch (error) {
    console.log('Permission error:', error);
    return false;
  }
}

// Schedule a reminder for an event. Returns the notification id (or null).
export async function scheduleReminder(event) {
  try {
    if (event.reminderMinutes === null || event.reminderMinutes === undefined) {
      return null; // user chose "No reminder"
    }

    const eventTime = new Date(event.dateTime).getTime();
    const triggerTime = new Date(eventTime - event.reminderMinutes * 60 * 1000);
    if (triggerTime.getTime() <= Date.now()) {
      return null; // that time is already in the past
    }

    const allowed = await requestNotificationPermission();
    if (!allowed) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📅 ' + event.name,
        body: event.description ? event.description : 'Your event is coming up!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerTime,
        channelId: 'events',
      },
    });
    return id;
  } catch (error) {
    console.log('Could not schedule reminder:', error);
    return null;
  }
}

// Cancel a reminder (used when editing or deleting an event).
export async function cancelReminder(notificationId) {
  try {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  } catch (error) {
    console.log('Could not cancel reminder:', error);
  }
}
