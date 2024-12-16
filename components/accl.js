import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const LinearAccelerationComponent = () => {
  const [linearAcceleration, setLinearAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [rawAcceleration, setRawAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [gravity, setGravity] = useState({ x: 0, y: 0, z: 0 });

  const ALPHA = 0.8; // Smoothing factor for gravity filtering

  useEffect(() => {
    let subscription;

    const subscribe = () => {
      subscription = Accelerometer.addListener((data) => {
        const { x, y, z } = data;

        // Update raw acceleration
        setRawAcceleration({ x, y, z });

        // Low-pass filter to estimate gravity
        setGravity((prevGravity) => ({
          x: ALPHA * prevGravity.x + (1 - ALPHA) * x,
          y: ALPHA * prevGravity.y + (1 - ALPHA) * y,
          z: ALPHA * prevGravity.z + (1 - ALPHA) * z,
        }));

        // Calculate linear acceleration
        setLinearAcceleration((prevGravity) => ({
          x: x - gravity.x,
          y: y - gravity.y,
          z: z - gravity.z,
        }));
      });
    };

    subscribe();

    return () => {
      subscription && subscription.remove();
    };
  }, [gravity]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Raw Acceleration: X: {rawAcceleration.x.toFixed(2)}, Y: {rawAcceleration.y.toFixed(2)}, Z: {rawAcceleration.z.toFixed(2)}
      </Text>
      <Text style={styles.text}>
        Linear Acceleration: X: {linearAcceleration.x.toFixed(2)}, Y: {linearAcceleration.y.toFixed(2)}, Z: {linearAcceleration.z.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    margin: 10,
  },
});

export default LinearAccelerationComponent;
