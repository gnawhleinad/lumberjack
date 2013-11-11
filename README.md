lumberjack is an irc logger bot.

## Features

- Logs irc events to the database
- Messages the missed events from channel(s) to the user
- Web interface for the logs
  - View archive
  - Filter log events (topic, join, part, quit, kick, kill, message, notice, mode)

## Upcoming Features

- Web interface
  - Query logs
- Custom settings for users
  - Filter log events on replay (topic, join, part, quit, kick, kill, message, notice, mode)
  - Prepend (once) messages from a channel with topic and list of users
  - Timestamp on messages
  - Timezone
- Commands for bot
  - Log an additional channel (permanently or temporarily)
  - Query logs

## Contributing
   git clone git@github.com:gnawhleinad/lumberjack.git
   vagrant up

### Prerequisites
- [Vagrant](http://vagrantup.com/) 
- [VirtualBox](https://www.virtualbox.org/)

### Environment
- Ubuntu 12.04.3 (AMD64)
- irc-hybrid
- mongodb
- nodejs
- irssi
- git
