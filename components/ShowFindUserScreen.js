//list showing all users using QMSafe 
//only accessible by admin 
import React, {useState,useEffect } from 'react';
import { StyleSheet, Text, View,Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import OptionsMenu from "react-native-options-menu"
import { ListItem } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';

const ShowFindUserScreen =({id, displayName, year})=> {
  const [userdetail, setUsers] = useState([])
  const MoreIcon = require("../assets/more.png")
  useEffect(() => {
    const userdb = firestore()
      .collection('timetable')
      .onSnapshot(querySnapshot => {
        const userarray = []
        querySnapshot.forEach(documentSnapshot => {
            userarray.push({
            ...documentSnapshot.data(),
            key:documentSnapshot.id,
          });
        });
        setUsers(userdetail)
      })
    return () => userdb() // Unsubscribe from events when no longer in use
  }, [navigation])


  //navigate admin to edit other user's details 
  const navigation = useNavigation()
  const editPost=()=>{
    navigation.navigate("editUser",{
      id:id,
      displayName:displayName,
      year:year,
    })
  }
  
  const cancelPost=()=>{
    console.log("cancel")
  }

  return (
    <View style={styles.container}>
        {displayName==="Admin"
        ?null
        :(
            <ListItem key={id} style={{borderBottomWidth :2, borderRadius:10}}>
            <ListItem.Content>
                <ListItem.Title key={id} style={{ fontWeight: "800" }}>{displayName}</ListItem.Title>
            </ListItem.Content>
            <Text key={id} styles={{alignItems:"left", }}>{year}</Text> 
            <OptionsMenu
                button={MoreIcon}
                buttonStyle={{ width: 50, height: 20, marginRight:5, resizeMode: "contain" }}
                destructiveIndex={1}
                options={["Edit Details","Cancel"]}
                actions={[editPost,cancelPost]}
                />
            </ListItem>
        )}
    </View>
  );
}
export default ShowFindUserScreen

const styles = StyleSheet.create({
  
});