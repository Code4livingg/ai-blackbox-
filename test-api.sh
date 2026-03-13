#!/bin/bash

# AI Blackbox API Test Script

BASE_URL="http://localhost:3001"

echo "🧪 Testing AI Blackbox API"
echo ""

# Test 1: Analyze a safe prompt
echo "1️⃣  Testing safe prompt..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is machine learning?"}')
SESSION_ID=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['sessionId'])")
echo "✅ Session created: $SESSION_ID"
echo ""

# Test 2: Get all sessions
echo "2️⃣  Getting all sessions..."
curl -s $BASE_URL/api/sessions | python3 -m json.tool
echo ""

# Test 3: Get session replay
echo "3️⃣  Getting session replay for: $SESSION_ID"
curl -s $BASE_URL/api/session/$SESSION_ID | python3 -c "import sys, json; data = json.load(sys.stdin); print(json.dumps(data['timeline']['summary'], indent=2))"
echo ""

# Test 4: Check integrity
echo "4️⃣  Checking chain integrity..."
curl -s $BASE_URL/api/integrity | python3 -m json.tool
echo ""

# Test 5: Get stats
echo "5️⃣  Getting system stats..."
curl -s $BASE_URL/api/stats | python3 -m json.tool
echo ""

echo "✅ All tests complete!"
