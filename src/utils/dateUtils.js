// dateUtils.js - small helper functions for dates and searching.
// Events store their date+time as ONE text value (ISO string), e.g. "2026-11-05T14:30:00.000Z".

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }); // e.g. "Thu, 5 Nov 2026"
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }); // e.g. "02:30 PM"
}

// Returns "YYYY-MM-DD" in the phone's local time (used for searching by date).
export function toDateKey(iso) {
  const d = new Date(iso);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// Search by NAME or by DATE.
// Examples that work: "birthday", "2026-11-05", "nov", "5 nov"
export function matchesSearch(event, query) {
  const q = query.trim().toLowerCase();
  if (q === '') return true; // empty search shows everything

  const nameMatch = event.name.toLowerCase().includes(q);
  const dateKeyMatch = toDateKey(event.dateTime).includes(q);
  const readableDateMatch = formatDate(event.dateTime).toLowerCase().includes(q);

  return nameMatch || dateKeyMatch || readableDateMatch;
}
