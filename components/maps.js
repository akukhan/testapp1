
import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView  } from 'react-native';
import WebView from 'react-native-webview';
import * as Location from 'expo-location';

export default function MapComponent() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [path, setPath] = useState([]);

  useEffect(() => {
    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied.');
        Alert.alert('Location Permission Required', 'Go to app settings to allow location access.', [{ text: 'OK' }]);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      console.log(loc.coords)
      const { latitude, longitude } = loc.coords;
      setLocation({ latitude, longitude });
    };

    getLocationPermission();

    const locationSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        // timeInterval:5,
        distanceInterval: 20,
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        setLocation({ latitude, longitude });
       
        setPath((prevPath) => [...prevPath, { latitude, longitude }]); // Add new point to the path
      }
    );

    return () => locationSubscription.then((sub) => sub.remove());

  }, []);

  const leafletHtml = useMemo(() => {
    if (!location) {
      // If location is null, return a blank HTML page
      return `
        <!DOCTYPE html>
        <html>
          <body style="background-color: #525b0d;">
            <h3 style="text-align: center; padding-top: 20px;">Loading Map...</h3>
          </body>
        </html>
      `;
    }
// Convert path coordinates into a format Leaflet Polyline understands
    const polylineCoordinates  = path.map((coord) =>`[${coord.latitude}, ${coord.longitude}]`).join(',')
    console.log("from polyline coordinate", polylineCoordinates, polylineCoordinates.length)
    // Generate the Leaflet map HTML when location is available
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
         <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
          <style>
            #map { height: 100%; width: 100%; position: absolute; }
            html, body { height: 100%; margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const map = L.map('map').setView([${location.latitude}, ${location.longitude}], 19);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 25, }).addTo(map);
            const marker = L.marker([${location.latitude}, ${location.longitude}]).addTo(map);
            marker.bindPopup("You are here").openPopup();

            // Add polyline to the map
            const polyline = L.polyline([${polylineCoordinates}], { color: 'blue' }).addTo(map);

            // Zoom the map to fit the polyline
            if (polyline.getBounds().isValid()) {
                map.fitBounds(polyline.getBounds(), {
                  maxZoom: 21, // Maximum zoom level
                });
              }
          </script>
        </body>
      </html>
    `;
  }, [location, path]);

  if (errorMsg) {
    return <Text style={styles.errorText}>{errorMsg}</Text>;
  }

  return (
    <View style={styles.container}>
      <WebView
         style={styles.map}
         originWhitelist={['*']}
         javaScriptEnabled
         allowsInlineMediaPlayback
         source={{ html: leafletHtml }}
         />
       
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#00ff55' 
  },
  map: {
    flex: 1,
  },
  errorText: { textAlign: 'center', marginTop: 20, color: 'red' },
  loadingText: { textAlign: 'center', marginTop: 20, color: 'gray' },
});
