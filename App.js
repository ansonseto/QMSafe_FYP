import React, {useState, useLayoutEffect} from 'react';
import {StyleSheet,View,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import { InAppNotificationProvider } from 'react-native-in-app-notification';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import EditFindUserScreen from './screens/EditFindUserScreen';
import FindUserScreen from './screens/FindUserScreen';
import ContactTracingScreen from './screens/ContactTracingScreen';
import AddReportScreen from './screens/AddReportScreen';
import AdminAttendanceScreen from './screens/AdminAttendanceScreen';
import StudentAttendanceScreen from './screens/StudentAttendanceScreen';
import LecturerAttendanceScreen from './screens/LecturerAttendanceScreen';
import CreateClassScreen from './screens/CreateClassScreen';
import ViewClassScreen from './screens/ViewClassScreen';
import ViewClassStudentScreen from './screens/ViewClassStudentScreen';
import AttendanceReportScreen from './screens/AttendanceReportScreen';
import EditClassScreen from './screens/EditClassScreen';
import NotificationScreen from './screens/NotificationScreen';
import BLEScreen from './screens/BLEScreen';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

const App = () => {
  const [timetable, setTimetable] = useState([])
    useLayoutEffect(() => {
      const unsubscribe = 
      firestore()
      .collection('timetable')
      // .orderBy('starttime','asc')
      .onSnapshot(snapshot => (
        setTimetable(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          })))
        )
      )
      return unsubscribe
    } ,[])

  return (
    <InAppNotificationProvider>
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="blescreen" component={BLEScreen}/>
        <Stack.Screen name="notification" component={NotificationScreen}/>
        <Stack.Screen name="userProfile" component={ProfileScreen}/>
        <Stack.Screen name="editProfile" component={EditProfileScreen}/>
        <Stack.Screen name="editUser" component={EditFindUserScreen}/>
        <Stack.Screen name="findProfile" component={FindUserScreen}/>
        <Stack.Screen name="ContactTracing" component={ContactTracingScreen}/>
        <Stack.Screen name="addReport" component={AddReportScreen}/>
        <Stack.Screen name="adminattendance" 
          component={AdminAttendanceScreen}
          options={({ navigation, route }) => ({
            headerTitle: 'Timetable',
            headerRight: () => (
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginRight:20
              }}>
                <TouchableOpacity 
                  onPress={()=>navigation.navigate("createClass")} 
                  activeOpacity={0.5}
                  style={{paddingRight:10}}
                >
                  <MaterialIcons name="note-add" size={30} color={"#4682B4"}/> 
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('userProfile')} 
                  activeOpacity ={0.5}
                >
                  <FontAwesome name="user-circle" size={30} color={"#003e80"}/> 
                </TouchableOpacity> 
              </View> 
            ),
          })}
          />
        <Stack.Screen name="studentattendance" 
          component={StudentAttendanceScreen}
          options={({ navigation, route }) => ({
            headerTitle: 'Timetable',
            headerRight: () => (
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginRight:20
              }}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('userProfile')} 
                  activeOpacity ={0.5}
                >
                  <FontAwesome name="user-circle" size={30} color={"#003e80"}/> 
                </TouchableOpacity> 
              </View>
            ),
          })}
        />
        <Stack.Screen name="lecturerattendance"
          component={LecturerAttendanceScreen}
          options={({ navigation, route }) => ({
            headerTitle: 'Timetable',
            headerRight: () => (
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginRight:20
              }}>
                <TouchableOpacity 
                  style={{paddingRight:10}}
                  onPress={() => navigation.navigate('userProfile')} 
                  activeOpacity ={0.5}
                >
                  <FontAwesome name="user-circle" size={30} color={"#003e80"}/> 
                </TouchableOpacity> 
              </View> 
            ),
          })}
        />
        <Stack.Screen name="createClass" component={CreateClassScreen}/>
        <Stack.Screen name="viewClass" component={ViewClassScreen}/>
        <Stack.Screen name="viewClassStudent" component={ViewClassStudentScreen}/>
        <Stack.Screen name="attendanceReport" component={AttendanceReportScreen}/>
        <Stack.Screen name="editClass" component={EditClassScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
    </InAppNotificationProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#e6f2ff",
    alignItems: 'center', 
    justifyContent: 'center',
  },
  titlecss:{
    paddingTop:50,
    fontSize:60,
    color:'#003e80',
    fontWeight: 'bold',
    marginBottom:20,
  },
  button:{
    width:200,
    marginTop:10,
  },
});

