
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Alert, ScrollView, View, TextInput, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import db from '../db'; // Import your database file
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"; // For icons
import LinearAccelerationComponent from './accl'

export default function PedometerComponent() {
  const [stepCount, setStepCount] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000); // Default goal
  const [distance, setDistance] = useState(0); // Distance in km
  const [calories, setCalories] = useState(0); // Calories burned
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [activity, setActivity] = useState("Walking");
  const [speed, setSpeed] = useState(0);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const initializeDatabase = async () => {
      await db.initilizeDb();
      const today = new Date().toISOString().split("T")[0];
      setCurrentDate(today);

      const todaySteps = await db.getStepsByDate(today);
      setStepCount(todaySteps);
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

        const today = new Date().toISOString().split("T")[0];

        if (today !== currentDate) {
          // Reset step count and update date if the day has changed
          setCurrentDate(today);
          setStepCount(0);
        }

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
          console.warn("Unrealistic step increment detected:", stepDelta);
        }

        prevStepCount = result.steps;
      });
    };

    subscribeToPedometer();

    return () => {
      // Cleanup subscription
      pedometerSubscription && pedometerSubscription.remove();
    };
  }, [currentDate]);

  const calculateDistanceAndCalories = (steps) => {
    const distanceInKm = (steps * 0.0008).toFixed(2); // Assuming average step length = 0.8 meters
    const caloriesBurned = (steps * 0.04).toFixed(2); // Roughly 0.04 calories per step
    setDistance(distanceInKm);
    setCalories(caloriesBurned);
  };

  const saveStepGoal = async (newGoal) => {
    setStepGoal(newGoal);
    await db.saveStepGoal(newGoal); // Save the goal in the database
    setIsEditingGoal(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Step Count, Distance, and Calories */}
      <View style={styles.row}>
        <View style={styles.iconSection}>
          <FontAwesome5 name="walking" size={24} color="black" />
          <Text style={styles.valueText}>{stepCount}</Text>
        </View>

        <View style={styles.iconSection}>
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={24}
            color="black"
          />
          <Text style={styles.valueText}>{distance} km</Text>
        </View>

        <View style={styles.iconSection}>
          <MaterialCommunityIcons name="fire" size={24} color="red" />
          <Text style={styles.valueText}>{calories} kcal</Text>
        </View>
      </View>

      {/* Step Goal */}
      <View style={styles.goalSection}>
        <Text style={styles.goalLabel}>Step Goal:</Text>
        {isEditingGoal ? (
          <View style={styles.editGoalContainer}>
            <TextInput
              style={styles.goalInput}
              value={stepGoal.toString()}
              keyboardType="numeric"
              onChangeText={(text) => setStepGoal(text)}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                saveStepGoal(parseInt(stepGoal));
                setIsEditingGoal(false);
                Alert.alert("Success", "Step goal updated successfully!");
              }}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsEditingGoal(true)}>
            <Text style={styles.goalText}>{stepGoal} steps</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.progressText}>
          Progress: {((stepCount / stepGoal) * 100).toFixed(1)}%
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center", 
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  iconSection: {
    alignItems: "center",
    flex: 1,
  },
  valueText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  goalSection: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  goalText: {
    fontSize: 20,
    color: 'blue',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  editGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: 100,
    padding: 5,
    textAlign: 'center',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 16,
    marginTop: 5,
  },
  
});