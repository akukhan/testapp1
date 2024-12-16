import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PedometerComponent from '../components/steps';
import MapComponent from '../components/maps';

export default function HomeScreen() {
  const [stepCount, setStepCount] = useState(0);

  return (
    <View style={styles.container}>
      {/* Step Counter Component */}
      <PedometerComponent setStepCount={setStepCount} />

      {/* Map Component */}
      <MapComponent stepCount={stepCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
