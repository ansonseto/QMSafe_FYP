//Student timetable 
//only accessible by students
import React, { useLayoutEffect,useState,useEffect } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

const ShowStudentClassScreen =({selectedday,selecteddate})=> {
  //Fetch current user's details from firestore
  const  user = auth().currentUser 
  const [details, setUsers] = useState([])
  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .where('displayName','==',user.displayName)
      .onSnapshot(querySnapshot => {
        const details = []
        querySnapshot.forEach(documentSnapshot => {
          details.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          })
        })
        setUsers(details)
      })
    return () => subscriber() // Unsubscribe from events when no longer in use
  }, [])

  //fetch current user's timetable 
  const [timetable, setTimetable] = useState([])
  useLayoutEffect(() => {
    const unsubscribe = 
    firestore()
    .collection('timetable')
    .orderBy('starttime', 'asc')
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

  const navigation = useNavigation()
  return (
    <View>
      {timetable.map(({ id, data: {year, title, code, location, type, organisor, startDate, endDate,starttime, endtime,day} }) => (
        <View key={id}>
        {details.map((item,index)=>(
        <View key={index}>
          {day===selectedday && item.year===year //only print class in list form that is current day and mathces student's academic year
          ?<ListItem key={index}>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: "800" }}>{title}</ListItem.Title>
              <ListItem.Subtitle >{type}</ListItem.Subtitle>
              <ListItem.Subtitle>{year}</ListItem.Subtitle>
            </ListItem.Content>
            <Text style={{
              flexDirection:"column-reverse",
              width:80,
              textAlign:"center",
              fontSize:12,
            }}>{new Date( starttime.seconds * 1000 ).toLocaleTimeString()} {'\n'}|{'\n'} {new Date( endtime.seconds * 1000 ).toLocaleTimeString()}</Text>
                {/* button where studnets can press to vide the class details, where attendance will be taken there */}
                <IconAntDesign
                  reverse
                  name="search1"
                  color="#989898"
                  size={15}
                  style={{padding:5}}
                  activeOpacity={0.5}
                  onPress={()=>{
                    navigation.navigate("viewClassStudent",{
                      key:id,
                      id:id,
                      title: title,
                      code: code,
                      year:year,
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
        </View>
      ))}
      {/* print 'No Class Today' if selected date is weekend */}
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
export default ShowStudentClassScreen

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