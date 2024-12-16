// import React, { useState, useEffect } from 'react';
// import { Text, StyleSheet, Alert } from 'react-native';
// import { Pedometer } from 'expo-sensors';
// import db from '../db'; // Import your database file

// export default function PedometerComponent() {
//   const [stepCount, setStepCount] = useState(0);

//   useEffect(() => {
//     const initializeDatabase = async () => {
//         await db.initilizeDb();
//       };

//       initializeDatabase();


//     let subscription;

//     const subscribeToPedometer = async () => {
//       const isAvailable = await Pedometer.isAvailableAsync();
//       if (!isAvailable) {
//         Alert.alert('Pedometer not available on this device.');
//         return;
//       }

//       subscription = Pedometer.watchStepCount((result) => {
//         setStepCount((prevSteps) => prevSteps + result.steps);

//         // Save steps to the database
//         db.insertSteps(result.steps).catch((error) => {
//           console.error('Error inserting steps:', error);
//         });
//       });
//     };

//     subscribeToPedometer();

//     return () => {
//       subscription && subscription.remove();
//     };
//   }, []);

//   return <Text style={styles.stepText}>Steps Counted: {stepCount}</Text>;
// }

// const styles = StyleSheet.create({
//   stepText: {
//     fontSize: 20,
//     marginBottom: 10,
//     fontWeight: 'bold',
//   },
// });





// import React, { useState, useEffect } from 'react';
// import { Text, StyleSheet, Alert } from 'react-native';
// import { Pedometer, Accelerometer, DeviceMotion } from 'expo-sensors';
// import db from '../db'; // Import your database file


// const AVERAGE_STEP_LENGTH = 0.762;
// export default function PedometerComponent() {
//   const [stepCount, setStepCount] = useState(0);
//   const [isWalking, setIsWalking] = useState(false);

//   useEffect(() => {
//     const initializeDatabase = async () => {
//       await db.initilizeDb();
//     };
//     initializeDatabase();

//     let pedometerSubscription;
//     let accelerometerSubscription;
//     let deviceMotionSubscription;

//     const subscribeToSensors = async () => {
//       // Check if Pedometer is available
//       const isAvailable = await Pedometer.isAvailableAsync();
//       if (!isAvailable) {
//         Alert.alert('Pedometer not available on this device.');
//         return;
//       }

//       // Subscribe to Pedometer
//       pedometerSubscription = Pedometer.watchStepCount((result) => {
//         if (isWalking) {
//           setStepCount((prevSteps) => prevSteps + result.steps);

//           // Save steps to the database
//           console.log(stepCount)
//           db.insertSteps(result.steps).catch((error) => {
//             console.error('Error inserting steps:', error);
//           });
//         }
//       });

//       // Subscribe to Accelerometer
//       accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
//         const accelerationMagnitude = Math.sqrt(x * x + y * y + z * z);
//         if (accelerationMagnitude > 4 && accelerationMagnitude < 6) {
//           setIsWalking(true);
//         } else {
//           setIsWalking(false);
//         }
//       });

//       // Subscribe to Device Motion
//       deviceMotionSubscription = DeviceMotion.addListener(({ acceleration }) => {
//         const { x, y, z } = acceleration;
//         const motionMagnitude = Math.sqrt(x * x + y * y + z * z);
//         if (motionMagnitude > 9) {
//           setIsWalking(true);
//         }
//       });
//     };

//     subscribeToSensors();

//     return () => {
//       pedometerSubscription && pedometerSubscription.remove();
//       accelerometerSubscription && accelerometerSubscription.remove();
//       deviceMotionSubscription && deviceMotionSubscription.remove();
//     };
//   }, [isWalking]);

//   return <Text style={styles.stepText}>Steps Counted: {stepCount}</Text>;
// }

// const styles = StyleSheet.create({
//   stepText: {
//     fontSize: 20,
//     marginBottom: 10,
//     fontWeight: 'bold',
//   },
// });


