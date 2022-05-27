//edit form where current users can update their email address and password
//using React Native Firebase 
//Whole page structure referenced from online tutorial
//Source code: https://medium.com/@ericmorgan1/change-user-email-password-in-firebase-and-react-native-d0abc8d21618
import React from 'react';
import {TouchableOpacity,ScrollView, View,StyleSheet, Text, Button, Alert, } from 'react-native';
import {Input} from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class EditPasswordEmailScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      newEmail: "",
    };
  }

  // Reauthenticates the current user and returns a promise...
  reauthenticate = (currentPassword) => {
    var user = auth().currentUser;
    var cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  // Changes user's password...
  onChangePasswordPress = () => {
    this.reauthenticate(this.state.currentPassword).then(() => {
      var user = auth().currentUser;
      user.updatePassword(this.state.newPassword).then(() => {
        Alert.alert("Password was changed");
      }).catch((error) => { console.log(error.message); });
    }).catch((error) => { console.log(error.message) });
  }

  // Changes user's email...
  onChangeEmailPress = () => {
    this.reauthenticate(this.state.currentPassword).then(() => {
      var user = auth().currentUser;
      user.updateEmail(this.state.newEmail).then(() => {
        firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          email: this.state.newEmail,
        })
        Alert.alert("Email was changed");
      }).catch((error) => { console.log(error.message); });
    }).catch((error) => { console.log(error.message) });
  }
  
  render() {
     return (
      <View style={styles.inputContainer}>
        <Text style={{fontStyle:"italic", color:"red"}}>**Please enter your current password to change password or email address.</Text>
        
        <Text style={{fontWeight:"bold",color:'#003e80',}}>Current Password:</Text>
        <Input style={styles.textInput} value={this.state.currentPassword}
          autoCapitalize="none" secureTextEntry={true}
          onChangeText={(text) => { this.setState({currentPassword: text}) }}
        />

        <Text style={{fontWeight:"bold",color:'#003e80'}}>{"\n"}New Password:</Text>
        <Input style={styles.textInput} value={this.state.newPassword}
          autoCapitalize="none" secureTextEntry={true}
          onChangeText={(text) => { this.setState({newPassword: text}) }}
        />
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.onChangePasswordPress}
        >
          <Text style={{textAlign: 'center', color:'#FFF', fontSize:16}}>Change Password</Text>
        </TouchableOpacity>
        <Text>{'\n'}</Text>
        <Text style={{fontWeight:"bold",color:'#003e80'}}>New Email Address: </Text>
        <Input style={styles.textInput} value={this.state.newEmail}
          autoCapitalize="none" keyboardType="email-address"
          onChangeText={(text) => { this.setState({newEmail: text}) }}
        />
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.onChangeEmailPress}
        >
          <Text style={{textAlign: 'center', color:'#FFF', fontSize:16}}>Change Email</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

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