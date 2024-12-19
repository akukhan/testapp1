import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PedometerComponent from '../components/steps';
import MapComponent from '../components/maps';

export default function HomeScreen() {
  const [stepCount, setStepCount] = useState(0);

  return (
    <View style={styles.container}>
      {/* Step Counter Component */}
      <View style={styles.stepSection}>
      <PedometerComponent setStepCount={setStepCount} />

      </View>

      {/* Map Component */}
     
      <MapComponent stepCount={stepCount} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },
  stepSection: {
    height: 200,
    justifyContent: 'center', // Centers content vertically in the step section
    alignItems: 'center', // Centers content horizontally
    backgroundColor: '#49a3ca', // Optional: Add a background color for visual distinction
    
  },
});
