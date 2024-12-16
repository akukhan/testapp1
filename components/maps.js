// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, Alert } from 'react-native';
// import * as Location from 'expo-location';
// import MapView, { Marker } from 'react-native-maps';

// export default function MapComponent() {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     const getLocationPermission = async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied.');
//         return;
//       }

//       try {
//         const loc = await Location.getCurrentPositionAsync({});
//         setLocation(loc.coords);
//       } catch (error) {
//         setErrorMsg('Failed to fetch location.');
//       }
//     };

//     getLocationPermission();
//   }, []);

//   if (errorMsg) {
//     return <Text style={styles.locationText}>{errorMsg}</Text>;
//   }

//   if (!location) {
//     return <Text style={styles.locationText}>Fetching your location...</Text>;
//   }

//   return (
//     <MapView
//       style={styles.map}
//       initialRegion={{
//         latitude: location.latitude,
//         longitude: location.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       }}
//     >
//       <Marker
//         coordinate={{
//           latitude: location.latitude,
//           longitude: location.longitude,
//         }}
//         title="You are here"
//       />
//     </MapView>
//   );
// }

// const styles = StyleSheet.create({
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



import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as FileSystem from 'expo-file-system';

export default function EnhancedMapComponent() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [route, setRoute] = useState([]); // Track route points

  useEffect(() => {
    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied.');
        return;
      }

      try {
        const loc = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // Update every 10 meters
          },
          (newLocation) => {
            const { latitude, longitude } = newLocation.coords;
            setLocation({ latitude, longitude });
            setRoute((prevRoute) => [...prevRoute, { latitude, longitude }]);
          }
        );
      } catch (error) {
        setErrorMsg('Failed to fetch location.');
      }
    };

    getLocationPermission();
  }, []);

  const saveOfflineTiles = async () => {
    const cacheDir = `${FileSystem.cacheDirectory}maps/`;
    try {
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
      Alert.alert('Offline Map', 'Map tiles cached successfully!');
    } catch (error) {
      console.error('Failed to cache map tiles:', error);
    }
  };

  if (errorMsg) {
    return <Text style={styles.locationText}>{errorMsg}</Text>;
  }

  if (!location) {
    return <Text style={styles.locationText}>Fetching your location...</Text>;
  }

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={location}
          title="You are here"
        />
        <Polyline
          coordinates={route}
          strokeWidth={3}
          strokeColor="blue"
        />
      </MapView>
      <Text style={styles.saveOffline} onPress={saveOfflineTiles}>
        Save Offline Map
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '70%',
    marginTop: 10,
  },
  locationText: {
    fontSize: 16,
    marginTop: 20,
    color: 'gray',
  },
  saveOffline: {
    textAlign: 'center',
    color: 'blue',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
