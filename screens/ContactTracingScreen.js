import React, {useEffect,useState,useLayoutEffect} from 'react'
import 'react-native-gesture-handler'
import {TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ContactList from "../components/ContactList";
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ContactTracingScreen =({navigation})=> {
  const [report, setReport] = useState([])
  useLayoutEffect(() => {
    const unsubscribe = 
    firestore()
    .collection('report')
    .onSnapshot(snapshot => (
      setReport(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      )
    )
    setReport(report)
    return unsubscribe
  } ,[])

  useLayoutEffect(()=>{
    navigation.setOptions({
      title:"Report Records",
      headerRight:()=>(
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginRight:20
        }}>
          <TouchableOpacity 
            onPress={()=>navigation.navigate("addReport")} 
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
      )
    })
  },[navigation]) 

  const enterReport = (id, reportName, typeOfRecord,dateRange,startDate,endDate,displayName) => {
      navigation.navigate("addReport", {
          id,
          reportName,
          typeOfRecord,
          dateRange,
          displayName,
          startDate, 
          endDate,
      })
  }

  return(
    <ScrollView>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Home')} 
        activeOpacity ={0.5}
      >
        <Text h1 style={styles.h1}>QMSafe</Text>
      </TouchableOpacity>
      <Text style={styles.textcss}>Your Report History</Text>
      <ScrollView>
      {report.map(({ id, data: { reportName,typeOfRecord,startDate,endDate,displayName } }) => (
        <ContactList 
            key={id} 
            id={id} 
            reportName={reportName}
            displayName={displayName}
            typeOfRecord={typeOfRecord}
            startDate={startDate}
            endDate={endDate}
        />
      ))}
      </ScrollView>
    </ScrollView>
)
}

export default ContactTracingScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#e6f2ff",
    alignItems: 'center', 
    justifyContent: 'flex-start'
  },
  titlecss:{
    paddingTop:50,
    fontSize:60,
    color:'#003e80',
    fontWeight: 'bold',
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
  pickercss:{
    alignItems: 'center',
    width: 50,
  },
});