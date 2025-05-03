# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Hospital Booking App Backend

A React Native application for booking hospital tests and services.

## Backend Setup and Documentation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Structure
The backend is a simple Node.js server that provides:
- RESTful API endpoints for hospital data
- Local storage for bookings
- Authentication endpoints

### How to Run the Backend

1. Navigate to the backend directory:
```bash
cd bookingBackend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the server:
```bash
npm start
# or
yarn start
```

The server will start on `http://localhost:3000` by default.

### Backend Architecture

The backend consists of several key components:

1. **Server Setup (`server.js`)**
   - Express server configuration
   - CORS middleware for cross-origin requests
   - Body parser for JSON requests
   - Static file serving for hospital data

2. **Data Storage**
   - Hospital data is stored in `data/hospitals.json`
   - Bookings are stored in memory using `BookingService`
   - Data persistence is handled through local storage

3. **API Endpoints**
   - `GET /api/hospitals` - Returns list of hospitals with tests and services
   
4. **Authentication**
   - NONE! 


### Testing the Backend

You can test the backend using tools like Postman or curl:

```bash
# Get all hospitals
curl http://localhost:3000/api/hospitals

### Troubleshooting

If you encounter any issues:

1. Verify the port is not in use:
```bash
lsof -i :3000
```

3. Check the server logs for any error messages

### Security Considerations

- CORS is configured to allow requests from the React Native app
- Sensitive data is not stored in plain text
