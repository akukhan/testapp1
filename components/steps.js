
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import db from '../db'; // Import your database file
import LinearAccelerationComponent from './accl'

export default function PedometerComponent() {
  const [stepCount, setStepCount] = useState(0);
  const [activity, setActivity] = useState("Walking");
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const initializeDatabase = async () => {
      await db.initilizeDb();
    };
    initializeDatabase();

    let pedometerSubscription;
    let prevStepCount = 0;

    const subscribeToPedometer = async () => {
      // Check if Pedometer is available
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Pedometer not available on this device.");
        return;
      }

      // Subscribe to Pedometer
      pedometerSubscription = Pedometer.watchStepCount((result) => {
        console.log("Raw Steps (cumulative):", result.steps);
        // setStepCount((prevSteps) => prevSteps + result.steps);

        // Calculate step difference (delta)
        const stepDelta = result.steps - prevStepCount;
        // Filter: Only increment if stepDelta is 1 or within a reasonable range
        if (stepDelta === 1 || (stepDelta > 0 && stepDelta <= 3)) {
          setStepCount((prevSteps) => prevSteps + stepDelta);

          // Save steps to the database
          console.log("Steps incremented by:", stepDelta);
          // Save steps to the database
          console.log("Steps:", stepCount, "Step increment:", result.steps);
          db.insertSteps(stepDelta).catch((error) => {
            console.error("Error inserting steps:", error);
          });
        } else {
          console.warn('Unrealistic step increment detected:', stepDelta);
        }

        prevStepCount = result.steps;
        
      });
    };

    subscribeToPedometer();

    return () => {
      // Cleanup subscription
      pedometerSubscription && pedometerSubscription.remove();
    };
  }, []);

  return(
    <>
    <Text style={styles.stepText}>Steps Counted: {stepCount}</Text>
    <Text style={styles.activityText}>Current Activity: {activity}</Text>    
    <Text style={styles.speedText}>Speed: {speed.toFixed(2)} km/h</Text>
  
    <LinearAccelerationComponent setActivity={setActivity} setSpeed={setSpeed} />
    </>

  ) 
}

const styles = StyleSheet.create({
  stepText: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  activityText: {
    fontSize: 18,
    marginBottom: 10,
    color: "blue",
  },
  speedText: {
    fontSize: 16,
    marginBottom: 10,
    color: "green",
  },
});
