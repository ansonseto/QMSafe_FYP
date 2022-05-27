//Edit class details that can only access by admin
//Fields are re-filled with current records and admin only need to update the fields they intended to 
import React, { useLayoutEffect,useEffect, useState } from 'react'
import { Button,ScrollView,StyleSheet, Text, View, Alert} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {Input} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const EditClassScreen = ({ route, navigation}) => {
    const user = auth().currentUser
    const [details, setUpdateClass]=useState([])
    const { id,} = route.params
    
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Edit Class",
        })
    }, [navigation])
    
    useEffect(()=>{
        getUser()
    },[])

    //fetch class details and store into array 
    const getUser=async()=>{
        const subscriber = firestore()
          .collection('timetable')
          .doc(id)
          .get()
          .then((documentSnapshot)=>{
            if(documentSnapshot.exists){
                setUpdateClass(documentSnapshot.data())
            }
          })
        return () => subscriber() 
    }
    
    //update class details onto firestore record 
    const updateProfile = () =>{
        firestore()
        .collection('timetable')
        .doc(id)
        .update({
            title: details.title,
            code: details.code,
            location:details.location,
            type:details.type,
            organisor: details.organisor,
            startDate:startDate,
            endDate:endDate,
            starttime:starttime,
            endtime: endtime,
            day:details.day,
        })
        .then(()=>{
            Alert.alert('Class Updated Sucessfully!')
            navigation.goBack()
        })
        .catch((error) => {
            console.error("Error removing record: ", error)
        })
    }

    //set state of class date (usually semester long )
    const [startDate, setStartDate] = useState(new Date()) 
    const [endDate, setEndDate] = useState(new Date())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    //Start Date Button Function
    const onStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate
        setStartDate(currentDate)
    }
    //End Date Button Function
    const onEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate
        setEndDate(currentDate)
    }
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }
    const showDatepicker = () => {
        showMode('date');
    }

   //set state of class duration time 
   const [starttime, setStartTime] = useState(new Date());
   const [endtime, setEndTime] = useState(new Date());
   const [timemode, setTimeMode] = useState('starttime')
   const [timeshow, setTimeShow] = useState(false)
   //Start Time Button Function
   const onStartTimeChange = (event, selectedDate) => {
       const currentDate = selectedDate || starttime
       setStartTime(currentDate)
   }
   //End Time Button Function
   const onEndTimeChange = (event, selectedDate) => {
       const currentDate = selectedDate || endtime
       setEndTime(currentDate)
   }
   const showTimeMode = (currentMode) => {
       setTimeShow(true)
       setTimeMode(currentMode)
   }
   const showTimePicker = () => {
       showTimeMode('time')
   }

    return (
        <View style={styles.container}>
            <Text h1 style={styles.h1}>QMSafe</Text>
            <Text style={styles.textcss}>Edit Class</Text>
            <ScrollView style={{marginLeft:20, marginRight: 20}}>
                
                {/* Module Title Field*/}
                <Text style={styles.subtitlecss}>{'\n'}Module Title:</Text>
                <Input
                    placeholder={"title"} 
                    value={details ? details.title:""} 
                    onChangeText={(text) => setUpdateClass({...details, title:text})}
                    onSubmitEditing={updateProfile}
                /> 

                {/* Module Code Field*/}
                <Text style={styles.subtitlecss}>{'\n'}Module Code:</Text>
                <Input
                    placeholder={"e.g. ECS401U"}
                    value={details ? details.code:""} 
                    onChangeText={(text) => setUpdateClass({...details, code:text})}
                    onSubmitEditing={updateProfile}
                /> 
                {/* Lecturer Field*/}
                <Text style={styles.subtitlecss}>{'\n'}Lecturer:</Text>
                <Input
                    placeholder={"Full name"}
                    value={details ? details.organisor:""} 
                    onChangeText={(text) => setUpdateClass({...details, organisor:text})}
                    onSubmitEditing={updateProfile}
                />
                {/* Type of class Field (Lecture, Lab, .....)*/}
                <Text style={styles.subtitlecss}>{'\n'}Type:</Text>
                <Input
                    placeholder={"e.g. Lecture, Lab..."}
                    value={details ? details.type:""} 
                    onChangeText={(text) => setUpdateClass({...details, type:text})}
                    onSubmitEditing={updateProfile}
                />
                {/* Class Location */}
                <Text style={styles.subtitlecss}>{'\n'}Location:</Text>
                <Input
                    placeholder={"e.g. ITL, Bancroft Building 1.13,..."}
                    value={details ? details.location:""} 
                    onChangeText={(text) => setUpdateClass({...details, location:text})}
                    onSubmitEditing={updateProfile}
                />

                {/* Class Day (Mon, Tue,......)*/}
                <View style={{flexDirection: "row",justifyContent: "space-between",}}>
                    <View style={{flexDirection: "column",justifyContent: "space-between",}}>
                        <Text style={styles.subtitlecss}>Starts</Text>
                        <View>
                            <Button onPress={showDatepicker} title="Choose Start Date" />
                        </View>
                        {show && (
                            <DateTimePicker
                            value={startDate} 
                            mode={mode}
                            display="default"
                            onChange={onStartDateChange}
                            style={{flexDirection: 'row',}}
                            />
                        )}
                    </View>
                    <View style={{flexDirection: "column",justifyContent: "space-between",}}>
                        <Text style={styles.subtitlecss}>Ends</Text>
                        <View>
                            <Button onPress={showDatepicker} title="Choose End Date" />
                        </View>
                        {show && (
                            <DateTimePicker
                            value={endDate} 
                            mode={mode}
                            display="default"
                            onChange={onEndDateChange}
                            style={{flexDirection: 'row',}}
                            />
                        )}
                    </View>
                </View>
                <Text>{'\n'}</Text>

                {/* Select Start & End Time (Duration))*/}
                <View style={{flexDirection: "row",justifyContent: "space-between",}}>
                    <View style={{flexDirection: "column",justifyContent: "space-between",}}>
                        <Text style={styles.subtitlecss}>Durations:</Text>
                        <View>
                            <Button onPress={showTimePicker} title="Start Time" />
                            {timeshow && (
                                <DateTimePicker
                                    value={starttime} 
                                    mode={timemode}
                                    display="default"
                                    onChange={onStartTimeChange}
                                    style={{flexDirection: 'row',}}
                                />
                            )}
                        </View>
                    </View>
                    <View style={{flexDirection: "column",justifyContent: "space-between",}}>
                        <Text style={styles.subtitlecss}></Text>
                        <View>
                            <Button onPress={showTimePicker} title="End Time" />
                            {timeshow && (
                                <DateTimePicker
                                    value={endtime} 
                                    mode={timemode}
                                    display="default"
                                    onChange={onEndTimeChange}
                                    style={{flexDirection: 'row',}}
                                />
                            )}
                        </View>
                    </View>
                </View>
                <Text>{'\n'}</Text>

                {/* Day of the week*/}
                <Text style={styles.subtitlecss}>{'\n'}Day of the week:</Text>
                <Picker
                    value={details ? details.day:""} 
                    onValueChange={(itemValue) => setUpdateClass({...details, day:itemValue})}
                >
                    <Picker.Item label="Monday" value="Monday" />
                    <Picker.Item label="Tuesday" value="Tuesday" />
                    <Picker.Item label="Wednesday" value="Wednesday" />
                    <Picker.Item label="Thursday" value="Thursday" />
                    <Picker.Item label="Friday" value="Friday" />
                    </Picker>
                <Text>{'\n'}</Text>
                <Button onPress={updateProfile} title="Update" />
                <Text>{'\n'}</Text>
            </ScrollView>
            <Text>{'\n'}{'\n'}</Text>
        </View>
    )
}

export default EditClassScreen 

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#e6f2ff",
        justifyContent: 'flex-start',
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
      button:{
        width:200,
        marginTop:10,
      },
      subtitlecss:{
          fontSize:15,
          fontWeight:"bold",
          color:'#003e80',
          textAlign:  "left",
      }
})