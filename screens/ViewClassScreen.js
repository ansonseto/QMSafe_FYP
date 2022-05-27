import React,{useLayoutEffect,useState,useEffect} from 'react'
import {Button,Modal,TouchableOpacity,Pressable,StyleSheet,ScrollView,View,Text} from 'react-native'
import {Input} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import GetLocation from 'react-native-get-location';

const ViewClassScreen = ({route, navigation})=> {
  const { id,year, title, code, location, type, starttime, endtime, organisor,day,selectedday,selecteddate} = route.params
  const user = auth().currentUser
  const startT = new Date( starttime.seconds * 1000 + starttime.nanoseconds / 1000, ).toLocaleTimeString()
  const endT = new Date( endtime.seconds * 1000 + endtime.nanoseconds / 1000, ).toLocaleTimeString()

  const [classlat, setStudentLat] = useState()
  const [classlong, setStudentLong] = useState()
  //Set lecturer as the beacon by taking their geolocation 
  useEffect(()=>{
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 15000,
    })
    .then(location => {
      setStudentLat(location.latitude)
      setStudentLong(location.longitude)
    })
    .catch(error => {
      const { code, message } = error;
    });
  })

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

  //Start scanning lecturer geolocation when they started the session
  //Store class details into cloud firestore, so that can compare location and duration time in ViewClassStudentScreen.js
  const [isScanning, setIsScanning] = useState(false);
  const [start, setStart] = useState()
  const [startAt, setStartAt] = useState()
  const startScan = () => {
    if (!isScanning) {
      console.log('start session')
      setIsScanning(true)
      firestore()
      .collection(year)
      .doc(title)
      .collection(selecteddate)
      .doc(organisor)
      .set({
        organisor: organisor,
        attendancetitle: title,
        selecteddate: selecteddate,
        selectedday:selectedday,
        startAt: moment().format('HH:mm a'),
        start: new Date().getTime(),
        endAt: null,
        latitude: classlat,
        longitude:classlong,
        status: 'Class started',
      }),
      setStart(new Date().getTime())
      setStartAt(moment().format('HH:mm a'))
      setStatus('Class started') //set the class status to 'Class started', so studnets can register themselve as present 
    } 
  } 

  //End class session by updating and storing end class time onto firestore
  const [isEndScanning, setEndScanning] = useState(false);
  const [end, setEnd] = useState()
  const [endAt, setEndAt] = useState()
  const [status, setStatus] = useState()
  const endScan=()=>{
    if(!isEndScanning){
      console.log('end session')
      setEndScanning(true)
      firestore()
      .collection(year)
      .doc(title)
      .collection(selecteddate)
      .doc(organisor)
      .update({
        end: new Date().getTime(),
        endAt: moment().format('HH:mm a'),
        status: 'Class ended',  
      }),
      firestore()
      .collection('Date')
      .add({
          displayName: user.displayName,
          enteredAt: start,
          leftAt:new Date().getTime(),
          latitude: classlat,
          longitude: classlong,
          attendancetitle: title,
          selecteddate:selecteddate,
      })
      setEnd(new Date().getTime())
      setEndAt(moment().format('HH:mm a'))
      setStatus('Class ended') //change class status to 'Class ended', so studnets can't register anymore
    }
  }
  
   //Fetch selected date class details by matching their academic year, class title and selected date
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

  //update firestore record by adding the class range set by lecturer at the start of class
  const [modalVisible, setModalVisible] = useState(false)
  const [input, setInput] = useState()
  const createRange=()=>{
    firestore()
      .collection(year)
      .doc(title)
      .collection(selecteddate)
      .doc(organisor)
      .set({
        organisor: organisor,
        attendancetitle: title,
        selecteddate: selecteddate,
        selectedday:selectedday,
        startAt: startAt,
        start: start,
        endAt: endAt,
        end:end,
        latitude: classlat,
        longitude:classlong,
        status: status,
        classrange: input
      })
  }


  return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* 
          Modal - allow lecturer/ admin to set the class range, so they act as the beacon in the class for taking attendnace
          source code : https://reactnative.dev/docs/modal 
        */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Set Class Range</Text>
              <Input
                  placeholder={'unit as meters...'}
                  value={input} 
                  onChangeText={(text) => setInput(text)}
                  onSubmitEditing={createRange}
              />
              <Button disabled={!title} onPress={createRange} title="Set Now" />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')} 
          activeOpacity ={0.5}
        >
          <Text h1 style={styles.h1}>QMSafe</Text>
        </TouchableOpacity>
        <Text style={styles.textcss}>Attendance</Text>
        <View style={{flexDirection:'row'}}>
          {selecteddate==moment().format('MMMM D, YYYY')//check if the selected class is today's class
              ?<>
              {status==='Class ended' 
              ?<><Text style={{fontWeight:"bold",}}></Text><Text style={{color: 'red',}}>Class Ended</Text></> //show status of class in red if it's ended, so user can't take register anymore
              :<>
                <View style={{flexDirection:'row'}}>
                <Button 
                  title={(!isScanning ? 'Start Session' : '')} //studnet press 'Enter' to start the reigstration 
                  onPress={()=>(startScan(),setModalVisible(true))}
                /> 
                <Button 
                  title={(!isEndScanning ? 'End Session' : '')} // student press 'Leave' before they leave the classroom after class for complete registeration
                  onPress={()=>endScan()} 
                /> 
                </View>
              </>
              }
              </>
            :null}
        </View> 
          <View style={styles.detailcss}>
              <Text style={styles.titlecss}>{title}</Text>
              <Text style={styles.datacss}>{type}</Text>
              <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Code: </Text><Text> {code}</Text></Text>
              <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Day of week: </Text><Text> {day}</Text></Text>
              <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Duration:</Text><Text> {startT} - {endT}</Text></Text>
              <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Location: </Text><Text> {location}</Text></Text>
              {attendanceStatus.map(({id, data:{classrange}})=>(
                <>
                  {id===organisor
                  ?<Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Class Range:</Text><Text> {classrange} meters</Text></Text>
                  :null}
                </>
              ))}
              
              <Text >{'\n'}</Text>
              <View>
              {attendanceStatus.map(({ id, data:{status,startAt,endAt}}) => (
                <View key={id}>
                  {id===organisor
                  ?<>
                    <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Status: </Text><Text>{status}</Text></Text>
                    <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Started At: </Text><Text>{startAt }</Text></Text>
                    <Text style={styles.datacss}><Text style={{fontWeight:"bold"}}>Finished At: </Text><Text>{endAt}</Text></Text>
                  </>
                  :null}     
                </View>
              ))}
              </View>
              {/* Attendance report button that only visible to lecturers and admin to monitor studnet attedances */}
              <View style={{flexDirection:"row-reverse", paddingTop:20,}}>
                <Pressable
                    style={[styles.buttonone, styles.buttononeClose]}
                    onPress={()=>{navigation.navigate("attendanceReport",{ 
                        id:id,
                        title:title,
                        year:year,
                        type:type, 
                        selecteddate:selecteddate,               
                    })}}
                >
                    <Text style={{textAlign: 'center', color:'#FFF'}}>Attendance Report</Text>
                </Pressable>
              </View>
          </View>
      </ScrollView>
  )
}

export default ViewClassScreen

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
  buttonone: {
    borderRadius: 10,
    padding: 8,
    elevation: 2,
  },
  buttononeClose: {
    backgroundColor: "#556B2F",
  },

  centeredView: {
    flex: 2,
    justifyContent: "center",
    margin:100
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    padding: 8,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    textAlign: "center"
  }
});