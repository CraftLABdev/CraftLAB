#!/bin/bash
set -e

echo "=== CraftLAB Bot Deploy ==="

# 1. Update & install deps
apt-get update -qq
apt-get install -y python3 python3-pip python3-venv git

# 2. Clone / pull repo
BOT_DIR="/root/craftlab-bot"
if [ -d "$BOT_DIR/.git" ]; then
  echo "Pulling latest..."
  cd "$BOT_DIR" && git pull
else
  echo "Cloning repo..."
  git clone https://github.com/CraftLABdev/CraftLAB.git "$BOT_DIR"
fi

cd "$BOT_DIR/bot"

# 3. Virtualenv
python3 -m venv venv
source venv/bin/activate
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

# 4. .env setup (skip if already exists)
if [ ! -f .env ]; then
  echo "Creating .env..."
  cat > .env <<EOF
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
DEEPINFRA_API_KEY=YOUR_DEEPINFRA_KEY
RPC_URL=https://api.mainnet-beta.solana.com
DB_PATH=/root/craftlab-bot/bot/data/craftlab.db
EOF
  echo ""
  echo ">>> EDIT .env sebelum lanjut:"
  echo "    nano $BOT_DIR/bot/.env"
  echo ""
fi

# 5. Create data dir
mkdir -p /root/craftlab-bot/bot/data

# 6. systemd service
cat > /etc/systemd/system/craftlab-bot.service <<EOF
[Unit]
Description=CraftLAB Telegram Bot
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/craftlab-bot/bot
ExecStart=/root/craftlab-bot/bot/venv/bin/python bot.py
Restart=always
RestartSec=5
EnvironmentFile=/root/craftlab-bot/bot/.env

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable craftlab-bot

echo ""
echo "=== Done ==="
echo "1. Edit .env:  nano /root/craftlab-bot/bot/.env"
echo "2. Start bot:  systemctl start craftlab-bot"
echo "3. Check logs: journalctl -u craftlab-bot -f"
