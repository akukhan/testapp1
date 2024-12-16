
// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Alert } from 'react-native';
// import { Pedometer } from 'expo-sensors';
// import * as Location from 'expo-location';
// import MapView, { Marker } from 'react-native-maps';
// import db from './db'; // Import your database file


// export default function App() {
//   const [stepCount, setStepCount] = useState(0);
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   // Initialize the database
//   useEffect(() => {
//     const initializeDatabase = async () => {
//       await db.initilizeDb();
//     };

//     initializeDatabase();

//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }

//       try {
//         let loc = await Location.getCurrentPositionAsync({});
//         setLocation(loc);
//       } catch (error) {
//         setErrorMsg('Failed to fetch location');
//       }
//     })();
//   }, []);

//   // Step Counter Setup
//   useEffect(() => {
//     let subscription;

//     const subscribeToPedometer = async () => {
//       const isAvailable = await Pedometer.isAvailableAsync();
//       if (!isAvailable) {
//         Alert.alert('Pedometer not available on this device.');
//         return;
//       }

//       // Subscribe to step count changes
//       subscription = Pedometer.watchStepCount((result) => {
//         setStepCount((prevSteps) => prevSteps + result.steps);

//         // Save steps to the database
//         db.insertSteps(result.steps).catch((error) => {
//           console.error('Error inserting steps:', error);
//         });
//       });
//     };

//     subscribeToPedometer();

//     return () => {
//       subscription && subscription.remove();
//     };
//   }, []);

//   // Location Setup
//   useEffect(() => {
//     const getLocationPermission = async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied.');
//         return;
//       }

//       const currentLocation = await Location.getCurrentPositionAsync({});
//       setLocation(currentLocation.coords);
//     };

//     getLocationPermission();
//   }, []);




//   return (
//     <View style={styles.container}>
//       {/* Step Counter */}
//       <Text style={styles.stepText}>Steps Counted: {stepCount}</Text>

//       {/* Map */}
//       {location ? (
//         <MapView
//           style={styles.map}
//           initialRegion={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//         >
//           <Marker
//             coordinate={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }}
//             title="You are here"
//           />
//         </MapView>
//       ) : (
//         <Text style={styles.locationText}>
//           {errorMsg || 'Fetching your location...'}
//         </Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   stepText: {
//     fontSize: 20,
//     marginBottom: 10,
//     fontWeight: 'bold',
//   },
//   map: {
//     width: '100%',
//     height: '70%',
//     marginTop: 10,
//   },
//   locationText: {
//     fontSize: 16,
//     marginTop: 20,
//     color: 'gray',
//   },
// });



// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import PedometerComponent from './components/steps';
// import MapComponent from './components/maps';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       {/* Step Counter Component */}
//       <PedometerComponent />

//       {/* Map Component */}
//       <MapComponent />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });


// import React, { useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import PedometerComponent from './components/steps';
// import MapComponent from './components/maps';

// export default function App() {
//   const [stepCount, setStepCount] = useState(0);

//   return (
//     <View style={styles.container}>
//       {/* Step Counter Component */}
//       <PedometerComponent setStepCount={setStepCount} />

//       {/* Map Component */}
//       <MapComponent stepCount={stepCount} />
      
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });


import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SettingsComponent from './screens/Settings';
import { Ionicons } from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsComponent} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
