import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import db from '../db';

export default function UserProfileComponent() {
  const [nickname, setNickname] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');

  useEffect(() => {

        const initializeDatabase = async () => {
          await db.initilizeDb();
          
        };
        initializeDatabase();
        
    const loadUserProfile = async () => {
      const user = await db.getUserProfile();
      if (user) {
        setNickname(user.nickname);
        setHeight(user.height.toString());
        setWeight(user.weight.toString());
        setBmi(user.bmi.toFixed(2));
      }
    };

    loadUserProfile();
  }, []);

  const calculateBmi = (height, weight) => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100; // Convert cm to meters
      return (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2);
    }
    return '';
  };

  const saveProfile = async () => {
    if (!nickname || !height || !weight) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const updatedBmi = calculateBmi(height, weight);
    setBmi(updatedBmi);

    const user = {
      nickname,
      height: parseFloat(height),
      weight: parseFloat(weight),
      bmi: parseFloat(updatedBmi),
    };

    await db.insertOrUpdateUser(user);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <Text style={styles.label}>Nickname:</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="Enter your nickname"
      />

      <Text style={styles.label}>Height (cm):</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={(value) => setHeight(value)}
        keyboardType="numeric"
        placeholder="Enter your height in cm"
      />

      <Text style={styles.label}>Weight (kg):</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={(value) => setWeight(value)}
        keyboardType="numeric"
        placeholder="Enter your weight in kg"
      />

      <Text style={styles.label}>BMI:</Text>
      <Text style={styles.bmiText}>{bmi || 'Not calculated yet'}</Text>

      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  bmiText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
