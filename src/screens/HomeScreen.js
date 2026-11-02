// HomeScreen.js - shows the search box and the list of events.
// Events are split into "Upcoming" (sorted soonest first) and "Past".

import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import EventCard from '../components/EventCard';
import { matchesSearch } from '../utils/dateUtils';

export default function HomeScreen({ events, onAdd, onEdit, onDelete }) {
  const [query, setQuery] = useState('');

  const now = new Date();

  // Apply the search first
  const filtered = events.filter((e) => matchesSearch(e, query));

  // Upcoming: soonest first
  const upcoming = filtered
    .filter((e) => new Date(e.dateTime) >= now)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  // Past: most recent first
  const past = filtered
    .filter((e) => new Date(e.dateTime) < now)
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  // Ask "Are you sure?" before deleting
  function confirmDelete(event) {
    Alert.alert('Delete event', `Are you sure you want to delete "${event.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(event) },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Event Planner</Text>

      <TextInput
        style={styles.search}
        placeholder="Search by name or date (e.g. 2026-11-05)"
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
      />

      <ScrollView contentContainerStyle={styles.list}>
        {/* Empty state 1: no events at all */}
        {events.length === 0 && (
          <Text style={styles.empty}>
            No events yet.{'\n'}Tap the + button to add your first event!
          </Text>
        )}

        {/* Empty state 2: events exist but search found nothing */}
        {events.length > 0 && filtered.length === 0 && (
          <Text style={styles.empty}>No events match "{query}".</Text>
        )}

        {filtered.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Upcoming events</Text>
            {upcoming.length === 0 ? (
              <Text style={styles.emptySmall}>No upcoming events.</Text>
            ) : (
              upcoming.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  isPast={false}
                  onEdit={() => onEdit(e)}
                  onDelete={() => confirmDelete(e)}
                />
              ))
            )}

            {past.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Past events</Text>
                {past.map((e) => (
                  <EventCard
                    key={e.id}
                    event={e}
                    isPast={true}
                    onEdit={() => onEdit(e)}
                    onDelete={() => confirmDelete(e)}
                  />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating "+" button */}
      <TouchableOpacity style={styles.fab} onPress={onAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111827', marginTop: 12, marginBottom: 10 },
  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  list: { paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 10, marginBottom: 8 },
  empty: { textAlign: 'center', color: '#6B7280', fontSize: 16, marginTop: 60, lineHeight: 24 },
  emptySmall: { color: '#6B7280', marginBottom: 10 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabText: { color: '#FFFFFF', fontSize: 32, marginTop: -2 },
});
