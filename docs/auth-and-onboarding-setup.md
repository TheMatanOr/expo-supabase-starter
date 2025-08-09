# Auth & Onboarding Integration Guide

## 🎯 Overview

This document outlines the comprehensive auth and onboarding system built with Zustand, Zod, and Supabase integration. The system provides production-ready email verification, user onboarding data collection, and state management.

## 🏗️ Architecture

### State Management (Zustand)

- **`useAuthStore`**: Manages authentication state, loading states, errors, and user session
- **`useOnboardingStore`**: Manages onboarding selections, progress tracking, and validation

### Validation (Zod)

- **Auth Schemas**: Email, verification code, and user data validation
- **Onboarding Schemas**: Step validation and structured data transformation

### Hooks

- **`useAuth`**: Main authentication hook with Supabase integration
- **`useOnboarding`**: Onboarding management with validation and progress tracking

## 🗄️ Database Setup

### 1. Run the SQL Schema

Execute the SQL in `docs/database-schema.sql` in your Supabase SQL editor:

```bash
# The schema includes:
# - user_profiles table
# - RLS policies
# - Auto-trigger for profile creation
# - Indexes for performance
```

### 2. Verify Tables

Ensure these tables exist in your Supabase database:

- `user_profiles` (extends auth.users)

## 🔧 Implementation Details

### Auth Flow

1. **Email Step**: User enters email → Validated with Zod → OTP sent via Supabase
2. **Verification Step**: User enters 5-digit code → Verified with Supabase → User created/logged in
3. **Profile Creation**: User profile saved with onboarding data
4. **Navigation**: Redirect to protected route

### Onboarding Flow

1. **Data Collection**: Multi-step form with option selection
2. **Validation**: Real-time validation with Zod schemas
3. **Progress Tracking**: Visual progress indicator
4. **Data Storage**: Structured data saved to user profile

### Error Handling

- **Field-level errors**: Specific validation messages
- **Global errors**: Network/server error handling
- **Loading states**: Visual feedback for async operations

## 📁 File Structure

```
lib/
├── schemas/
│   ├── auth.ts          # Auth validation schemas
│   └── onboarding.ts    # Onboarding validation schemas
└── stores/
    ├── auth-store.ts    # Authentication state management
    └── onboarding-store.ts # Onboarding state management

hooks/
├── useAuth.ts           # Main auth hook with Supabase
└── useOnboarding.ts     # Onboarding management hook

docs/
├── database-schema.sql  # Supabase database setup
└── auth-and-onboarding-setup.md # This guide
```

## 🚀 Usage Examples

### Using the Auth Hook

```typescript
import { useAuth } from "@/hooks/useAuth";

const MyComponent = () => {
	const {
		sendVerificationCode,
		verifyCode,
		isLoading,
		error,
		isAuthenticated,
	} = useAuth();

	const handleSendCode = async (email: string) => {
		const result = await sendVerificationCode(email);
		if (result.success) {
			// Move to verification step
		}
	};
};
```

### Using the Onboarding Hook

```typescript
import { useOnboarding } from "@/hooks/useOnboarding";

const MyComponent = () => {
	const {
		handleOptionSelect,
		isOptionSelected,
		canContinue,
		completeOnboarding,
		progress,
	} = useOnboarding();

	const handleComplete = async () => {
		const result = await completeOnboarding();
		if (result.success) {
			// Proceed to auth
		}
	};
};
```

## 🔐 Security Features

### Row Level Security (RLS)

- Users can only access their own profile data
- Automatic profile creation on signup
- Secure data isolation

### Validation

- Zod schema validation on both client and server
- Email format validation
- 5-digit OTP validation
- Required field validation

### Error Handling

- Sanitized error messages
- No sensitive data leakage
- Graceful fallbacks

## 📊 Data Flow

```
Onboarding → Auth → Database → Navigation
     ↓         ↓        ↓          ↓
  Zustand   Supabase  Profiles  Protected
   Store     OTP      Table     Routes
```

### Onboarding Data Structure

```typescript
{
  "fitness_level": ["beginner"],
  "goals": ["weight_loss", "muscle_gain", "endurance"],
  "workout_frequency": ["4-5_times"]
}
```

## 🎨 UI Components Updated

### Auth Components

- **EmailStep**: Email input with validation
- **VerificationStep**: 5-digit OTP input with resend
- **AuthBottomSheet**: Modal container with step navigation

### Onboarding Components

- **OnboardingScreen**: Multi-step form with progress tracking
- **OptionCard**: Selectable options with validation feedback

## 🔄 State Synchronization

### Auth Store Integration

- Real-time loading states
- Error state management
- Session persistence
- Automatic logout handling

### Onboarding Store Integration

- Progress tracking
- Selection validation
- Step navigation
- Data transformation

## ⚡ Performance Optimizations

### Zustand Benefits

- Selective subscriptions (no unnecessary re-renders)
- Minimal boilerplate
- DevTools integration
- TypeScript support

### Validation Caching

- Schema validation caching
- Error state persistence
- Optimistic updates

## 🧪 Testing Considerations

### Mock Data

```typescript
// Test email OTP (development only)
const testEmails = ["test@example.com", "demo@example.com"];

// Test verification codes
const testCodes = ["12345", "67890"];
```

### Error Scenarios

- Invalid email formats
- Network failures
- Invalid verification codes
- Database errors

## 🚀 Production Checklist

- [ ] Database schema applied
- [ ] RLS policies enabled
- [ ] Environment variables set
- [ ] Error tracking configured
- [ ] Analytics events added
- [ ] Rate limiting implemented
- [ ] Email templates customized

## 🔧 Customization

### Email Templates

Customize OTP email templates in Supabase Auth settings.

### Validation Rules

Modify Zod schemas in `lib/schemas/` for custom validation.

### UI Styling

Update component styles while maintaining accessibility.

### Database Schema

Extend `user_profiles` table for additional user data.

## 🐛 Troubleshooting

### Common Issues

1. **OTP not received**: Check Supabase email configuration
2. **Profile not created**: Verify RLS policies and triggers
3. **Navigation issues**: Check route protection setup
4. **State not persisting**: Verify Zustand store configuration

### Debug Tools

- Supabase logs
- Zustand DevTools
- React Native Debugger
- Console error logging

This system provides a production-ready foundation for user authentication and onboarding that can scale with your application needs.
