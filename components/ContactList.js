//Displaying list of all records reported by current user
import React, {useLayoutEffect,useState,} from 'react'
import {  View, StyleSheet } from 'react-native'
import { ListItem } from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import OptionsMenu from "react-native-options-menu";

const ContactList = ({ id,reportName,displayName, typeOfRecord,}) => {
  const user = auth().currentUser.displayName  
  const[report, setreportMessages] = useState([])
  const MoreIcon = require("../assets/more.png");

  useLayoutEffect(() => {
    //fetch selected report record 
    const unsubscribe = 
    firestore()
    .collection('report')
    .doc(id)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot(snapshot => (
      setreportMessages(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      )
    )
    setreportMessages(report)
    return unsubscribe
  } ,[])

  //delete report record from firestore
  const deletePost=()=>{
    firestore()
    .collection('report')
    .doc(id)
    .delete()
    .then(() => {
      console.log("Record successfully deleted!");
    }).catch((error) => {
      console.error("Error removing record: ", error);
    });
  }

  const cancelPost=()=>{
    console.log("cancel")
  }

  return(
    <View>
      {displayName===user && ( //only display records that is reported by current user
        <ListItem>
          <ListItem.Content>
            <ListItem.Title style={{ fontWeight: "800" }}>
              {typeOfRecord}
            </ListItem.Title>
            <ListItem.Subtitle>
              {reportName}
            </ListItem.Subtitle>
          </ListItem.Content>
        <OptionsMenu
          button={MoreIcon}
          buttonStyle={{ width: 50, height: 20, margin: 7.5, resizeMode: "contain" }}
          destructiveIndex={1}
          options={["Delete", "Cancel"]}
          actions={[deletePost, cancelPost]}/>
          </ListItem>
      )} 
    </View>
  )
}

export default ContactList

const style = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#e6f2ff",
  },
})

