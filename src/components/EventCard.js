// EventCard.js - one event shown as a card in the list.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatDate, formatTime } from '../utils/dateUtils';
import { reminderLabel } from '../utils/notifications';

export default function EventCard({ event, isPast, onEdit, onDelete }) {
  return (
    <View style={[styles.card, isPast && styles.pastCard]}>
      <Text style={styles.name}>{event.name}</Text>
      <Text style={styles.dateTime}>
        🗓 {formatDate(event.dateTime)}   ⏰ {formatTime(event.dateTime)}
      </Text>

      {event.description ? (
        <Text style={styles.description}>{event.description}</Text>
      ) : null}

      {event.reminderMinutes !== null && event.reminderMinutes !== undefined ? (
        <Text style={styles.reminder}>🔔 {reminderLabel(event.reminderMinutes)}</Text>
      ) : null}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={onEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#4F46E5',
    elevation: 2,
  },
  pastCard: { opacity: 0.6, borderLeftColor: '#9CA3AF' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  dateTime: { fontSize: 14, color: '#4B5563', marginTop: 4 },
  description: { fontSize: 14, color: '#374151', marginTop: 6 },
  reminder: { fontSize: 13, color: '#4F46E5', marginTop: 6 },
  buttonRow: { flexDirection: 'row', marginTop: 10 },
  button: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8, marginRight: 10 },
  editButton: { backgroundColor: '#4F46E5' },
  deleteButton: { backgroundColor: '#DC2626' },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
});
