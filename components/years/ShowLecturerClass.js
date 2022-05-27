//Lecturer timetable only showign class that they teach
//Only accessible by lecturer
import React, {useLayoutEffect,useState,} from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

const ShowLecturerClass =({selectedday,selecteddate})=> {
  const navigation = useNavigation()
  //fetch current user's details 
  const  user = auth().currentUser
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
      {timetable.map(({ id, data: {year, title, code, location, type, organisor, startDate, endDate,starttime, endtime,day} }) => (
        <View key={id}>
          {day===selectedday && organisor==user.displayName //only display list of class of selected day and matches the lecutrer's name as the stored organisor name
          ?<ListItem key={id}>
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
  )
}
export default ShowLecturerClass

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