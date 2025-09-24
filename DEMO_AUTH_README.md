# FlowSense Demo Authentication System

## Overview
A temporary demonstration authentication system with role-based routing for the FlowSense groundwater intelligence application.

## Features Implemented

### 1. Login Page (`/src/components/Login.tsx`)
- **Mock Authentication**: No real verification, just UI demonstration
- **Role Selection**: Dropdown with three roles:
  - 🌱 **Farmer**: Access farming insights and irrigation recommendations
  - 🛡️ **Government Officer**: Monitor systems and validate alerts  
  - 📊 **Policy Maker**: Access regional analysis and policy insights
- **Input Options**: Email or Phone number (toggleable)
- **Sample Data**: One-click fill for demo credentials
- **Responsive Design**: Mobile-friendly with animated background

### 2. Role-Based Dashboards

#### Farmer Dashboard (`/src/components/FarmerDashboard.tsx`)
- **Current Water Depth**: Real-time groundwater level display (15.2m)
- **Recharge Rate**: Natural replenishment percentage (68%)
- **Depletion Rate**: Water level decline rate (12%)
- **Irrigation Recommendations**: 
  - Smart suggestions (reduce irrigation by 20%)
  - Quick tips for water conservation
  - Next review scheduling
- **Location Info**: Farm location with weather and nearby resources
- **Action Buttons**: Request water quality test, schedule field visits

#### Officer Dashboard (`/src/components/OfficerDashboard.tsx`)
- **System Overview**: Station counts, alerts, and performance metrics
- **Anomaly Alert Validation**:
  - Pending alerts with location and severity
  - Validate/Dismiss functionality
  - Real-time status updates
- **Full System Monitoring**: 
  - Data collection rates (98.5%)
  - System uptime (99.2%)
  - Performance metrics
- **Report Generation**: 
  - Daily operations reports
  - Critical alerts summary
  - System performance reports
  - Custom report builder

#### Policy Dashboard (`/src/components/PolicyDashboard.tsx`)
- **State-Level Overview**: Area, districts, population metrics
- **Regional Heatmap**: 
  - District-wise water stress levels
  - Color-coded severity (Good/Moderate/Critical)
  - Population and trend indicators
- **Policy Insights**: 
  - Water conservation mandates
  - Groundwater recharge programs
  - Smart irrigation subsidies
  - Budget impact analysis
- **Multi-Level Views**: State/District/Block level analysis

### 3. Routing System (`/src/App.tsx`)
- **Authentication State**: Login/Logout management
- **Role-Based Routing**: Automatic redirect based on user role
- **Dual Layout System**: 
  - Simple layout for role-based users (with logout only)
  - Full navigation for general admin users
- **User Data Management**: Persistent user information during session

## Demo Credentials

### Farmer
- **Email**: `farmer@example.com`
- **Phone**: `+91 98765 43210`

### Government Officer  
- **Email**: `officer@gwrd.gov.in`
- **Phone**: `+91 98765 12345`

### Policy Maker
- **Email**: `policy@gov.in`
- **Phone**: `+91 98765 67890`

## Technical Implementation

### Authentication Flow
1. **Login Screen**: Role selection and credential input
2. **Validation**: Mock validation (no backend required)
3. **Role Detection**: Automatic dashboard routing
4. **Session Management**: User data stored in React state
5. **Logout**: Clear session and return to login

### Component Structure
```
src/components/
├── Login.tsx              # Authentication interface
├── FarmerDashboard.tsx    # Farmer-specific dashboard
├── OfficerDashboard.tsx   # Officer-specific dashboard
├── PolicyDashboard.tsx    # Policy maker dashboard
└── App.tsx               # Main routing and auth logic
```

### Key Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Professional UI**: Consistent color schemes and animations
- **Interactive Elements**: Hover effects, loading states, transitions
- **Mock Data**: Realistic sample data for demonstration
- **TypeScript**: Full type safety throughout the application

## Usage Instructions

1. **Start Application**: 
   ```bash
   cd c:\Projects\FlowSence
   npm run dev
   ```

2. **Access Login**: Navigate to `http://localhost:5173/`

3. **Select Role**: Choose from Farmer, Officer, or Policy Maker

4. **Fill Credentials**: Use sample data button or enter manually

5. **Explore Dashboard**: Each role has different features and insights

6. **Logout**: Use logout button to return to role selection

## Future Enhancements
- Real authentication with backend integration
- Persistent sessions with local storage
- Advanced role permissions and access control
- Multi-tenant support for different organizations
- Integration with actual groundwater monitoring APIs

## Demo Notes
- This is a demonstration system with no real authentication
- All data is mock/sample data for visualization purposes
- No actual backend connectivity or data persistence
- Designed to showcase UI/UX capabilities and role-based access patterns