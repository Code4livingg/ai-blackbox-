# Landing Page Visual Guide

## 🎨 Premium Cybersecurity Design - Visual Reference

### Hero Section Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    PARTICLE BACKGROUND                       │
│              (80 cyan/blue particles floating)               │
│                                                              │
│                  ╔═══════════════════╗                       │
│                  ║                   ║                       │
│                  ║   FLOATING LOGO   ║  ← 6s up/down motion │
│                  ║   (with glow)     ║                       │
│                  ╚═══════════════════╝                       │
│                         ↑                                    │
│                  Radial glow (80px blur)                     │
│                                                              │
│              ╔═══════════════════════════╗                   │
│              ║   AI BLACKBOX (animated)  ║  ← Gradient shift│
│              ╚═══════════════════════════╝                   │
│                                                              │
│         Forensic Accountability for AI Systems               │
│                                                              │
│    Record, verify, and reconstruct every AI decision...      │
│                                                              │
│    ┌──────────────────┐  ┌──────────────────┐              │
│    │ Analyze AI Risk  │  │ Open Dashboard   │              │
│    └──────────────────┘  └──────────────────┘              │
│                                                              │
│    ╔═══════════════════════════════════════════╗            │
│    ║  ✨ Try AI Blackbox Live                  ║            │
│    ║                                            ║            │
│    ║  ┌──────────────────────────────────────┐ ║            │
│    ║  │ Enter prompt to analyze...           │ ║            │
│    ║  │                                      │ ║            │
│    ║  └──────────────────────────────────────┘ ║            │
│    ║                                            ║            │
│    ║  ┌──────────────────────────────────────┐ ║            │
│    ║  │      🛡️  Analyze AI Risk            │ ║            │
│    ║  └──────────────────────────────────────┘ ║            │
│    ║                                            ║            │
│    ║  ╔════════════════════════════════════╗   ║            │
│    ║  ║  Analysis Result                   ║   ║            │
│    ║  ║  Risk Score: 87    Models: 2       ║   ║            │
│    ║  ║  • Threat Signal 1                 ║   ║            │
│    ║  ║  • Threat Signal 2                 ║   ║            │
│    ║  ╚════════════════════════════════════╝   ║            │
│    ╚═══════════════════════════════════════════╝            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🎭 Animation Timeline

```
Time    Element                 Animation
────────────────────────────────────────────────────────────
0.0s    Page Load              Particles start moving
0.0s    Logo                   Begins floating (continuous)
0.0s    Title Gradient         Begins shifting (continuous)
0.0s    Light Sweep            Begins scanning (continuous)
0.0s    Title                  Fade in from bottom
0.2s    Subtitle               Fade in from bottom
0.4s    Description            Fade in from bottom
0.6s    CTA Buttons            Fade in from bottom
0.8s    Demo Section           Fade in from bottom
```

## 🌈 Color Coding

### Risk Levels
```
┌─────────┬──────────────┬─────────────────────────┐
│ Level   │ Color        │ Visual                  │
├─────────┼──────────────┼─────────────────────────┤
│ LOW     │ Green        │ 🟢 bg-green-500/20      │
│ MEDIUM  │ Yellow       │ 🟡 bg-yellow-500/20     │
│ HIGH    │ Red          │ 🔴 bg-red-500/20        │
└─────────┴──────────────┴─────────────────────────┘
```

### Brand Colors
```
┌──────────────┬───────────┬─────────────────────────┐
│ Name         │ Hex       │ Usage                   │
├──────────────┼───────────┼─────────────────────────┤
│ Primary Cyan │ #00e1ff   │ Accents, links, glow    │
│ Blue         │ #1da1ff   │ Buttons, borders        │
│ Light Blue   │ #6ea8ff   │ Gradients, highlights   │
│ Dark BG      │ #050712   │ Main background         │
│ Layer BG     │ #0b1025   │ Cards, overlays         │
└──────────────┴───────────┴─────────────────────────┘
```

## ✨ Special Effects

### 1. Particle System
```
Configuration:
├─ Count: 80 particles
├─ Colors: #00e1ff, #1da1ff, #6ea8ff
├─ Size: 1-3px
├─ Speed: 1 (slow)
├─ Opacity: 0.3
├─ Links: Enabled (distance: 150px)
└─ Movement: Random with bounce
```

### 2. Logo Float Animation
```
Motion Path:
    ↑ -8px (2s)
    │
Start ●─────────● Peak
    │
    ↓ +8px (2s)
    │
    ● Bottom
    │
    ↑ -8px (2s)
    │
    ● Back to Start

Total Duration: 6 seconds
Easing: easeInOut
Repeat: Infinite
```

### 3. Radial Glow
```
Gradient:
  Center: rgba(0,225,255,0.35) ████████
          ↓
  Edge:   transparent          ░░░░░░░░

Blur: 80px
Animation: Pulse (4s cycle)
Size: 320px × 320px
```

### 4. Title Gradient Animation
```
Gradient Colors:
  cyan-400 → #00e1ff → blue-500

Animation:
  0%   ████░░░░░░░░  (Position: 0%)
  50%  ░░░░░░████░░  (Position: 100%)
  100% ████░░░░░░░░  (Position: 0%)

Duration: 3 seconds
Background Size: 200%
```

