//Sign-up Screen structure followed a youtube tutorial
// Source code: https://www.youtube.com/watch?v=MJzmZ9qmdaE&t=6738s&ab_channel=SonnySangha

//Sign-up functions uses Firebase authentication 
// Source code: https://rnfirebase.io/auth/usage
import React, {useState,} from 'react';
import {Button, ScrollView,TouchableWithoutFeedback,KeyboardAvoidingView,StyleSheet, Text, View,Keyboard} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Input} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native';

const SignUpScreen = ({navigation}) =>{
  const [username, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [year, setYear] = useState("");
  const user = auth().currentUser
  const userId=""

  //Register user using firebase authentication method
  //then store user details into firebase cloud database, identify user using randomly generated id
  //sucessful sign-up will navigate users back to login page where they need to login again before access the app
  const register=()=>{
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((authUser)=>{
          authUser.user.updateProfile({
            displayName: username,
          }),
          //React Native Firebase - Cloud Firestore add data method
          //Source code: https://rnfirebase.io/firestore/usage
          firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .set({
              displayName: username,
              year:year,
              email:email,
              userId:auth().currentUser.uid
          })
          navigation.navigate('Login')
      })
      .catch((error)=>alert(error.message))
  }

  //Sign-up form 
  //Source code for KeyboardAvoidingView: https://reactnative.dev/docs/keyboardavoidingview
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.inputContainer}>
          <Text h1 style={styles.h1}>QMSafe</Text>
          <Text style={styles.textcss}>Sign Up Here</Text>
          <Input 
          style={styles.input}
          placeholder="Student ID " 
          autoFocus 
          type="text"
          value={username}
          onChangeText={(text)=>setName(text)}
        />
        <Input 
          style={styles.input}
          placeholder="Insitution Email " 
          type="email"
          value={email}
          onChangeText={(text)=>setEmail(text)}
        />
        <Input 
          style={styles.input}
          placeholder="Password" 
          secureTextEntry 
          type="password"
          value={password}
          onChangeText={(text)=>setPassword(text)}
        />
        <View style={{marginTop:0}}>
          <Picker
            value={year}
            onValueChange={(itemValue,itemIndex) => setYear(itemValue)}
          >
            <Picker.Item label="Computer Science UG Year 1" value="Year 1" />
            <Picker.Item label="Computer Science UG Year 2" value="Year 2" />
            <Picker.Item label="Computer Science UG Year 3" value="Year 3" />
          </Picker>
        </View>
        <View style={styles.btnContainer}>
          <Button 
            containerStyle={styles.button} 
            raised 
            title="Sign Up" 
            onPress={register}
          />
          </View>
          {/* <TouchableOpacity
            style={[styles.button]}
            onPress={verification}
          >
            <Text style={{textAlign: 'center', color:'#FFF', fontSize:16}}>Send Verification</Text>
          </TouchableOpacity> */}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

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
    marginBottom:10,
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
});