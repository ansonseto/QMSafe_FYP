import React,{useLayoutEffect,useState,useEffect} from 'react'
import {Button, TouchableOpacity, Pressable, StyleSheet, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import GetLocation from 'react-native-get-location';
import { Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const ViewClassStudentScreen = ({route, navigation})=> {
  const { id, year, title, code, location, type, starttime, endtime, organisor,day,selectedday,selecteddate} = route.params
  const user = auth().currentUser 
  const startT = new Date( starttime.seconds * 1000 + starttime.nanoseconds / 1000, ).toLocaleTimeString() //class start time
  const endT = new Date( endtime.seconds * 1000 + endtime.nanoseconds / 1000, ).toLocaleTimeString() // class end time

  useLayoutEffect(()=>{
    navigation.setOptions({
      title:"Attendance Page",
      headerRight:()=>(
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
      )
    })
  },[navigation]) 

  //Fetch user's selected date class details by matching their academic year, class title and selected date
  const [attendanceStatus, setAtttendanceStatus] = useState([])
  useLayoutEffect(() => {
    const unsubscribe = 
    firestore()
    .collection(year)
    .doc(title)
    .collection(selecteddate)
    .onSnapshot(snapshot => (
      setAtttendanceStatus(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      )
    )
    setAtttendanceStatus(attendanceStatus) 
    return unsubscribe
  } ,[])
 
  //Get studnets geolocation
  const [studentlat, setStudentLat] = useState()
  const [studentlong, setStudentLong] = useState()
  useEffect(()=>{
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 15000,
    })
    .then(location => {
      setStudentLat(location.latitude)
      setStudentLong(location.longitude)
      console.log(user.displayName + ' location: ' + location.latitude +','+location.longitude)
    })
    .catch(error => {
      const { code, message } = error;
    })
    // Geolocation.watchPosition(position => {
    //   const lastPosition = JSON.stringify(position);
    //   console.log(lastPosition)
    // })
  })

  //Set state of current class's location (i.e., lecturers location acting as the beacon)
  //set state of student's entered and left class time 
  //set state of class range that set by lecturer for attendance range
  const [status, setStatus] = useState()
  const [classstart, setClassStart] = useState()
  const [classend, setClassEnd] = useState()
  const [classlat, setClassLat] = useState()
  const [classlong, setClassLong] = useState()
  const [classrange, setClassRange] = useState()
  const [studentEnter, setStudentEnter] = useState([])
  const [studentLeft, setStudentLeft] = useState([])
  useEffect(()=>{
    {attendanceStatus.map(({id, data:{status, start, end, enter, left, latitude, longitude, classrange}})=>(
      <>
      {id===organisor
      ?(setStatus(status),
      setClassLat(latitude),
      setClassLong(longitude),
      setClassStart(start),
      setClassEnd(end),
      setClassRange(classrange))
      :id===user.displayName
      ?(setStudentEnter(enter),setStudentLeft(left))
      :null}
      </>
    ))}
  })

  //Calculate distnace between the beacon (i.e. lecturer) and students
  // Source code: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  const [distance, setDistance] = useState() 
  useEffect(()=>{
    var R = 6371; // km
    var dLat = (studentlat-classlat)* Math.PI / 180;
    var dLon = (studentlong-classlong)* Math.PI / 180;
    var lat1 = (classlat)* Math.PI / 180;
    var lat2 = (studentlong)* Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    setDistance(d*1000) // km * 1000 = meters
  })

  //Start scanning student geolocation when they first entered the class for reigsteration 
  //only sign user in if they are within the class range that set by the lecturer at the start of class
  //otherwise they will be marked as absent 
  const [isStartScanning, setStartScanning] = useState(false);
  const [entertime, setStatetime] = useState()
  const startScan = () => {
    setStartScanning(true)
    if(!isStartScanning){
      console.log('start session') 
      console.log(distance)
      if(distance<=classrange || distance==0){
        firestore()
        .collection(year)
        .doc(title)
        .collection(selecteddate)
        .doc(user.displayName)
        .set({
          name: user.displayName,
          enteredAt: moment().format('HH:mm a'),
          leftAt: null,
          enter: new Date().getTime(),
          studentlat: studentlat,
          studentlong: studentlong,
        })
        setStatetime(new Date().getTime())
        Alert.alert('Welcome! Make sure you log yourself again before you leave!')
      }else{
        Alert.alert('You are not in the classroom')
      }  
    }  
  }

  //Scanning students geolocation again when they leave the classroom 
  //check if they still wihtin the class range and update their duration time into the cloud firestore 
  const [isEndScanning, setEndScanning] = useState(false);
  const [lefttime , setLeftTime] = useState()
  const endScan=()=>{
    if(!isEndScanning){
      setEndScanning(true)
      console.log('end session')
      if(distance<=classrange){
        firestore()
        .collection(year)
        .doc(title)
        .collection(selecteddate)
        .doc(user.displayName)
        .update({
          leftAt: moment().format('HH:mm a'),
          left: new Date().getTime(),
          studentlat: studentlat,
          studentlong: studentlong,
        }),
         //Also store their full attendnace record onto collection 'Date' for use in self-isolation notification function 
        firestore()
        .collection('Date')
        .add({
            displayName: user.displayName,
            enterAt: entertime,
            leftAt: new Date().getTime(),
            latitude: classlong,
            longitude: classlong,
            selecteddate:selecteddate,
            attendancetitle: title,
            year: year
        })
        Alert.alert('Successfully registered!')
      }else{
        Alert.alert('You are not in the classroom')
      }
    }
  }
  //calculate duration time that student attended the class (in terms of percentage)
  const [attendpercentage, setPercentage] = useState()
  useEffect(()=>{
    var dClass = classend-classstart //duration time of class
    var dStudent = studentLeft - studentEnter //duration time studnet stayed in class
    percentage = (dStudent/dClass)*100 //percentage of student duration over class duration
    setPercentage(percentage)
    // console.log('Your percentage duration time over class duartion: '+ percentage)
    {percentage<=40 //set studnet as absent if their percentage is less than or equal to 40%, then update firestore record
      ?firestore()
      .collection(year)
      .doc(title)
      .collection(selecteddate)
      .doc(user.displayName)
      .update({
        attend: 'Absent'
      })
      .catch(error => {
        const { code, message } = error;
      })
      :percentage>40 //set studnets as present if their percentage is more than or equal to 40%, then update firestore record
      ?firestore()
      .collection(year)
      .doc(title)
      .collection(selecteddate)
      .doc(user.displayName)
      .update({
        attend: 'Present'
      })
      .catch(error => {
        const { code, message } = error;
      })
    :null}
  })

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Home')} 
        activeOpacity ={0.5}
      >
        <Text h1 style={styles.h1}>QMSafe</Text>
      </TouchableOpacity>
      <Text style={styles.textcss}>Attendance</Text>
          <View key={id}>
            <Text style={styles.datacss}>
            {/* {selecteddate===moment() //check if the selected class is today's class
            ?<> */}
            {status==='Class ended' 
            ?<><Text style={{fontWeight:"bold",}}></Text><Text style={{color: 'red',}}>{status}</Text></> //show status of class in red if it's ended, so user can't take register anymore
            :status==='Class started' 
            ?<>
              <Text style={{fontWeight:"bold",}}></Text><Text style={{color: 'green',}}>{status}{'\n'}</Text>
              <View style={{flexDirection:'row'}}>
              <Button 
                title={(!isStartScanning ? 'Enter' : '')} //studnet press 'Enter' to start the reigstration 
                onPress={()=>startScan()} 
              /> 
              <Button 
                title={(!isEndScanning ? 'Leave' : '')} // student press 'Leave' before they leave the classroom after class for complete registeration
                onPress={()=>endScan()} 
              /> 
              </View>
            </>
            :null}
            {/* </>
            :null} */}
            </Text>
          </View>
          {/* Print out current class details  */}
          <View style={styles.detailcss}> 
            <Text style={styles.titlecss}>{title}</Text>
            <Text style={styles.datacss}>{type}</Text>
            <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Code: </Text><Text>{code}</Text></Text>
            <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Date: </Text><Text>{selecteddate}</Text></Text>
            <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Day of week: </Text><Text>{selectedday}</Text></Text>
            <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Duration:</Text><Text>{startT} - {endT}</Text></Text>
            <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Location: </Text><Text>{location}</Text></Text>
            <Text >{'\n'}</Text>
            {attendanceStatus.map(({ id, data:{enteredAt, leftAt, enter, left}}) => ( 
              <View key={id}>
                {id===user.displayName // check if the mapping attendance record mathces current user's
                ?<>
                  <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Status: </Text>
                  <Text>
                    {/* Only show attendnace status after the class ended */}
                    {attendpercentage<=40 //set attendance status as 'Poor' if current student attended less than 40% of the duration time 
                    ?<><Text style={{fontWeight:"bold",}}></Text><Text style={{color: 'red',}}>Poor</Text></>
                    :(attendpercentage<=70 // set attendnace status as 'Good' if current student attended between 41%-80% of the duration time 
                    ?<><Text style={{fontWeight:"bold",}}></Text><Text style={{color: 'orange',}}>Good</Text></>
                    :(attendpercentage>70 //set attendance status as 'Excellent' if current student attended for more than 80% of the duration time 
                    ?<><Text style={{fontWeight:"bold",}}></Text><Text style={{color: 'green',}}>Excellent</Text></>
                    :<><Text style={{fontWeight:"bold",}}></Text><Text style={{color: 'grey',}}>Class Not finished yet</Text></>))} 
                  </Text>
                  </Text>
                  {/* Show curretn studnet attendance details as in what time they entered and left the classroom, also displaying their duration time  */}
                  <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Enetered At: </Text><Text>{enteredAt}</Text></Text>
                  <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Left At: </Text><Text>{leftAt}</Text></Text>
                  <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Your duration: </Text><Text>{new Date(left-enter).getHours()}hr {new Date(left-enter).getMinutes()} minutes</Text></Text>
                </>
                :null}
              </View>
            ))}
        </View>
    </View>
  )
}

export default ViewClassStudentScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#e6f2ff",
    alignItems: 'center', 
    justifyContent: 'flex-start'
  },
  detailcss:{
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor:"#003e80",
    borderWidth:2,
    padding:25,
    width:300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  h1:{
    paddingTop:50,
    fontSize:60,
    color:'#003e80',
    fontWeight: 'bold',
    textAlign:"center",
  },
  textcss:{
    fontSize:30,
    fontWeight:"bold",
    textDecorationLine: 'underline',
    color:'#003e80',
    marginBottom:20,
    textAlign:"center"
  },
  titlecss:{
    fontSize:18,
    fontWeight:"bold",
    fontStyle:"italic",
    textDecorationLine: 'underline',
    paddingBottom:5
  },
  datacss:{
    paddingBottom:5,
  },
  button: {
    borderRadius: 10,
    padding: 8,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#556B2F",
  },
});