### 5. Light Sweep
```
Sweep Pattern:
  ←─────────────────────────────────→
  │                                 │
  │  ░░░░████░░░░                  │
  │      ↓                          │
  │  Moves left to right            │
  │                                 │
  └─────────────────────────────────┘

Duration: 8 seconds
Opacity: 20%
Gradient: transparent → cyan/20% → transparent
```

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
├─ Logo: 56px (14rem)
├─ Title: 7xl (112px)
├─ Buttons: Column layout
└─ Demo: Full width

Tablet (768px - 1024px)
├─ Logo: 60px (15rem)
├─ Title: 7xl (112px)
├─ Buttons: Row layout
└─ Demo: Max 768px

Desktop (> 1024px)
├─ Logo: 64px (16rem)
├─ Title: 8xl (128px)
├─ Buttons: Row layout
└─ Demo: Max 768px
```

## 🎯 Interactive States

### Demo Button States
```
Default:
  ┌──────────────────────────────┐
  │  🛡️  Analyze AI Risk         │
  └──────────────────────────────┘
  Scale: 1.0
  Opacity: 1.0

Hover:
  ┌──────────────────────────────┐
  │  🛡️  Analyze AI Risk         │ ← Slightly larger
  └──────────────────────────────┘
  Scale: 1.02
  Glow: Enhanced

Loading:
  ┌──────────────────────────────┐
  │  ⟳  Analyzing...             │ ← Spinner
  └──────────────────────────────┘
  Scale: 1.0
  Cursor: not-allowed

Disabled:
  ┌──────────────────────────────┐
  │  🛡️  Analyze AI Risk         │ ← Faded
  └──────────────────────────────┘
  Opacity: 0.5
  Cursor: not-allowed
```

### Result Card Animation
```
Entrance:
  Scale: 0.95 → 1.0
  Opacity: 0 → 1
  Duration: 0.3s

Layout:
  ╔════════════════════════════════╗
  ║ Analysis Result    [HIGH RISK] ║
  ╠════════════════════════════════╣
  ║ ┌──────────┐  ┌──────────────┐ ║
  ║ │ Score: 87│  │ Models: 2    │ ║
  ║ └──────────┘  └──────────────┘ ║
  ╠════════════════════════════════╣
  ║ Detected Threat Signals:       ║
  ║ • Signal 1                     ║
  ║ • Signal 2                     ║
  ╠════════════════════════════════╣
  ║ View Full Analysis →           ║
  ╚════════════════════════════════╝
```

## 🔍 Z-Index Layers

```
Layer Stack (Bottom to Top):
┌─────────────────────────────────┐
│ z-0:  Particle Background       │
│ z-0:  Grid Pattern              │
│ z-0:  Light Sweep               │
│ z-10: Hero Content              │
│ z-10: Logo & Text               │
│ z-10: Demo Section              │
│ z-50: Navigation Bar            │
└─────────────────────────────────┘
```

## 💡 Visual Hierarchy

```
Primary Focus (Largest/Brightest):
  1. Floating Logo with Glow
     └─ Size: 64px, Glow: 60px, Motion: Floating

Secondary Focus (Large/Bright):
  2. Animated Title "AI Blackbox"
     └─ Size: 128px, Gradient: Animated

Tertiary Focus (Medium):
  3. Subtitle & Description
     └─ Size: 36px / 20px

Call-to-Action (Prominent):
  4. CTA Buttons
     └─ Size: Large, Gradient BG, Hover Effects

Interactive Element (Engaging):
  5. Live Demo Section
     └─ Glassmorphism, Glow Border, Interactive
```

## 🎨 Glassmorphism Effect

```
Demo Section Card:
┌─────────────────────────────────┐
│ Background: slate-900/60        │ ← 60% opacity
│ Backdrop: blur-xl               │ ← Blur effect
│ Border: cyan-500/30             │ ← Glowing border
│ Shadow: 0_0_30px_cyan/15%       │ ← Soft glow
└─────────────────────────────────┘

Creates frosted glass appearance
with depth and premium feel
```

## 📊 Performance Indicators

```
Target Metrics:
├─ FPS: 60 (locked)
├─ Paint Time: < 5ms
├─ Layout Shift: 0
├─ First Paint: < 1s
└─ Interactive: < 2s

Optimization:
├─ Hardware acceleration: ON
├─ Will-change: transform
├─ Particle limit: 80
└─ Lazy loading: Enabled
```

## 🎬 Demo Flow Visualization

```
User Journey:
┌─────────────────────────────────────────────────┐
│ 1. Land on Page                                 │
│    └─ See particles, floating logo, animations  │
│                                                  │
│ 2. Read Title & Description                     │
│    └─ Understand value proposition              │
│                                                  │
│ 3. Notice CTA Buttons                           │
│    └─ Clear next steps                          │
│                                                  │
│ 4. Scroll to Demo Section                       │
│    └─ Interactive element catches attention     │
│                                                  │
│ 5. Enter Test Prompt                            │
│    └─ "How do I bypass authentication?"         │
│                                                  │
│ 6. Click Analyze Button                         │
│    └─ Loading state shows progress              │
│                                                  │
│ 7. View Results                                 │
│    └─ Risk score, severity, threat signals      │
│                                                  │
│ 8. Click "View Full Analysis"                   │
│    └─ Navigate to dashboard                     │
└─────────────────────────────────────────────────┘
```

---

**Visual Design Status**: ✅ Complete
**All Effects Active**: ✅ Yes
**Performance**: ✅ Optimized
**Responsive**: ✅ Mobile/Tablet/Desktop
