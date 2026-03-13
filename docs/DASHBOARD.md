# AI Blackbox Dashboard

Enterprise-grade React dashboard for forensic AI accountability.

## Running the Dashboard

The dashboard is currently running at: **http://localhost:5174**

The API server is running at: **http://localhost:3001**

## Features

### 1. Dashboard Page
- Real-time statistics (total entries, sessions, integrity status)
- Interactive line chart showing interactions over time
- Risk distribution breakdown (LOW/MEDIUM/HIGH)
- Auto-refreshes every 5 seconds

### 2. Analyze Page
- Prompt input with real-time AI analysis
- Amazon Bedrock (Nova Micro) integration
- Risk assessment with color-coded badges:
  - 🟢 GREEN = LOW risk
  - 🟡 YELLOW = MEDIUM risk
  - 🔴 RED = HIGH risk
- Complete audit trail display with:
  - Session ID
  - Audit entry ID
  - Hash values (with copy button)
  - Previous hash linkage

### 3. Sessions Page
- List all sessions with click-to-view details
- Forensic timeline replay showing:
  - Event sequence with timestamps
  - Duration between events
  - Risk escalation detection
  - Complete interaction history
- Hash chain visualization for each session
- Event-by-event breakdown with full context

### 4. Integrity Page
- Per-session hash chain verification
- Large visual status indicator (✓ or ✗)
- Detailed error reporting for invalid chains
- Session-by-session integrity breakdown
- Real-time refresh capability
- Educational information about hash chain security

## Design

- Dark theme with professional fintech aesthetic
- TailwindCSS for responsive, enterprise-grade styling
- Lucide React icons for consistent iconography
- Recharts for data visualization
- Fully responsive layout

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Development

```bash
cd dashboard
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## API Integration

All API calls go to `http://localhost:3001`:
- POST `/api/analyze` - Analyze prompts
- GET `/api/sessions` - List all sessions
- GET `/api/session/:sessionId` - Get session details
- GET `/api/integrity` - Verify chain integrity
- GET `/api/stats` - Get system statistics
