//Admin accessible page to view all class enrolled onto the system 
import React, {useLayoutEffect,useState } from 'react';
import {  StyleSheet, Text, View,Alert, } from 'react-native';
import { ListItem, } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import BleManager from 'react-native-ble-manager';

const ShowAllClassScreen =({selectedday,selecteddate})=> {
  const navigation = useNavigation()
  //fetch all class details 
  const [timetable, setTimetable] = useState([])
  useLayoutEffect(() => {
    const unsubscribe = 
    firestore()
    .collection('timetable')
    .orderBy('starttime', 'desc')
    .onSnapshot(snapshot => (
      setTimetable(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      )
    )
    return unsubscribe
  } ,[])

  return (
    <View>
      <View>
        {timetable.map(({ id, data: {year, title, code, location, type, organisor, startDate, endDate,starttime, endtime,day} }) => (
          <View key={id}>
            {day===selectedday
            ?<ListItem >
              <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800" }}>{title}</ListItem.Title>
                <ListItem.Subtitle>{type}</ListItem.Subtitle>
                <ListItem.Subtitle>{year}</ListItem.Subtitle>
              </ListItem.Content>
              <Text style={{
                flexDirection:"column-reverse",
                width:80,
                textAlign:"center",
                fontSize:12,
              }}>{new Date( starttime.seconds * 1000 ).toLocaleTimeString()} {'\n'}|{'\n'} {new Date( endtime.seconds * 1000 ).toLocaleTimeString()}</Text>
                <View key={id}>
                  <IconAntDesign
                    reverse
                    name="search1"
                    color="#989898"
                    size={15}
                    style={{padding:5}}
                    activeOpacity={0.5}
                    onPress={()=>{
                      navigation.navigate("viewClass",{
                        key:id,
                        id:id,
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
                        selectedday:selectedday,
                        selecteddate:selecteddate,
                      })
                    }}
                  />
                  {/* navigate to edit class page where admin can update class details if needed  */}
                  <IconAntDesign
                    reverse
                    name="edit"
                    color="#ffa500"
                    size={15}
                    style={{padding:5}}
                    activeOpacity={0.5}
                    onPress={()=>{
                      navigation.navigate("editClass",{
                        key:id,
                        id:id
                      })
                    }}
                  />  
                  {/* button where admin can delete the class from system and firestore  */}
                  <IconAntDesign
                    reverse
                    name="delete"
                    color="#CA300E"
                    size={15}
                    style={{padding:5}}
                    activeOpacity={0.5}
                    onPress={()=>
                      Alert.alert(
                        'Are you sure you want to delete this class?',
                        'This item will be deleted immediately. You cannot undo this action.',
                        [
                          {text:'Cancel'},
                          {text:'Delete', onPress:()=>{
                            firestore()
                            .collection('timetable')
                            .doc(id)
                            .delete()
                            .then(() => {
                                Alert.alert("Class Deleted")
                            }).catch((error) => {
                                console.error("Error removing record: ", error);
                            })
                          }}
                        ],
                        {cancelable:false},
                      )
                    }
                  />
                </View>
              </ListItem>
            :null
            }
          </View>
        ))}
        <View style={styles.noclasscontainer}>
        {selectedday==="Saturday" 
            ?<Text style={styles.noclasscss}>No Class Today :)</Text>
          :(selectedday==="Sunday"
            ?<Text style={styles.noclasscss}>No Class Today :)</Text>
          :null
        )}
        </View>
      </View>
    </View>
  )
}
export default ShowAllClassScreen

const styles = StyleSheet.create({
  noclasscontainer:{
    flex:1,
    alignItems:'center',
    padding:50,
  },
  noclasscss:{
    flex:1,
    alignSelf:"center",
    fontSize:20,
    color: 'grey',

  },
});