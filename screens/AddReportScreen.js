//page where any users can report they have been tested positive for COVID-19 or with symptoms
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {KeyboardAvoidingView, TouchableWithoutFeedback,  ScrollView,Keyboard,TextInput,TouchableOpacity,StyleSheet, Text, View,} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
    
const AddReportScreen = ({ navigation }) => {
    const [input,setInput] = useState("")
    const [typeofrecord, setSelectedTypeofRecord] = useState("")
    const user = auth().currentUser
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Report Form",
            headerBackTitle: "Back to Record"
        })
    }, [navigation])

    //fetch current user's details
    const [userdata, setUser] = useState([])
    useEffect(() => {
        const unsubscribe = 
        firestore()
        .collection('users')
        .where('displayName','==',user.displayName)
        .onSnapshot(snapshot => (
        setUser(
            snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
            })))
        ))
        setUser(userdata)
        return unsubscribe
    } ,[])

    //get current user's academic year 
    const [year, setYear] = useState()
    useEffect(()=>{
        <>
            {userdata.map(({id, data:{year}})=>{
            setYear(year)
            })}
        </>
    })

    //add report record onto firestore depending on the covid type (positive or symptoms)
    const createReport = () => {
        if(typeofrecord==='Positive'){
            firestore().collection('report').add({
                reportName: input,
                displayName: auth().currentUser.displayName,
                typeOfRecord: typeofrecord,
                startDate:new Date()-12096e5,
                endDate: new Date().getTime(),
                createdAt: new Date().toString(),
                useryear: year,
                title: 'Possible COVID-19 exposure',
                description: '"QMSafe” has detected that you have been in contact with someone who has coronavirus. Please stay at home and self-isolate for 14 days to keep yourself and others safe.',
            }).then(() => {
                navigation.navigate('ContactTracing')
                enterReport={enterReport}
    
            }).catch((error) => console.log(error))
        }
        if (typeofrecord==='Symptoms'){
            firestore().collection('report').add({
                reportName: input,
                displayName: auth().currentUser.displayName,
                typeOfRecord: typeofrecord,
                startDate:new Date()-12096e5,
                endDate: new Date().getTime(),
                createdAt: new Date().toString(),
                useryear: year,
                title: 'Possible COVID-19 exposure',
                description: '“QMSafe” has detected that you have been in contact with someone who has coronavirus symptoms. Please stay at home and self-isolate for 14 days to keep yourself and others safe.',
            }).then(() => {
                navigation.navigate('ContactTracing')
                enterReport={enterReport}
    
            }).catch((error) => console.log(error))
        }
    }

    //Source code for KeyboardAvoidingView: https://reactnative.dev/docs/keyboardavoidingview
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inputContainer}>
            <Text h1 style={styles.h1}>QMSafe</Text>
            <Text style={styles.textcss}>Report Symptoms / COVID-19 Test</Text>
                {/* type of records */}
                <Text style={styles.subtitlecss}>Type:</Text>
                <Picker
                value={typeofrecord}
                onValueChange={(itemValue,itemIndex) => setSelectedTypeofRecord(itemValue)}
                >
                    <Picker.Item label="Symptoms" value="Symptoms" />
                    <Picker.Item label="Diagnos Positive COVID-19" value="Positive" />
                </Picker>
                
                {/* Message Field */}
                <Text style={styles.subtitlecss}>Message:</Text>
                <TextInput
                    multiline={true}
                    style={{backgroundColor:"#F8F8FF", paddingBottom:50,borderRadius:8}}
                    placeholder="Please provide details of your symptoms..." 
                    value={input} 
                    onChangeText={(text) => setInput(text)}
                /> 
                <Text>{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}</Text>
            <View style={styles.btnContainer}>
                <TouchableOpacity
                    style={[styles.button]}
                    onPress={createReport}
                >
                    <Text style={{textAlign: 'center', color:'#FFF', fontSize:16}}>Send Report</Text>
                </TouchableOpacity>
                <Text>{'\n'}{'\n'}{'\n'}{'\n'}</Text>
            </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    ) 
}

export default AddReportScreen 

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#e6f2ff",
        alignItems: 'center', 
        justifyContent: 'center'
      },
      inputContainer:{
        width:300,
        margin:0,
        marginBottom:0
      },
      input:{
        height: 55,
        fontSize: 16,
      },
      button:{
        width:300,
        borderRadius: 5,
        padding: 8,
        backgroundColor: "#2196F3",
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
      loginText: {
        color: '#3740FE',
        marginTop: 20,
        textAlign: 'center'
      },
    subtitlecss:{
        fontSize:16,
        fontWeight:"bold",
        color:'#003e80',
        marginLeft: 20,
    }
})