# AI Blackbox Landing Page Guide

## Overview

A professional SaaS landing page for AI Blackbox has been created with enterprise-grade design and full integration with the dashboard application.

## Features Implemented

### 1. Navigation Bar
- **Logo**: Small AI Blackbox logo (8x8) with glow effect
- **Navigation Links**: Architecture, Features, Demo, GitHub
- **CTA Button**: "Open Dashboard" with blue gradient and shadow
- **Sticky**: Remains at top with backdrop blur effect

### 2. Hero Section
**Left Side:**
- Large title: "AI Blackbox"
- Subtitle: "Forensic Accountability for AI Systems"
- Description: Value proposition
- Two CTA buttons:
  - Primary: "View Investigation Dashboard" (blue)
  - Secondary: "Explore Architecture" (slate)
- Feature bullets with checkmarks:
  - ✓ Tamper-Evident Hash Chains
  - ✓ Amazon Bedrock AI Risk Analysis
  - ✓ DynamoDB + S3 Immutable Logs
  - ✓ Forensic Replay Dashboard

**Right Side:**
- Large logo with premium glow effect: `drop-shadow-[0_0_25px_rgba(59,130,246,0.7)]`
- Vertical architecture flow with 5 steps:
  1. AI Interaction
  2. Amazon Bedrock Analysis
  3. Hash Chain Engine
  4. DynamoDB + S3 Storage
  5. Forensic Investigation Dashboard
- Each step is a glowing card with connecting lines

### 3. AWS Powered Section
Four service cards with icons and descriptions:
- **Amazon Bedrock**: AI inference and risk classification
- **DynamoDB**: High-speed indexed audit storage
- **Amazon S3**: Immutable audit archive
- **Lambda / Serverless APIs**: Scalable backend execution

Each card has:
- Gradient icon background
- Hover effects with scale and shadow
- Color-coded icons (blue, purple, green, yellow)

### 4. Core Features Section
Three feature cards with gradient backgrounds:

**Tamper-Evident Logging** (Blue-Cyan gradient)
- SHA-256 cryptographic chaining
- Immediate tampering detection

**AI Risk Analysis** (Purple-Pink gradient)
- Multi-model consensus
- Robust threat detection

**Forensic Replay** (Green-Emerald gradient)
- Full decision timeline reconstruction
- Complete audit trail with timestamps

### 5. System Architecture Section
Vertical flow diagram showing:
- User / AI System
- AI Blackbox API
- Amazon Bedrock
- Risk Analysis Engine
- Hash Chain Integrity
- DynamoDB + S3
- Investigation Dashboard

Connected with animated gradient lines (pulse animation).

### 6. Developer Resources Section
- Title: "Open Source & Developer Resources"
- Four resource links:
  - GitHub Repository
  - Project Documentation
  - AWS Architecture
  - Demo Video
- Large CTA: "Launch Investigation Dashboard"

### 7. Footer
Three-column layout:
- **Column 1**: Logo, tagline, AWS 10,000 AIdeas Competition
- **Column 2**: Links (GitHub, LinkedIn, Portfolio, Email)
- **Column 3**: Built using (Amazon Bedrock, DynamoDB, S3, React, TypeScript)
- Copyright notice

## Design System

### Colors
- **Background**: `#0f172a` (slate-950)
- **Card**: `#111827` (slate-900)
- **Primary Blue**: `#3b82f6` (blue-600)
- **Accent Glow**: `#60a5fa` (blue-400)
- **Text**: `#e5e7eb` (slate-100)

### Visual Effects
- **Glowing Grid Background**: Subtle animated grid with radial gradient mask
- **Glow Effects**: Blue shadow effects on cards and buttons
- **Hover Animations**: Scale transforms and shadow changes
- **Smooth Transitions**: All interactions use CSS transitions
- **Rounded Cards**: 12px border radius for modern look

### Typography
- **Headings**: Bold, large sizes (5xl-7xl for hero)
- **Body**: Slate-400 for secondary text
- **Accent**: Blue-400 for highlights

## Navigation Flow

