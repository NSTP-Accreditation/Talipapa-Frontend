# 🎨 Admin Login Security UI - Visual Reference

## Quick Visual Guide

### 1. Safe State (No Failed Attempts)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Username Field]                                       │
│  [Password Field]                                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           SIGN IN                                 │ │ ← Green button
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  🛡️ Protected by Enterprise Security                   │ ← Green badge
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 2. Warning State - 3 Attempts Remaining

```
┌─────────────────────────────────────────────────────────┐
│  ┌─ Yellow Warning Card ──────────────────────────────┐ │
│  │  ⚠️ Security Alert                    [3 LEFT]    │ │
│  │                                                    │ │
│  │  ⚠️ CAUTION: 3 attempts remaining before your     │ │
│  │  account is locked for 15 minutes.                │ │
│  │                                                    │ │
│  │  ⏰ Account will be locked for 15 minutes...      │ │
│  │                                                    │ │
│  │  Progress: ████████░░░░░░░░ 60%                   │ │
│  │  3 Failed ◄─────────────────────► 3 Remaining    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  [Username Field]                                       │
│  [Password Field]                                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           SIGN IN                                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ⚠️ 3 of 5 attempts remaining                          │ ← Yellow badge
└─────────────────────────────────────────────────────────┘
```

---

### 3. Severe Warning - 2 Attempts Remaining

```
┌─────────────────────────────────────────────────────────┐
│  ┌─ Orange Warning Card ──────────────────────────────┐ │
│  │  ⚠️ SEVERE WARNING                    [2 LEFT]    │ │
│  │                                                    │ │
│  │  ⚠️ WARNING: Only 2 attempts remaining before     │ │
│  │  15-minute lockout.                               │ │
│  │                                                    │ │
│  │  ⏰ Account will be locked for 15 minutes...      │ │
│  │                                                    │ │
│  │  Progress: ████████████░░░░ 40%                   │ │
│  │  3 Failed ◄─────────────────────► 2 Remaining    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  [Username Field]                                       │
│  [Password Field]                                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           SIGN IN                                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ⚠️ 2 of 5 attempts remaining                          │ ← Orange badge
└─────────────────────────────────────────────────────────┘
```

---

### 4. Critical Warning - 1 Attempt Remaining (FINAL)

```
┌─────────────────────────────────────────────────────────┐
│  ┌─ Red Warning Card (PULSING) ───────────────────────┐ │
│  │  🚨 CRITICAL WARNING                  [1 LEFT]    │ │ ← Pulsing
│  │                                                    │ │
│  │  🚨 FINAL ATTEMPT: Your account will be LOCKED    │ │
│  │  for 15 minutes if this attempt fails.            │ │
│  │                                                    │ │
│  │  ⏰ Your account will be LOCKED for 15 minutes... │ │
│  │                                                    │ │
│  │  Progress: ████████████████ 20% (PULSING)         │ │
│  │  4 Failed ◄─────────────────────► 1 Remaining    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  [Username Field]                                       │
│  [Password Field]                                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           SIGN IN                                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ⚠️ 1 of 5 attempts remaining                          │ ← Red badge
└─────────────────────────────────────────────────────────┘
```

---

### 5. Locked Out - Premium Lockout Display

