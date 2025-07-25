# WME Client Portal Backend

A comprehensive backend system for the William Morris Endeavor Client Portal featuring secure Booking ID authentication, booking management, and client services.

## 🔐 Booking ID Generation System

### Overview
The WME Client Portal uses a sophisticated Booking ID generation system to provide secure, unique identifiers for each client booking.

### Booking ID Format
- **Length**: 8 alphanumeric characters
- **Format**: `WME` + `YY` + `XXX`
- **Example**: `WME24A1B`, `WME24001`, `WME25XYZ`

Where:
- `WME` = William Morris Endeavor prefix (fixed)
- `YY` = Last 2 digits of current year
- `XXX` = 3 random alphanumeric characters

### Generation Algorithm

```typescript
private createBookingId(): string {
  const year = new Date().getFullYear().toString().slice(-2); // "24" for 2024
  const prefix = 'WME'; // WME prefix
  
  // Generate 3 random alphanumeric characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 3; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix}${year}${randomPart}`; // WME24ABC
}
```

### Uniqueness Guarantee
- **Collision Detection**: Each generated ID is checked against existing bookings
- **Maximum Attempts**: 1000 generation attempts before failure
- **Character Set**: 36 characters (26 letters + 10 digits)
- **Possible Combinations**: 46,656 unique IDs per year (36³)

### Security Features
- **No Sequential IDs**: Random generation prevents booking enumeration
- **Year Validation**: IDs automatically include current year for validation
- **Format Validation**: Strict 8-character alphanumeric format enforced
- **Case Insensitive**: System accepts both upper and lowercase input

## 🏗️ Architecture

### Core Services

#### AuthService (`/server/services/authService.ts`)
- **Booking ID Generation**: Secure, unique ID creation
- **Authentication**: Booking ID-based login system
- **User Management**: Create, read, update booking records
- **Validation**: Input sanitization and format validation

#### Database Layer
- **In-Memory Storage**: Current implementation for demo purposes
- **Production Ready**: Easily replaceable with PostgreSQL/MongoDB
- **CRUD Operations**: Full booking lifecycle management
- **Data Integrity**: Referential integrity and validation

### API Endpoints

#### Authentication Routes (`/api/auth/*`)
- `POST /api/auth/login` - Authenticate with Booking ID
- `POST /api/auth/create-booking` - Create new booking (admin)
- `GET /api/auth/verify-session` - Verify current session
- `POST /api/auth/logout` - End user session
- `GET /api/auth/generate-booking-id` - Generate new ID (testing)

#### Booking Management (`/api/bookings/*`)
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status

## 🔒 Security Implementation

### Request Validation
```typescript
// Booking ID validation schema
const BookingIdSchema = z.string().regex(
  /^[A-Z0-9]{8}$/, 
  'Booking ID must be 8 alphanumeric characters'
);

// Input sanitization
const validation = BookingIdSchema.safeParse(bookingId);
if (!validation.success) {
  return { success: false, error: 'Invalid format' };
}
```

### Session Management
- **Header-based Auth**: `x-booking-id` header for API requests
- **Local Storage**: Frontend session persistence
- **Session Verification**: Backend validation on each request
- **Automatic Cleanup**: Invalid sessions cleared automatically

### Error Handling
- **Graceful Degradation**: Network failures handled elegantly
- **User-Friendly Messages**: Clear error communication
- **Security First**: No sensitive data in error responses
- **Logging**: Comprehensive server-side logging

## 📊 Database Schema

### User/Booking Entity
```typescript
interface UserData {
  id: string;              // Internal user ID
  bookingId: string;       // 8-character booking ID
  name: string;            // Client full name
  email: string;           // Client email address
  artist: string;          // Booked artist/talent
  event: string;           // Event description
  eventDate: string;       // Event date (ISO format)
  status: BookingStatus;   // Current booking status
  coordinatorId: string;   // Assigned coordinator
  createdAt: Date;         // Booking creation timestamp
  updatedAt: Date;         // Last modification timestamp
}

type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
```

### Supporting Entities
- **Coordinators**: WME staff assigned to bookings
- **Documents**: Contracts, NDAs, agreements
- **Payments**: Transaction history and status
- **Messages**: Communication logs

## 🚀 Production Deployment

### Environment Variables
```bash
# Server Configuration
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Database (when implementing)
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port

# Security
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key

# External Services
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG.xxx...
DOCUSIGN_API_KEY=your-docusign-key
```

### Database Migration (PostgreSQL Example)
```sql
-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id VARCHAR(8) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  event TEXT NOT NULL,
  event_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  coordinator_id UUID REFERENCES coordinators(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast booking ID lookups
CREATE INDEX idx_bookings_booking_id ON bookings(booking_id);
```

### Scaling Considerations
- **Load Balancing**: Multiple server instances
- **Database Pooling**: Connection management
- **Caching**: Redis for session storage
- **CDN**: Static asset delivery
- **Monitoring**: Health checks and metrics

## 🧪 Testing

### Available Demo Booking IDs
```
WME24001 - John Doe (Taylor Swift)
WME24002 - Jane Smith (Dwayne Johnson)
WME24003 - Mike Johnson (Zendaya)
ABC12345 - Sarah Wilson (Ryan Reynolds)
XYZ98765 - David Chen (Chris Evans)
```

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"bookingId": "WME24001"}'

# Test booking details
curl -X GET http://localhost:8080/api/bookings/WME24001 \
  -H "x-booking-id: WME24001"

# Generate new booking ID
curl -X GET http://localhost:8080/api/auth/generate-booking-id
```

## 📈 Monitoring & Analytics

### Key Metrics
- **Login Success Rate**: Track authentication failures
- **Booking ID Generation**: Monitor uniqueness and performance
- **API Response Times**: Track endpoint performance
- **Error Rates**: Monitor system reliability
- **User Activity**: Track booking interactions

### Logging
- **Structured Logging**: JSON format for analysis
- **Request Tracking**: Complete request lifecycle
- **Error Aggregation**: Centralized error collection
- **Performance Metrics**: Response time monitoring

## 🔧 Development

### Local Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Type checking
npm run typecheck
```

### Code Quality
- **TypeScript**: Full type safety
- **Zod Validation**: Runtime type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing

This backend provides a solid foundation for the WME Client Portal with enterprise-grade security, scalability, and maintainability.
