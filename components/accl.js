
import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Accelerometer } from "expo-sensors";

const LinearAccelerationComponent = ({ setActivity, setSpeed }) => {
  const [linearAcceleration, setLinearAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [rawAcceleration, setRawAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [gravity, setGravity] = useState({ x: 0, y: 0, z: 0 });

  const ALPHA = 0.8; // Smoothing factor for gravity filtering
  const NOISE_THRESHOLD = 0.1; // Threshold to filter out sensor noise (m/s^2)

  useEffect(() => {
    let subscription;

    const subscribe = () => {
      subscription = Accelerometer.addListener((data) => {
        const { x, y, z } = data;

        // Update raw acceleration
        setRawAcceleration({ x, y, z });
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        // Low-pass filter to estimate gravity
        setGravity((prevGravity) => ({
          x: ALPHA * prevGravity.x + (1 - ALPHA) * x,
          y: ALPHA * prevGravity.y + (1 - ALPHA) * y,
          z: ALPHA * prevGravity.z + (1 - ALPHA) * z,
        }));

        // Calculate linear acceleration
        const linearAcc = {
          x: x - gravity.x,
          y: y - gravity.y,
          z: z - gravity.z,
        };

        // Filter out small values (noise)
        const filteredLinearAcc = {
          x: Math.abs(linearAcc.x) > NOISE_THRESHOLD ? linearAcc.x : 0,
          y: Math.abs(linearAcc.y) > NOISE_THRESHOLD ? linearAcc.y : 0,
          z: Math.abs(linearAcc.z) > NOISE_THRESHOLD ? linearAcc.z : 0,
        };

        setLinearAcceleration(filteredLinearAcc);

        // Calculate total linear acceleration magnitude (ignoring noise)
        const linearMagnitude = Math.sqrt(
          filteredLinearAcc.x ** 2 +
            filteredLinearAcc.y ** 2 +
            filteredLinearAcc.z ** 2
        );

        // Analyze magnitude for activity detection
        if (linearMagnitude >= 1.5 && linearMagnitude < 2.5) {
          setActivity("Walking");
        } else if (linearMagnitude >= 2.5 && linearMagnitude < 6.0) {
          setActivity("Running");
        } else if (linearMagnitude >= 6.0) {
          setActivity("Cycling");
        } else {
          setActivity("Stationary");
        }

        // Set speed based on magnitude (use 0 if below noise threshold)
        const speed = linearMagnitude > NOISE_THRESHOLD ? linearMagnitude * 3.6 : 0;
        setSpeed(speed);
      });
    };

    subscribe();

    return () => {
      subscription && subscription.remove();
    };
  }, [gravity, setActivity, setSpeed]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Raw Acceleration: X: {rawAcceleration.x.toFixed(2)}, Y:{" "}
        {rawAcceleration.y.toFixed(2)}, Z: {rawAcceleration.z.toFixed(2)}
      </Text>
      <Text style={styles.text}>
        Linear Acceleration: X: {linearAcceleration.x.toFixed(2)}, Y:{" "}
        {linearAcceleration.y.toFixed(2)}, Z: {linearAcceleration.z.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  
  },
  text: {
    fontSize: 16,
    margin: 1,
  },
});

export default LinearAccelerationComponent;
