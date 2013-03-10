lumberjack is an irc logger bot.

## Features

- Logs irc events to the database
- Messages the missed events from channel(s) to the user

## Upcoming Features

- Web interface for the logs
- Custom settings for users
  - Toggle on/off log events on replay (topic, join, part, quit, kick, kill, message, notice, mode)
  - Prepend (once) messages from a channel with topic and list of users
  - Timestamp on messages
  - Timezone
- Commands for bot
  - Log an additional channel (permanently or temporarily)
  - Query logs

## Testing Environment

- debian-6.0.6
- mongodb-2.2.2
- ircd-hybrid 7.2.2

