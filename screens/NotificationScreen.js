//Self-isolation notification page 
import React, {useLayoutEffect, useEffect, useState,} from 'react'
import { DeviceEventEmitter,Button,RefreshControl,View, Text, StyleSheet } from 'react-native'
import { ListItem } from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const NotificationScreen = ({navigation}) => {

  const user = auth().currentUser  

  useLayoutEffect(()=>{
    navigation.setOptions({
      title:"Notification", 
      headerRight:()=>(
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
      )
    })
  },[])

  //get current user's year 
  const [userdata, setUser] = useState([])
  const [currentuseryear, setCurrentUserYear] = useState([])
  useEffect(() => {
    const unsubscribe = firestore()
    .collection('users')
    .where('displayName','==',user.displayName)
    .onSnapshot(snapshot => (
      setUser(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      )
    )
    setUser(userdata)
    {userdata.map(({id, data:{year}})=>(
      setCurrentUserYear(year)
    ))}
    return unsubscribe
  } ,[])

  //Check if users been to any classes before
  const [userattend, setUserAttend] = useState([])
  const [attended, setAttended] = useState(false)
  useEffect(() => {
    const unsubscribe = firestore()
    .collection('Date')
    .where('displayName','==',user.displayName)
    .onSnapshot(snapshot => (
      setUserAttend(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      )
    )
    setUserAttend(userattend)
    if(userattend.length==0){ 
      setAttended(true)
    }else{
      setAttended(false)
    }
    return unsubscribe
  } ,[])

  // get report details
  const [report, setReport] = useState([])
  useEffect(() => {
    const unsubscribe = firestore()
    .collection('report')
    .onSnapshot(snapshot => (
      setReport(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        })))
      )
    )
    setReport(report)
    return unsubscribe
  } ,[]) 

  //get all attendnace logs (whoever been to classses no filter yet)
  const [attendance, setAttendance] = useState([])
  useEffect(() => {
    const unsubscribe = firestore()
    .collection('Date')
    .onSnapshot(snapshot => (
      setAttendance(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        })))
      )
    )
    setAttendance(attendance)
    return unsubscribe
  } ,[])


  const [reportstarttime, setReportstarttime] = useState()
  const [reportendtime, setReportendtime] = useState()
  const [reportselecteddate, setReportSelectedDate] = useState()
  const [userstarttime, setUserstarttime] = useState()
  const [userendtime, setUserendtime] = useState()
  const [userattendedclass, setuserAttendedClass] = useState()
  const [userselecteddate, setUserSelectedDate] = useState()
  const [meetbefore, setMeetBefore] = useState(true)
  const [reporter, setReporter] =useState()
  const [student, setStudent] = useState()
  const [studentlat, setStudentLat] = useState()
  const [studentlong, setStudentLong] = useState()
  const [reporterlat, setReporterLat] = useState()
  const [reporterlong, setReporterLong] = useState()
  useEffect(()=>{
    // get all report name 
    {report.map(({data, index})=>(
      <>
      {attendance.map(({id, data:{enterAt, leftAt, displayName, selecteddate, attendancetitle, latitude, longitude}})=>(
      <View key={id}>
        {attendancetitle===userattendedclass && displayName===data.displayName
        ?(setReporter(displayName),
          setReportstarttime(enterAt),
          setReportendtime(leftAt),
          setReportSelectedDate(selecteddate),
          setReporterLat(latitude),
          setReporterLong(longitude)
          )
        :null}
      </View>
    ))}
      </>
    ))}

    //get current user attended details for later comparison  
    {attendance.map(({id, data:{enterAt, leftAt, displayName, selecteddate, attendancetitle, latitude, longitude}})=>(
      <View  key={id}>
        {displayName===user.displayName
        ?(setStudent(displayName),
        setUserstarttime(enterAt),
        setUserendtime(leftAt),
        setUserSelectedDate(selecteddate), 
        setuserAttendedClass(attendancetitle),
        setStudentLat(latitude),
        setStudentLong(longitude)
        )
        :null}
      </View>
    ))}
    
    //check if current user duration time in class overlap with reporter
    // b1             a1           b2          a2
    // reportstart  reportend   userstart    userend   
    if(reportselecteddate===userselecteddate){
      if(reportstarttime>userendtime){
        setMeetBefore(false)
      }
      if(reportendtime<userstarttime){
        setMeetBefore(false)
      } 
      console.log('reporter: ' + reporter)
      console.log('current user: ' + user.displayName)
      console.log('User meeter before? '+ meetbefore)
    }  
  })

  //calculate distance between reporter and current user. then only <2m will get the notification 
  //Source code: https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
  const [distance, setDistance] = useState()
  const [proximity, setProximity] = useState(false)
  useEffect(()=>{
    // console.log('Student location: ' + studentlat + ','+ studentlong)
    // console.log('Reporter location: ' + reporterlat + ','+ reporterlong)
    var R = 6371; // km
    var dLat = (studentlat-reporterlat)* Math.PI / 180;
    var dLon = (studentlong-reporterlong)* Math.PI / 180;
    var lat1 = (reporterlat)* Math.PI / 180;
    var lat2 = (studentlong)* Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    setDistance(d*1000) // km * 1000 = meters 
    // console.log('proximity distnace: ' + distance)
   if(distance<2){  //Close proximity = 2m, so only send notification if users been in close contact 
    setProximity(true)
   }else{
     setProximity(false)
   }
  //  console.log('Is it under 2m proximity? ' + proximity)
  })

  //Refresh page 
  //Source Code: https://reactnative.dev/docs/refreshcontrol
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return(
    <View style={style.container}>
      <Text style={{fontStyle:"italic", color:"#FFA500", padding:10, fontWeight:'800', backgroundColor:'#ffe600'}}>**Please refresh the page to ensure no new notification!</Text>
      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
        {attended==false 
      ?<>
        {report.map(({id, data:{displayName, createdAt,title, description,}})=>(
          <View key={id}>
          {/* only show notification if: 
            1. user attended same class with overlap duration time 
            2. user is not the reporter 
            3. user been in close contact (i.e., under 2 meters) with the reporter */}
            {meetbefore===true && reporter===displayName && reporter!=user.displayName && proximity==true 
            ?
              <ListItem key={id}>
                <ListItem.Content>
                  <ListItem.Title style={{ fontWeight: "800", color:'#003e80'}}>{title}</ListItem.Title>
                  <ListItem.Subtitle style={{fontSize:13, color:'grey', paddingBottom:3}}>{createdAt}</ListItem.Subtitle>
                  <ListItem.Subtitle>{description}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            :null}
          </View>
        ))}
        </>
        :<Text>No new notification</Text>}
      </ScrollView>
    </View>
  )
}

export default NotificationScreen

const style = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#e6f2ff',
  },
})

