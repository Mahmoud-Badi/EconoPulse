#!/bin/bash
# ============================================================
# GSD Account Setup — One-Time Multi-Account Configuration
# ============================================================
# Authenticates up to 3 Claude Max accounts for autopilot rotation.
# Each account gets its own config directory (~/.claude-acctN).
# Run this once, then gsd-autopilot.sh handles rotation automatically.
# ============================================================

echo "============================================"
echo "  GSD AUTOPILOT — Account Setup"
echo "============================================"
echo ""
echo "This will log you into up to 3 Claude Max accounts."
echo "Each one opens a browser — log in and authorize."
echo ""
echo "After setup, the autopilot rotates between them"
echo "automatically when one hits the usage limit."
echo ""
echo "You can set up 1, 2, or 3 accounts."
echo "Press Ctrl+C to stop at any point."
echo "============================================"
echo ""

setup_account() {
  local num=$1
  local dir="$HOME/.claude-acct${num}"

  echo "[Account $num of 3]"
  if [ -d "$dir" ]; then
    echo "  Profile already exists at $dir"
    read -p "  Re-authenticate? (y/n): " answer
    if [ "$answer" != "y" ] && [ "$answer" != "Y" ]; then
      echo "  Skipped."
      echo ""
      return 0
    fi
  fi

  echo "  Authenticating to $dir..."
  echo "  A browser tab will open — log in with Account $num and authorize."
  echo ""

  CLAUDE_CONFIG_DIR="$dir" claude auth login

  if [ $? -eq 0 ]; then
    echo ""
    echo "  Account $num saved to $dir"
  else
    echo ""
    echo "  Account $num setup failed. You can retry later."
  fi
  echo ""
}

# Setup accounts
setup_account 1

read -p "Set up Account 2? (y/n): " do2
if [ "$do2" = "y" ] || [ "$do2" = "Y" ]; then
  echo "Switch to your 2nd Chrome profile before pressing Enter..."
  read -p "Press Enter when ready..."
  setup_account 2
fi

read -p "Set up Account 3? (y/n): " do3
if [ "$do3" = "y" ] || [ "$do3" = "Y" ]; then
  echo "Switch to your 3rd Chrome profile before pressing Enter..."
  read -p "Press Enter when ready..."
  setup_account 3
fi

# Summary
echo "============================================"
echo "  Setup Complete"
echo "============================================"
count=0
for i in 1 2 3; do
  if [ -d "$HOME/.claude-acct$i" ]; then
    echo "  Account $i: $(get_profile_name "$HOME/.claude-acct$i" 2>/dev/null || echo "configured")"
    count=$((count + 1))
  fi
done
echo ""
echo "  $count account(s) configured."
echo "  The autopilot will rotate between them."
echo "============================================"
