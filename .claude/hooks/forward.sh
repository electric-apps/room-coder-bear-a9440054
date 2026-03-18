#!/bin/bash
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "https://electric-agent.fly.dev/api/sessions/a9440054-8b63-4144-b1c2-1fa62c1f2e5b/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 3b23d5f6078cc7b19b48480538a4e8df79d7bf32d89c7a0cc237bbfbab45719d" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0