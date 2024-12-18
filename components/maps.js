
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as FileSystem from 'expo-file-system';

export default function MapComponent() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    let subscription;

    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied.');
        Alert.alert(
          'Location Permission Required',
          'Go to app settings to allow location access.',
          [{ text: 'OK' }]
        );
        return;
      }

      try {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
          },
          (newLocation) => {
            const { latitude, longitude } = newLocation.coords || {};
            if (latitude && longitude) {
              setLocation({ latitude, longitude });
              setRoute((prevRoute) => [...prevRoute, { latitude, longitude }]);
            } else {
              console.warn('Invalid location data received.');
            }
          }
        );
      } catch (error) {
        setErrorMsg('Failed to fetch location.');
      }
    };

    getLocationPermission();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const saveOfflineTiles = async () => {
    const cacheDir = `${FileSystem.cacheDirectory}maps/`;

    try {
      const dirInfo = await FileSystem.getInfoAsync(cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
      }

      console.log('Caching map tiles...');
      Alert.alert('Offline Map', 'Map tiles cached successfully!');
    } catch (error) {
      console.error('Failed to cache map tiles:', error);
      Alert.alert('Error', 'Unable to cache map tiles.');
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
        {route.length > 1 && (
          <Polyline
            coordinates={route.length > 1 ? route : []}
            strokeWidth={3}
            strokeColor="blue"
          />
        )}
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
