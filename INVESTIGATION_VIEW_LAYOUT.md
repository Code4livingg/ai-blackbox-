# Investigation View - UI Layout Guide

## Visual Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Sessions          INCIDENT INVESTIGATION    [Download] │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  SESSION OVERVIEW                                                │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐      │
│  │Session ID│Start Time│ End Time │  Events  │Final Risk│      │
│  │ abc-123  │ 10:30 AM │ 10:35 AM │    12    │   LOW    │      │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘      │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✓ CHAIN INTEGRITY VALID                                        │
│  All cryptographic hashes verified successfully                 │
│                                                                   │
│  Entries Verified: 12        Tampering: NO                      │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ⚡ ORIGINAL PROMPT                                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ What are the ethical implications of AI in healthcare?    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CROSS-MODEL ANALYSIS                                           │
│  ┌─────────────────────────┬─────────────────────────┐         │
│  │ Amazon Nova Micro       │ Claude 3 Haiku          │         │
│  │ [LOW]                   │ [LOW]                   │         │
│  │                         │                         │         │
│  │ Response:               │ Response:               │         │
│  │ AI in healthcare...     │ Healthcare AI...        │         │
│  │                         │                         │         │
│  │ Risk: Safe content      │ Risk: Safe content      │         │
│  └─────────────────────────┴─────────────────────────┘         │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  EVENT TIMELINE                                                  │
│  ●─ CROSS MODEL ANALYSIS     10:30:15 AM                        │
│  │                                                               │
│  │                                                               │
│  ●─ PROMPT                   10:30:16 AM  +1.2s                 │
│  │                                                               │
│  │                                                               │
│  ●─ RESPONSE                 10:30:18 AM  +2.1s                 │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  AUDIT EVIDENCE (HASH CHAIN)                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Entry 1                                          abc12345  │ │
│  │ Hash: 3f7a9b2c...8d4e1f6a [Copy]                          │ │
│  │ Prev: 0                     [Copy]                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Entry 2                                          def67890  │ │
│  │ Hash: 8d4e1f6a...2c9b7a3f [Copy]                          │ │
│  │ Prev: 3f7a9b2c...8d4e1f6a [Copy]                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  INVESTIGATION SUMMARY                                           │
│  ┌──────────┬──────────┬──────────┬──────────────────┐         │
│  │ Duration │ Prompts  │Responses │ Risk Escalations │         │
│  │  5.2s    │    1     │    2     │        0         │         │
│  └──────────┴──────────┴──────────┴──────────────────┘         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Color Coding

### Integrity Status

**Valid Chain** (Green):
```
┌─────────────────────────────────────────────────────┐
│ ✓ CHAIN INTEGRITY VALID                             │
│ All cryptographic hashes verified successfully      │
│                                                      │
│ Entries Verified: 12        Tampering: NO          │
└─────────────────────────────────────────────────────┘
```
- Background: Light green tint (`bg-green-500/5`)
- Border: Green (`border-green-500/30`)
- Icon: Green checkmark
- Text: Green for status

**Compromised Chain** (Red):
```
┌─────────────────────────────────────────────────────┐
│ ✗ CHAIN INTEGRITY COMPROMISED                       │
│ Tampering detected in audit chain                   │
│                                                      │
│ Entries Verified: 12        Tampering: YES         │
│                                                      │
│ ⚠ Integrity Errors:                                 │
│ • Entry 5: Hash mismatch detected                   │
│ • Entry 6: previousHash doesn't match               │
└─────────────────────────────────────────────────────┘
```
- Background: Light red tint (`bg-red-500/5`)
- Border: Red (`border-red-500/30`)
- Icon: Red X
- Text: Red for status
- Error box: Dark red background

### Risk Badges

**LOW Risk**:
```
┌─────┐
│ LOW │  Green background, green text
└─────┘
```

**MEDIUM Risk**:
```
┌────────┐
│ MEDIUM │  Yellow background, yellow text
└────────┘
```

