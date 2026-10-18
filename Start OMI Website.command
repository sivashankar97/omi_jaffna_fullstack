#!/bin/zsh
set -e
export PATH="/opt/homebrew/opt/node@22/bin:/opt/homebrew/opt/postgresql@16/bin:/opt/homebrew/bin:$PATH"
cd /Users/anu/Projects/omi-jaffna-cms
brew services start postgresql@16
mkdir -p .local/logs
for service in api web; do
  launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/local.omi-jaffna.$service.plist" 2>/dev/null || true
  launchctl kickstart "gui/$(id -u)/local.omi-jaffna.$service"
done
for attempt in {1..30}; do
  if curl -fsS http://localhost:5173/api/health >/dev/null 2>&1; then
    open http://localhost:5173/
    echo "Website ready. Login details: /Users/anu/Projects/omi-jaffna-cms/LOCAL-LOGIN.txt"
    exit 0
  fi
  sleep 1
done
echo "Startup failed. See .local/logs in the project folder."
exit 1
