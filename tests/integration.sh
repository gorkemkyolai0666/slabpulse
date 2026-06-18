#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4024/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== SlabPulse Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@istanbultasatolyesi.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/projects" -H "Authorization: Bearer $TOKEN")
assert_status "List Projects" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/slabs" -H "Authorization: Bearer $TOKEN")
assert_status "List Slabs" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/surveys" -H "Authorization: Bearer $TOKEN")
assert_status "List Surveys" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/cnc-tasks" -H "Authorization: Bearer $TOKEN")
assert_status "List CNC Tasks" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/finishes" -H "Authorization: Bearer $TOKEN")
assert_status "List Finishes" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/firm" -H "Authorization: Bearer $TOKEN")
assert_status "Firm Profile" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/surveys/revision" -H "Authorization: Bearer $TOKEN")
assert_status "Revision Surveys" 200 "$HTTP_CODE"

CREATE_PROJECT=$(curl -s -w "\n%{http_code}" "$API_URL/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"projectNumber":"TS-9999","clientName":"Test Müşteri","projectType":"countertop","areaSqm":12}')
HTTP_CODE=$(echo "$CREATE_PROJECT" | tail -1)
assert_status "Create Project" 201 "$HTTP_CODE"

PROJECT_ID=$(echo "$CREATE_PROJECT" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$PROJECT_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/projects/$PROJECT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"completed"}')
  assert_status "Update Project" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/projects/$PROJECT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Project" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