**HIGH Risk**:
```
┌──────┐
│ HIGH │  Red background, red text
└──────┘
```

## Component Breakdown

### 1. Header Bar
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Sessions    🛡 INCIDENT INVESTIGATION   [Download] │
└─────────────────────────────────────────────────────────────┘
```
- Left: Back link (text-slate-400, hover:text-white)
- Center: Title with shield icon
- Right: Download button (blue gradient)

### 2. Session Overview Grid
```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│Session ID│Start Time│ End Time │  Events  │Final Risk│
│ abc-123  │ 10:30 AM │ 10:35 AM │    12    │   LOW    │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```
- 5 columns on desktop
- 2 columns on mobile
- Dark cards with borders
- Truncated session ID with tooltip

### 3. Integrity Panel
```
┌─────────────────────────────────────────────────────────┐
│  ✓                                                       │
│     CHAIN INTEGRITY VALID                               │
│     All cryptographic hashes verified successfully      │
│                                                          │
│     Entries Verified: 12        Tampering: NO          │
└─────────────────────────────────────────────────────────┘
```
- Large icon (left)
- Status text (center)
- Metrics (right)
- Full-width panel
- Color-coded background

### 4. Prompt Display
```
┌─────────────────────────────────────────────────────────┐
│ ⚡ ORIGINAL PROMPT                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ What are the ethical implications of AI?            │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```
- Yellow lightning icon
- Dark nested card
- Full prompt text
- Readable font size

### 5. Model Comparison
```
┌─────────────────────────┬─────────────────────────┐
│ Amazon Nova Micro       │ Claude 3 Haiku          │
│ [LOW]                   │ [LOW]                   │
│                         │                         │
│ Response:               │ Response:               │
│ ┌─────────────────────┐ │ ┌─────────────────────┐ │
│ │ AI in healthcare... │ │ │ Healthcare AI...    │ │
│ │                     │ │ │                     │ │
│ │ (scrollable)        │ │ │ (scrollable)        │ │
│ └─────────────────────┘ │ └─────────────────────┘ │
│                         │                         │
│ Risk: Safe content      │ Risk: Safe content      │
└─────────────────────────┴─────────────────────────┘
```
- Two-column grid
- Equal width columns
- Model name header
- Risk badge (top right)
- Scrollable response area
- Risk reason at bottom

### 6. Timeline
```
●─ CROSS MODEL ANALYSIS     10:30:15 AM
│
│  (vertical line)
│
●─ PROMPT                   10:30:16 AM  +1.2s
│
│
│
●─ RESPONSE                 10:30:18 AM  +2.1s
```
- Vertical layout
- Blue dots
- Connecting lines
- Event type (uppercase)
- Timestamp (right)
- Duration badge (if applicable)

### 7. Hash Chain
```
┌───────────────────────────────────────────────────────┐
│ Entry 1                                    abc12345   │
│ Hash: 3f7a9b2c1d8e4f5a6b7c8d9e0f1a2b3c [Copy]       │
│ Prev: 0                                    [Copy]     │
└───────────────────────────────────────────────────────┘
```
- Entry number (top left)
- Entry ID (top right, truncated)
- Full hash with copy button
- Previous hash with copy button
- Hover effects

### 8. Summary Stats
```
┌──────────┬──────────┬──────────┬──────────────────┐
│ Duration │ Prompts  │Responses │ Risk Escalations │
│  5.2s    │    1     │    2     │        0         │
└──────────┴──────────┴──────────┴──────────────────┘
```
- 4 columns
- Large numbers
- Small labels
- Color-coded escalations

## Responsive Breakpoints

### Desktop (1920px)
- Full layout as shown
- Two-column model comparison
- 5-column session overview

### Laptop (1280px)
- Maintained two-column model comparison
- 5-column session overview
- Slightly reduced padding

### Tablet (768px)
- Single column model comparison
- 3-column session overview
- Stacked cards

### Mobile (375px)
- All single column
- 2-column session overview
- Stacked timeline
- Full-width buttons

## Interactive Elements

### Buttons

**Primary (Download)**:
```
┌─────────────────────────────────┐
│ ⬇ Download Forensic Report     │  Blue gradient
└─────────────────────────────────┘
```

**Secondary (Investigate)**:
```
┌─────────────────────┐
│ 🔍 Investigate      │  Purple
└─────────────────────┘
```

**Text Link (Back)**:
```
← Back to Sessions  (Gray, hover: white)
```

### Copy Buttons
```
[Copy]  Small button next to hashes
        Gray background
        Hover: darker gray
        Click: shows checkmark briefly
