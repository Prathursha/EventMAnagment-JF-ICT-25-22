// EventFormScreen.js - used for BOTH creating and editing an event.
// If initialEvent is null -> "Add event". Otherwise -> "Edit event".

import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate, formatTime } from '../utils/dateUtils';
import { REMINDER_OPTIONS } from '../utils/notifications';

// Default time for a new event = one hour from now (seconds set to 0)
function defaultDateTime() {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  d.setSeconds(0, 0);
  return d;
}

export default function EventFormScreen({ initialEvent, onSave, onCancel }) {
  const isEditing = initialEvent !== null;

  // Form values (start with the existing event's values when editing)
  const [name, setName] = useState(isEditing ? initialEvent.name : '');
  const [description, setDescription] = useState(isEditing ? initialEvent.description : '');
  const [dateTime, setDateTime] = useState(
    isEditing ? new Date(initialEvent.dateTime) : defaultDateTime()
  );
  const [reminderMinutes, setReminderMinutes] = useState(
    isEditing ? initialEvent.reminderMinutes ?? null : null
  );

  const [pickerMode, setPickerMode] = useState(null); // null, 'date' or 'time'
  const [errors, setErrors] = useState({});

  // Called when the user picks a date or time in the popup
  function onPickerChange(event, selected) {
    if (Platform.OS === 'android') setPickerMode(null); // Android popup closes itself
    if (event.type === 'dismissed' || !selected) return;

    const updated = new Date(dateTime);
    if (pickerMode === 'date') {
      updated.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    } else {
      updated.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    }
    setDateTime(updated);
  }

  // Check all the inputs. Returns true if everything is OK.
  function validate() {
    const newErrors = {};
    const cleanName = name.trim();

    if (cleanName === '') {
      newErrors.name = 'Event name is required.';
    } else if (cleanName.length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    } else if (cleanName.length > 50) {
      newErrors.name = 'Name must be 50 characters or less.';
    }

    // Description is optional, but it cannot be too long.
    if (description.trim().length > 200) {
      newErrors.description = 'Description must be 200 characters or less.';
    }

    // A NEW event must be in the future.
    if (!isEditing && dateTime.getTime() <= Date.now()) {
      newErrors.dateTime = 'Please pick a date and time in the future.';
    }

    // The reminder time must not already be over.
    if (reminderMinutes !== null) {
      const reminderTime = dateTime.getTime() - reminderMinutes * 60 * 1000;
      if (reminderTime <= Date.now()) {
        newErrors.reminder = 'That reminder time has already passed. Choose a later event time or a shorter reminder.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return; // stop if there are errors
    onSave({
      name: name.trim(),
      description: description.trim(),
      dateTime: dateTime.toISOString(),
      reminderMinutes: reminderMinutes,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{isEditing ? 'Edit event' : 'Add event'}</Text>

      {/* Name */}
      <Text style={styles.label}>Event name *</Text>
      <TextInput
        style={[styles.input, errors.name && styles.inputError]}
        placeholder="e.g. Friend's birthday"
        value={name}
        onChangeText={setName}
        maxLength={60}
      />
      {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

      {/* Date */}
      <Text style={styles.label}>Date *</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setPickerMode('date')}>
        <Text style={styles.pickerText}>🗓 {formatDate(dateTime.toISOString())}</Text>
      </TouchableOpacity>

      {/* Time */}
      <Text style={styles.label}>Time *</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setPickerMode('time')}>
        <Text style={styles.pickerText}>⏰ {formatTime(dateTime.toISOString())}</Text>
      </TouchableOpacity>
      {errors.dateTime ? <Text style={styles.error}>{errors.dateTime}</Text> : null}

      {/* The date/time popup */}
      {pickerMode !== null && (
        <View>
          <DateTimePicker
            value={dateTime}
            mode={pickerMode}
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onPickerChange}
          />
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.doneButton} onPress={() => setPickerMode(null)}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline, errors.description && styles.inputError]}
        placeholder="Optional details..."
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={220}
      />
      {errors.description ? <Text style={styles.error}>{errors.description}</Text> : null}

      {/* Reminder */}
      <Text style={styles.label}>Reminder</Text>
      <View style={styles.chipRow}>
        {REMINDER_OPTIONS.map((option) => {
          const selected = option.value === reminderMinutes;
          return (
            <TouchableOpacity
              key={option.label}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => setReminderMinutes(option.value)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {errors.reminder ? <Text style={styles.error}>{errors.reminder}</Text> : null}

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.saveText}>{isEditing ? 'Update' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginTop: 16, marginBottom: 6 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: { borderColor: '#DC2626' },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  error: { color: '#DC2626', fontSize: 13, marginTop: 4 },
  pickerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  pickerText: { fontSize: 16, color: '#111827' },
  doneButton: { alignSelf: 'flex-end', padding: 8 },
  doneText: { color: '#4F46E5', fontWeight: '700', fontSize: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: '#4F46E5' },
  chipText: { color: '#374151' },
  chipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  buttonRow: { flexDirection: 'row', marginTop: 28 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  cancelButton: { backgroundColor: '#E5E7EB', marginRight: 10 },
  saveButton: { backgroundColor: '#4F46E5' },
  cancelText: { color: '#374151', fontWeight: '600', fontSize: 16 },
  saveText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
});
