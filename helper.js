const calculateCalories = (steps, weight) => {
    const MET = 3.5; // Walking MET value
    const stepLengthInMeters = 0.415 * height; // Step length as a fraction of height
    const distanceInMeters = steps * stepLengthInMeters;
    const caloriesBurned = (MET * 3.5 * weight * distanceInMeters / 200) / 1000; 
    return caloriesBurned;
  };
  
  useEffect(() => {
    const weight = 70; // Replace with value from database
    const height = 175; // Replace with value from database
  
    const distance = steps * 0.415 * (height / 100); // Distance in km
    const calories = calculateCalories(steps, weight);
  
    // Save steps, distance, and calories
    db.insertSteps(steps, distance, calories);
  }, [steps]);
  