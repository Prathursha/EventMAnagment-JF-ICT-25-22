# EventPlannerApp-JF-ICT-25-22

**Name:** Prathursha
**Index No:** JF-ICT-25-22
**Module:** Mobile Application Development (K72T001M15) – University College of Jaffna
**Assessment:** Continual Assessment (30%) – Individual Self-Study Project

## App Description
Event Planner is a simple mobile app that helps a user create, organise and get reminded about events. Events are saved on the phone, so they are still there when the app is reopened.

## Features Implemented
- **Create event** – name, date, time and description with input validation (name required, 3–50 characters; description max 200; new events must be in the future)
- **View upcoming events** – sorted by date/time (soonest first); past events are shown in a separate "Past events" section
- **Edit / delete event** – update any detail; a confirmation dialog appears before deleting
- **Search** – find events by name or by date (e.g. `birthday`, `2026-11-05`, `nov`)
- **Reminders** – choose At event time / 10 min / 1 hour / 1 day before; notification permission is requested properly (Android 13+ supported)
- **Empty states** – friendly messages when there are no events or no search results
- **Local storage** – data saved with AsyncStorage

## Tools & Technologies
- React Native with Expo
- JavaScript
- `@react-native-async-storage/async-storage` – saving data
- `expo-notifications` – reminders
- `@react-native-community/datetimepicker` – date & time pickers
- Git & GitHub

## Project Structure
```
App.js                    -> root: state, saving, screen switching
src/screens/HomeScreen.js -> list + search
src/screens/EventFormScreen.js -> add / edit form + validation
src/components/EventCard.js    -> one event card
src/utils/storage.js      -> save / load
src/utils/notifications.js -> reminders + permission
src/utils/dateUtils.js    -> date formatting + search helper
```

## How to Run
1. Install [Node.js](https://nodejs.org) (LTS) and the **Expo Go** app on your phone.
2. Clone this repo and open the folder:
   ```bash
   git clone https://github.com/<your-username>/EventPlannerApp-JF-ICT-25-22.git
   cd EventPlannerApp-JF-ICT-25-22
   ```
3. Install packages:
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npx expo start
   ```
5. Scan the QR code with Expo Go (Android) or the Camera app (iOS). Phone and laptop must be on the same Wi-Fi.

## Screenshots
Add 3–5 screenshots in a `screenshots/` folder and link them here:

| Home | Add event | Search | Reminder |
|------|-----------|--------|----------|
| ![Home](screenshots/home.png) | ![Add](screenshots/add.png) | ![Search](screenshots/search.png) | ![Reminder](screenshots/reminder.png) |

## Testing
See [TESTING.md](TESTING.md).
