//Login Screen structure followed a youtube tutorial
// Source code: https://www.youtube.com/watch?v=MJzmZ9qmdaE&t=6738s&ab_channel=SonnySangha

//Login functions uses Firebase authentication 
// Source code: https://rnfirebase.io/auth/usage
import React, {useEffect, useState} from 'react'
import {TouchableWithoutFeedback,KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, Keyboard} from 'react-native'
import auth from '@react-native-firebase/auth';
import {Input} from 'react-native-elements';

const LoginScreen = ({navigation}) =>{
  const [username, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //Handle user state changes, navigate to homepage if successful login authentication
  useEffect(()=>{
    const unsubscribe = auth().onAuthStateChanged((authUser)=>{
      if(authUser){
        navigation.navigate('Home');
      }
    });
    return unsubscribe;
  },[])

  //Firebase authentication - Email/Password sign-in
  const signIn=()=>{
    auth()
    .signInWithEmailAndPassword(email, password)
    .catch((error)=>alert(error));
  };

  //login form
  //Source code for KeyboardAvoidingView: https://reactnative.dev/docs/keyboardavoidingview
  return (    
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inputContainer}>
          <Text h1 style={styles.h1}>QMSafe</Text>
          <Text style={styles.textcss}>Login Here</Text>
          <Input 
            style={styles.input}
            placeholder="Email Address" 
            autoFocus 
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
          <View style={styles.btnContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={signIn}
              >
                <Text style={{textAlign: 'center', color:'#FFF', fontSize:16}}>Login</Text>
              </TouchableOpacity>
              <Text 
                style={styles.loginText}
                onPress={() => navigation.navigate('SignUp')}>
                <Text>Don't have account? Click here to signup</Text>
              </Text> 
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
});