// import React, { useState, useEffect } from 'react';
// import { Text, StyleSheet, Alert } from 'react-native';
// import { Pedometer, Accelerometer, DeviceMotion } from 'expo-sensors';
// import db from '../db'; // Import your database file



// const applyLowPassFilter = (alpha, prevValue, newValue) => {
//   return alpha * newValue + (1 - alpha) * prevValue;
// };

// export default function PedometerComponent() {
//   const [stepCount, setStepCount] = useState(0);
//   const [isWalking, setIsWalking] = useState(false);

//   useEffect(() => {
//     const initializeDatabase = async () => {
//       await db.initilizeDb();
//     };
//     initializeDatabase();

//     let pedometerSubscription;
//     let accelerometerSubscription;
//     let deviceMotionSubscription;

//     const subscribeToSensors = async () => {
      
//       // Check if Pedometer is available
//       const isAvailable = await Pedometer.isAvailableAsync();
//       if (!isAvailable) {
//         Alert.alert('Pedometer not available on this device.');
//         return;
//       }
//       let lastStepTime = Date.now();
//       // Subscribe to Pedometer
//       pedometerSubscription = Pedometer.watchStepCount((result) => {
//         if (isWalking) {
//           const currentTime = Date.now();
//           if(currentTime - lastStepTime > 500) {
//           setStepCount((prevSteps) => prevSteps + result.steps);
//           lastStepTime = currentTime;
//           // Save steps to the database
//           console.log('Steps:', stepCount,"step increment:", result.steps);
//           db.insertSteps(result.steps).catch((error) => {
//             console.error('Error inserting steps:', error);
//           });
//         }
//         }
//       });


//       let prevAccelerationMagnitude = 0;
//       // Subscribe to Accelerometer
//       accelerometerSubscription = Accelerometer.addListener((data) => {

      


//         if (data && data.x !== undefined && data.y !== undefined && data.z !== undefined) {
//           const { x, y, z } = data;
//           const rawMagnitude  = Math.sqrt(x * x + y * y + z * z);

          
//           const filteredMagnitude = applyLowPassFilter(0.2, prevAccelerationMagnitude, rawMagnitude);
//           prevAccelerationMagnitude = filteredMagnitude;

          
//           // console.log("Raw Magnitude:", rawMagnitude);
//           // console.log("Filtered Magnitude:", filteredMagnitude);
//           // Detect walking pattern
//           if (filteredMagnitude  > 1.6 && filteredMagnitude < 2) {
            
//             console.log("this is the walking", Math.sqrt(x * x + y * y + z * z))
//             setIsWalking(true);
            
//           } else if(filteredMagnitude < 1.2) {
//             // console.log('not moving')
//             setIsWalking(false);
//           }
//         }
//       });

//       // Subscribe to Device Motion
//       deviceMotionSubscription = DeviceMotion.addListener((data) => {
//         if (data && data.acceleration) {
//           const { x, y, z } = data.acceleration;
//           if (x !== undefined && y !== undefined && z !== undefined) {
//             const motionMagnitude = Math.sqrt(x * x + y * y + z * z);

//             // Detect heavy motion
//             if (motionMagnitude > 9) {
//               setIsWalking(true);
//             }
//           }
//         }
//       });
//     };

//     subscribeToSensors();

//     return () => {
//       // Cleanup subscriptions
//       pedometerSubscription && pedometerSubscription.remove();
//       accelerometerSubscription && accelerometerSubscription.remove();
//       deviceMotionSubscription && deviceMotionSubscription.remove();
//     };
//   }, [isWalking]);

//   return <Text style={styles.stepText}>Steps Counted: {stepCount}</Text>;
// }

// const styles = StyleSheet.create({
//   stepText: {
//     fontSize: 20,
//     marginBottom: 10,
//     fontWeight: 'bold',
//   },
// });



import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import db from '../db'; // Import your database file
import LinearAccelerationComponent from './accl'

export default function PedometerComponent() {
  const [stepCount, setStepCount] = useState(0);

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
    <LinearAccelerationComponent />
    </>

  ) 
}

const styles = StyleSheet.create({
  stepText: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});
