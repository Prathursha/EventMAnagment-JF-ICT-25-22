# Testing Documentation

**Tested on:** <device / emulator + Android version>   **Date:** <date>

| # | Feature | Test steps | Expected result | Actual result | Pass? |
|---|---------|-----------|-----------------|---------------|-------|
| 1 | Create | Add event "Team meeting", future date/time, description | Event appears in Upcoming list | | |
| 2 | Validation | Leave name empty and tap Save | Error "Event name is required." | | |
| 3 | Validation | Name with 2 letters | Error about minimum 3 characters | | |
| 4 | Validation | Pick a past time for a new event | Error "Please pick a date and time in the future." | | |
| 5 | Sorting | Add 3 events at different times | Soonest event is on top | | |
| 6 | Past events | Add an event, wait until its time passes, reopen app | Event moves to "Past events" | | |
| 7 | Edit | Tap Edit, change name and time, Update | Card shows new details | | |
| 8 | Delete | Tap Delete | Confirmation dialog appears | | |
| 9 | Delete | Confirm Delete | Event removed from list | | |
| 10 | Delete | Tap Cancel in dialog | Event stays | | |
| 11 | Search name | Type part of an event name | Only matching events shown | | |
| 12 | Search date | Type `2026-11-05` (an event's date) | Only events on that date shown | | |
| 13 | Search none | Type `zzzz` | "No events match" message | | |
| 14 | Empty state | Delete all events | "No events yet" message | | |
| 15 | Reminder permission | First time choosing a reminder and saving | Permission popup appears | | |
| 16 | Reminder | Event 2 minutes ahead, reminder "At event time" | Notification appears at event time | | |
| 17 | Reminder cancel | Delete an event with a reminder | No notification arrives | | |
| 18 | Persistence | Close app fully and reopen | Events still there | | |
