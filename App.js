import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './src/screens/Welcome';
import Login from './src/screens/Login';
import Maps from './src/screens/Maps';
import Student from './src/screens/Student';
import Carro from './src/screens/Carro';
import Conductor from './src/screens/Conductor';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator();


export default function App() {
  return (
  
        <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="maps" component={Maps} 
        options={
          {
            headerShown:false
          }
        }/>
        {/*<Stack.Screen name="welcome" component={Welcome}
        options={
          {
            headerShown:false
          }
        } />*/}
        <Stack.Screen name="login" component={Login} 
        options={
          {
            headerShown:false
          }
        }/>
        <Stack.Screen name="student" component={Student} 
        options={
          {
            headerShown:false
          }
        }/>
         <Stack.Screen name="carro" component={Carro} 
        options={
          {
            headerShown:false
          }
        }/>
         <Stack.Screen name="conductor" component={Conductor} 
        options={
          {
            headerShown:false
          }
        }/>
      </Stack.Navigator>
    </NavigationContainer>

  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
