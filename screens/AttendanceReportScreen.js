//Attendnace Report page that can only be accessed by the lecturer and admin 
import React,{useLayoutEffect,useState,useEffect} from 'react'
import {ScrollView, StyleSheet, Text, View } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ListItem } from 'react-native-elements'
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const AttendanceReportScreen = ({route, navigation})=> {
  const { id, title, type,selecteddate,year,organisor } = route.params
  useLayoutEffect(()=>{
    navigation.setOptions({
      title:"Attendance Report",
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

  //get all studnets details who enrolled in this class
  const [user, setUser] = useState([])
  useEffect(() => {
    const unsubscribe = 
    firestore()
    .collection('users')
    .onSnapshot(snapshot => (
      setUser(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      )
    )
    setUser(user)
    return unsubscribe
  } ,[])

  //get class details 
  const [tableData, setTable] = useState([])
  useEffect(() => {
    const unsubscribe = 
    firestore()
    .collection(year)
    .doc(title)
    .collection(selecteddate)
    .onSnapshot(snapshot => (
      setTable(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      )
    )
    setTable(tableData)
    return unsubscribe
  } ,[])

  let noStudent = 0 
  const [numberOfStudent, setnumberOfStudent] = useState()
  const [absentStudent, setAbsentStudent] = useState()
  let present = 0 
  let absent = 0 
  const[presentPercent, setpresentPercent] = useState() 
  const[absentPercent, setabsentPercent] = useState()
  const [attendName, setAttendName] = useState([])
  const [absentName, setAbsentName] = useState([])
  useEffect(()=>{
    {user.map(({id,data:{year, displayName}})=>(
      setAbsentStudent(displayName),
      <>
      {year===route.params.year
      ?noStudent++ // total number of students enrolled in this class
      :noStudent=noStudent}
      </>
    ))}
    setnumberOfStudent(noStudent)
    {tableData.map(({id, data:{attend,name}})=>(
      <>
      {id!==organisor
      ?<>
          {attend==='Present'
          ?(present++, setAttendName(name)) //total number of students attended class
          :absent++, setAbsentName(name) // number of students absent for that particular day 
          }
      </>
      :null}
      </>
    ))}
    present = Math.round((present/numberOfStudent) *100) //calculate percentage of studnet attended
    absent = (100-present) // percentage of students who are absent 
    setpresentPercent(present)
    setabsentPercent(absent)
  })

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Home')} 
        activeOpacity ={0.5}
      >
        <Text h1 style={styles.h1}>QMSafe</Text>
      </TouchableOpacity>
      <Text style={styles.textcss}>Attendance Report</Text>
      <Text style={styles.subtitlecss}>{title} - {type}</Text>
      <View style={{width: 300, alignItems:'center'}}>
      {/* progress pie chart showing visualisation of the attendnace report  
      Source code: https://www.npmjs.com/package/react-native-circular-progress
      */}
      <AnimatedCircularProgress
        size={200}
        width={15}
        fill={presentPercent}
        tintColor="green"
        backgroundColor="red" 
        />
      {/* session underneath pie chart to show the number of percentage of attendee and absents */}
      </View>
      <View style={{flexDirection:'row', padding: 20,justifyContent:'space-between'}}>
        <Text style={{color: 'green'}}>Present: </Text><Text>{presentPercent}%</Text>
        <Text style={{color: 'red'}}> Absent: </Text><Text>{absentPercent}%</Text>
      </View>
      <ScrollView style={{width:300, padding: 5, }}>
      <ListItem>
        <ListItem.Content style={{flexDirection:'row',justifyContent:'space-between'}}>
            <ListItem.Subtitle style={{fontWeight:'800'}}>Student</ListItem.Subtitle>
            <ListItem.Subtitle style={{fontWeight:'800'}}>Status </ListItem.Subtitle>
        </ListItem.Content>
        </ListItem>

        {/* print student who attended classes */}
        {tableData.map(({id,data:{name, attend}})=>(
          <View key={id}>
          {id!==organisor && attend!=null
         ?<><ListItem >
          <ListItem.Content style={{flexDirection:'row',justifyContent:'space-between'}}>
              <ListItem.Subtitle>{name}</ListItem.Subtitle>
              <ListItem.Subtitle> {attend} </ListItem.Subtitle>
          </ListItem.Content>
          </ListItem>
          </>
        :null}
          {/* print students who are absent  */}
          </View>
        ))}

        {user.map(({id,data:{year, displayName, type}})=>(
            <View key={id}>
              { displayName!='usera' && displayName!=attendName && displayName!=absentName && year===route.params.year && type!='Lecturer' && type!='Admin' 
              ?<View key={id}>
              <ListItem>
              <ListItem.Content style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <ListItem.Subtitle>{displayName}</ListItem.Subtitle>
                  <ListItem.Subtitle>Absent </ListItem.Subtitle>
              </ListItem.Content>
              </ListItem>
              </View>
              :null}
            </View>
          ))}
      </ScrollView>
    </View>
  )
}

export default AttendanceReportScreen

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
    marginBottom:10,
    textAlign:"center"
  },
  subtitlecss:{
    fontSize:20,
    fontWeight:"bold",
    textDecorationLine: 'underline',
    color:'#003e80',
    marginBottom:20,
    textAlign:"center"
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