```

### Loading States

**Page Loading**:
```
        ⟳
Loading investigation data...
```
- Spinning circle
- Centered text
- Blue color

**Button Loading**:
```
┌─────────────────────┐
│ ⟳ Generating...    │  Disabled state
└─────────────────────┘
```

## Spacing and Padding

- Page padding: `p-8`
- Card padding: `p-6`
- Nested card padding: `p-4`
- Grid gap: `gap-6` (large), `gap-4` (medium)
- Section margin: `mb-6`

## Typography

- Page title: `text-3xl font-bold`
- Section title: `text-xl font-semibold`
- Subsection: `text-lg font-semibold`
- Body text: `text-sm` or `text-base`
- Labels: `text-xs uppercase tracking-wide`
- Monospace: `font-mono` (hashes, IDs)

## Icons Size

- Header icons: `w-8 h-8`
- Section icons: `w-5 h-5`
- Button icons: `w-4 h-4` or `w-5 h-5`
- Status icons: `w-8 h-8` (large)
- Timeline dots: `w-4 h-4`

## Shadows

- Cards: `shadow-lg`
- Buttons: `shadow-lg hover:shadow-{color}-500/50`
- Timeline dots: `shadow-lg shadow-blue-500/50`

## Transitions

- All interactive elements: `transition-colors`
- Hover effects: `duration-200`
- Border changes: `transition-all`

## Z-Index Layers

1. Background: `bg-slate-950`
2. Cards: `bg-slate-900`
3. Nested elements: `bg-slate-950`
4. Overlays: (none currently)
5. Modals: (future)

## Accessibility Features

- Focus indicators: Visible on all interactive elements
- Color contrast: WCAG AA compliant
- Keyboard navigation: Tab order follows visual flow
- Screen reader labels: Semantic HTML
- Touch targets: Minimum 44px

## Print Styles (Future)

When implementing print functionality:
- Hide navigation
- Remove background colors
- Ensure black text on white
- Page breaks between sections
- Include all hash data

## Example States

### Loading State
```
┌─────────────────────────────────────┐
│                                     │
│            ⟳                        │
│   Loading investigation data...    │
│                                     │
└─────────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────────┐
│                                     │
│            ✗                        │
│   Failed to load investigation      │
│                                     │
│        [Go Back]                    │
│                                     │
└─────────────────────────────────────┘
```

### Empty State (No Models)
```
┌─────────────────────────────────────┐
│ CROSS-MODEL ANALYSIS                │
│                                     │
│ No model analysis available         │
│                                     │
└─────────────────────────────────────┘
```

## Animation Details

### Loading Spinner
```css
animate-spin
border-4 border-blue-500 border-t-transparent
rounded-full
```

### Button Hover
```css
hover:bg-blue-700
hover:shadow-blue-500/50
transition-colors
```

### Card Hover
```css
hover:border-slate-700
transition-colors
```

## Conclusion

This layout provides a comprehensive, professional investigation interface that:
- Presents information in logical order
- Uses color coding for quick assessment
- Provides clear visual hierarchy
- Maintains consistency with existing pages
- Supports responsive design
- Enables efficient forensic analysis

The design prioritizes investigative workflow, making it easy for security teams to quickly assess session integrity, compare model responses, and gather evidence.