### Landing Page Routes
1. **Landing** (default): Professional marketing page
2. **Dashboard**: Main application with sidebar
3. **Analyze**: AI analysis interface
4. **Sessions**: Session browser
5. **Integrity**: Chain verification
6. **Investigation**: Forensic analysis

### Navigation Methods
- **From Landing**: Click "Open Dashboard" or "Launch Investigation Dashboard"
- **From Dashboard**: Click logo in sidebar to return to landing
- **Between Pages**: Use sidebar navigation

## Responsive Design

The landing page is fully responsive:
- **Mobile**: Single column layout, stacked cards
- **Tablet**: Two-column grids where appropriate
- **Desktop**: Full multi-column layouts

### Breakpoints Used
- `md:` (768px) for tablet and up
- `lg:` (1024px) for large screens

## Logo Usage

### Navbar
```tsx
<img src="/aiblackbox-logo.png" alt="AI Blackbox" className="h-8 w-8" />
```

### Hero Section
```tsx
<img 
  src="/aiblackbox-logo.png" 
  alt="AI Blackbox" 
  className="w-72 drop-shadow-[0_0_25px_rgba(59,130,246,0.7)]"
/>
```

### Footer
```tsx
<img src="/aiblackbox-logo.png" alt="AI Blackbox" className="h-6 opacity-80" />
```

## File Structure

```
dashboard/
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx (NEW)
│   │   ├── DashboardPage.tsx
│   │   ├── AnalyzePage.tsx
│   │   ├── SessionsPage.tsx
│   │   ├── IntegrityPage.tsx
│   │   └── InvestigationPage.tsx
│   └── App.tsx (UPDATED)
└── public/
    └── aiblackbox-logo.png (NEW)
```

## Component Props

### LandingPage
```typescript
interface LandingPageProps {
  onNavigate: (page: string) => void;
}
```

The `onNavigate` callback is used to navigate to the dashboard when users click CTA buttons.

## Styling Approach

- **Tailwind CSS**: All styling uses Tailwind utility classes
- **Custom Gradients**: Gradient backgrounds for premium feel
- **Shadow Effects**: Multiple shadow layers for depth
- **Animations**: Smooth transitions and pulse effects
- **Dark Theme**: Consistent with dashboard design

## Performance Considerations

- **Lazy Loading**: Images load on demand
- **CSS Grid**: Efficient layout system
- **No External Dependencies**: Uses only React and Lucide icons
- **Optimized Animations**: GPU-accelerated transforms

## Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **Color Contrast**: WCAG AA compliant text colors
- **Icon Labels**: All icons have descriptive text
- **Keyboard Navigation**: All buttons are keyboard accessible
- **Focus States**: Visible focus indicators on interactive elements

## Future Enhancements

1. **Smooth Scroll**: Add smooth scrolling to section links
2. **Parallax Effects**: Add depth with parallax scrolling
3. **Video Demo**: Embed demo video in resources section
4. **Blog Integration**: Add recent blog posts section
5. **Testimonials**: Add customer testimonials carousel
6. **Newsletter**: Add email signup form
7. **Dark/Light Mode**: Toggle theme preference
8. **Internationalization**: Multi-language support

## Testing

To test the landing page:

1. Start the frontend:
```bash
cd dashboard
npm run dev
```

2. Navigate to `http://localhost:5173`

3. Test navigation:
   - Click "Open Dashboard" button
   - Click logo to return to landing
   - Test smooth scrolling to sections
   - Verify responsive design on mobile

## Deployment

The landing page is production-ready and can be deployed with:

```bash
cd dashboard
npm run build
```

This creates an optimized build in `dashboard/dist/`.

## Integration Notes

- Landing page is the default route when app loads
- Sidebar is hidden on landing page for clean presentation
- All navigation is client-side (no page reloads)
- Logo asset should be placed at `dashboard/public/aiblackbox-logo.png`
- Ensure logo is a PNG with transparent background for best results

## Support

For issues or questions about the landing page:
1. Check the component code in `dashboard/src/pages/LandingPage.tsx`
2. Review Tailwind CSS documentation for styling
3. Verify logo asset is in correct location
4. Check browser console for any errors
