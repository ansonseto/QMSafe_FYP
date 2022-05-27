//Create class for timetable 
//only adin can create class onto timetable 
import React, { useLayoutEffect, useState } from 'react';
import {TouchableOpacity,Button, ScrollView,StyleSheet,Text, View} from 'react-native';
import {Input} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const CreateClassScreen = ({ navigation }) => {
    const [title,setTitle] = useState("")
    const [code, setCode] = useState("")
    const [location, setLocation] = useState("")
    const [organisor, setOrganisor] = useState("")
    const [type, setType] = useState("")
    const [year, setYear] = useState("")
    const [day, setDay] = useState("")

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Create Class",
        })
    }, [navigation])
    
    //add class to firestore 
    const createReport = ()=>{ 
        firestore()
        .collection('timetable')
        .add({
            year:year,
            title: title,
            code: code,
            location:location,
            type:type,
            organisor: organisor,
            startDate:startDate,
            endDate:endDate,
            starttime:starttime,
            endtime: endtime,
            day:day,
        }).then(() => {
            navigation.goBack()
        }).catch((error) => alert(error))
    }
    
    //dyanmic query if day=="Wed"
    //web browser interface for admin, so can upload CSV file (11 entires) with all studnets usign for loop, reading contrents of CSV fiels and add information itno the database.
    const [startDate, setStartDate] = useState(new Date()) //today's date minus same day a month ago
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

    //Start Time Button Function
    const [starttime, setStartTime] = useState(new Date());
    const [endtime, setEndTime] = useState(new Date());
    const [timemode, setTimeMode] = useState('starttime')
    const [timeshow, setTimeShow] = useState(false)
    const onStartTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || starttime
        setStartTime(currentDate)
    }
    const onEndTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || endtime
        setEndTime(currentDate)
    }
    const showTimeMode = (currentMode) => {
        setTimeShow(true)
        setTimeMode(currentMode)
    }
    const showTimepicker = () => {
        showTimeMode('time')
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity 
                onPress={() => navigation.navigate('Home')} 
                activeOpacity ={0.5}
            >
                <Text h1 style={styles.h1}>QMSafe</Text>
            </TouchableOpacity>
            <Text style={styles.textcss}>Create Class</Text>
            <ScrollView style={{marginLeft:20, marginRight: 20}}>
                {/* Academic Year*/}
                <Text style={styles.subtitlecss}>{'\n'}Academic Year:</Text>
                <Picker
                    value={year}
                    onValueChange={(itemValue,itemIndex) => setYear(itemValue)}
                >
                    <Picker.Item label="Computer Science UG Year 1" value="Year 1" />
                    <Picker.Item label="Computer Science UG Year 2" value="Year 2" />
                    <Picker.Item label="Computer Science UG Year 3" value="Year 3" />
                    </Picker>
                {/* Module Title Field*/}
                <Text style={styles.subtitlecss}>{'\n'}Module Title:</Text>
                <Input
                    placeholder={"title"} 
                    value={title} 
                    onChangeText={(text) => setTitle(text)}
                    onSubmitEditing={createReport}
                /> 
                {/* Module Code Field*/}
                <Text style={styles.subtitlecss}>{'\n'}Module Code:</Text>
                <Input
                    placeholder={"e.g. ECS401U"}
                    value={code} 
                    onChangeText={(text) => setCode(text)}
                    onSubmitEditing={createReport}
                /> 
                {/* Lecturer Field*/}
                <Text style={styles.subtitlecss}>{'\n'}Lecturer:</Text>
                <Input
                    placeholder={"Full name"}
                    value={organisor} 
                    onChangeText={(text) => setOrganisor(text)}
                    onSubmitEditing={createReport}
                />
                {/* Type of class Field (Lecture, Lab, .....)*/}
                <Text style={styles.subtitlecss}>{'\n'}Type:</Text>
                <Input
                    placeholder={"e.g. Lecture, Lab..."}
                    value={type} 
                    onChangeText={(text) => setType(text)}
                    onSubmitEditing={createReport}
                />
                {/* Class Location */}
                <Text style={styles.subtitlecss}>{'\n'}Location:</Text>
                <Input
                    placeholder={"e.g. ITL, Bancroft Building 1.13,..."}
                    value={location} 
                    onChangeText={(text) => setLocation(text)}
                    onSubmitEditing={createReport}
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
                            testID="dateTimePicker"
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
                        <View style={{flexDirection: "row", justifyContent: "space-between",}}>
                            <Button onPress={showDatepicker} title="Choose End Date" />
                        </View>
                        {show && (
                            <DateTimePicker
                            testID="dateTimePicker"
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
                <View style={{flexDirection: "row",justifyContent: "space-between",}}>
                    <View style={{flexDirection: "column",justifyContent: "space-between",}}>
                        <Text style={styles.subtitlecss}>Durations:</Text>
                        <View>
                            <Button onPress={showTimepicker} title="Start Time" />
                            {timeshow && (
                                <DateTimePicker
                                    testID="dateTimePicker"
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
                            <Button onPress={showTimepicker} title="End Time" />
                            {timeshow && (
                                <DateTimePicker
                                    testID="dateTimePicker"
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
                {/* Academic Year*/}
                <Text style={styles.subtitlecss}>{'\n'}Day of the week:</Text>
                <Picker
                    value={day}
                    onValueChange={(itemValue,itemIndex) => setDay(itemValue)}
                >
                    <Picker.Item label="Monday" value="Monday" />
                    <Picker.Item label="Tuesday" value="Tuesday" />
                    <Picker.Item label="Wednesday" value="Wednesday" />
                    <Picker.Item label="Thursday" value="Thursday" />
                    <Picker.Item label="Friday" value="Friday" />
                    </Picker>
                <Text>{'\n'}</Text>
                <Button onPress={createReport} title="Create" />
                <Text>{'\n'}</Text>
            </ScrollView>
            <Text>{'\n'}{'\n'}</Text>
        </ScrollView>
    )
}

export default CreateClassScreen 

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#e6f2ff",
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
      },
      subtitlecss:{
          fontSize:15,
          fontWeight:"bold",
          color:'#003e80',
          textAlign:  "left",
      }
})