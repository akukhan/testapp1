import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsComponent() {
  const [nickname, setNickname] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    // Load stored data on component mount
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) {
          const { nickname, height, weight, age } = JSON.parse(savedData);
          setNickname(nickname || '');
          setHeight(height || '');
          setWeight(weight || '');
          setAge(age || '');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load data.');
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    if (!nickname || !height || !weight || !age) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const bmi = (parseFloat(weight) / (heightInMeters ** 2)).toFixed(2);

    const userData = { nickname, height, weight, age, bmi };

    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      Alert.alert('Saved', `Your data has been saved. BMI: ${bmi}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nickname:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your nickname"
        value={nickname}
        onChangeText={setNickname}
      />

      <Text style={styles.label}>Height (cm):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your height in cm"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <Text style={styles.label}>Weight (kg):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your weight in kg"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
});