```
┌─────────────────────────────────────────────────────────┐
│  ┌─ Premium Lockout Card (Red Gradient) ──────────────┐ │
│  │  ⚪ 🔒 ACCOUNT LOCKED    [SECURITY ALERT]         │ │ ← Pulsing icon
│  │     (glowing)                                      │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ Too many failed login attempts. Your account │ │ │
│  │  │ is locked for 14 more minutes.               │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ 🛡️ Auto-Unlock In            14:32           │ │ │
│  │  │    Security countdown         14 min 32 sec  │ │ │
│  │  │                                               │ │ │
│  │  │  ████████████████████░░░░░░░ 96%             │ │ │ ← Animated
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ 🛡️ Enhanced Security Protection               │ │ │
│  │  │ Multiple failed login attempts detected.     │ │ │
│  │  │ Your account is temporarily locked to        │ │ │
│  │  │ prevent unauthorized access...               │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ 💡 Need Immediate Access?                     │ │ │
│  │  │ If you've forgotten your password or require │ │ │
│  │  │ urgent access, please contact your system    │ │ │
│  │  │ administrator for assistance.                │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  [Username Field - DISABLED]                            │
│  [Password Field - DISABLED]                            │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  🔒 ACCOUNT LOCKED                                │ │ ← Gray, disabled
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Color Palette

### States

```
Safe      → Green   (#10b981, #059669)
Caution   → Yellow  (#fbbf24, #f59e0b)
Warning   → Orange  (#fb923c, #f97316)
Critical  → Red     (#ef4444, #dc2626)
Info      → Blue    (#3b82f6, #2563eb)
```

### Backgrounds

```
Safe      → bg-green-50
Caution   → bg-yellow-50 → bg-yellow-100
Warning   → bg-orange-50 → bg-orange-100
Critical  → bg-red-50 → bg-red-100 (gradient + pulse)
Locked    → bg-red-50 → bg-red-100 → bg-red-50 (gradient)
```

### Borders

```
Safe      → border-green-200
Caution   → border-yellow-400
Warning   → border-orange-400
Critical  → border-red-400 (pulsing)
Locked    → border-red-500
```

### Text

```
Safe      → text-green-700, text-green-800
Caution   → text-yellow-700, text-yellow-800
Warning   → text-orange-700, text-orange-800
Critical  → text-red-800, text-red-900
Locked    → text-red-900
```

---

## Animation States

### Icons

```
Normal    → Static
Warning   → Subtle pulse (2s interval)
Critical  → Fast pulse (1s interval)
Locked    → Continuous pulse + glow effect
```

### Progress Bars

```
Normal    → Smooth transition (duration-500)
Critical  → Pulse animation
Locked    → Linear countdown (duration-1000)
```

### Buttons

```
Hover     → scale-[1.02] + shadow increase
Active    → scale-[0.98]
Disabled  → opacity-60 + cursor-not-allowed
```

---

## Toast Messages

### Success

```
Title: "✅ Login Successful"
Message: "Welcome back! 🎉"
Duration: 2000ms
Color: Green
```

### Validation Error

```
Title: None (inline only)
Message: None (inline only)
Duration: N/A
Color: Red (border)
```

### Login Failed (3+ attempts remaining)

```
Title: "Login Failed"
Message: "Invalid username or password. Please check your credentials."
Duration: 4000ms
Color: Red
```

### Login Failed (3 attempts)

```
Title: "⚠️ Login Failed"
Message: "Invalid credentials. 3 attempts remaining before lockout."
Duration: 5000ms
Color: Yellow
```

### Login Failed (2 attempts)

```
Title: "⚠️ Security Alert"
Message: "Invalid credentials. ⚠️ WARNING: Only 2 attempts remaining..."
Duration: 6000ms
Color: Orange
```

### Login Failed (1 attempt)

```
Title: "🚨 Critical Warning"
Message: "Invalid credentials. ⚠️ FINAL WARNING: Account will be locked..."
Duration: 8000ms
Color: Red
```

### Account Locked

```
Title: "🔒 Account Locked"
Message: "Too many failed attempts. Your account has been locked for 15 minutes."
Duration: 7000ms
Color: Red
```

### Network Error

```
Title: "Network Error"
Message: "Connection error. Please check your internet and try again."
Duration: 5000ms
Color: Red
```

---

## Responsive Breakpoints

### Mobile (< 640px)

```
Typography: text-xs → text-sm
Padding: p-4
Icons: w-5 h-5
Button: h-14
Logo: w-20 h-20
```

### Tablet (640px - 1024px)

```
Typography: sm:text-sm → sm:text-base
Padding: sm:p-5 → sm:p-6
Icons: sm:w-6 sm:h-6
Button: sm:h-16
Logo: sm:w-28 sm:h-28
```

### Desktop (> 1024px)

```
Typography: lg:text-base → lg:text-lg
Padding: lg:p-16
Icons: lg:w-7 lg:h-7
Button: h-16
Logo: w-32 h-32
```

---

## Accessibility

### Keyboard Navigation

```
Tab       → Next field
Shift+Tab → Previous field
Enter     → Submit form
Space     → Toggle password visibility
```

### Screen Reader Announcements

```
Locked    → "Account locked. Please wait 14 minutes and 32 seconds"
Warning   → "Security alert. 3 attempts remaining"
Error     → "Invalid credentials. 2 attempts remaining before lockout"
```

### Focus States

```
Input     → Blue ring (ring-2 ring-blue-500)
Button    → Outline visible
Checkbox  → Blue ring
```

---

## Implementation Checklist

- [x] 3-tier progressive warning system
- [x] Premium lockout display
- [x] Animated lock icon with glow
- [x] Large countdown timer (MM:SS + descriptive)
- [x] Animated progress bars
- [x] Security badges
- [x] Color-coded severity levels
- [x] Information cards
- [x] Responsive design
- [x] Accessibility features
- [x] Double-submission prevention
- [x] State synchronization
- [x] Toast messages
- [x] Button states
- [x] Loading states
- [x] Error handling

---

**Status:** ✅ **PRODUCTION READY**  
**Version:** 3.0.0 - Enterprise Edition  
**Last Updated:** November 7, 2025
