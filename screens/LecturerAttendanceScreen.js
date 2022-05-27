//Lecuter timetable page
import React, { Component,} from 'react'
import {ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import Dates from 'react-native-dates';
import moment from 'moment';
import ShowLecturerClass from '../components/years/ShowLecturerClass';

export default class LecturerAttendanceScreen extends Component {
  state = {
    date: null,
    focus: 'startDate',
    startDate: null,
  }
  
  render() {    
    const isDateBlocked = (date) =>
      date.isBefore('day')

    const onDatesChange = ({ startDate, focusedInput }) =>
      this.setState({ ...this.state, focus: focusedInput }, () =>
        this.setState({ ...this.state, startDate })
      );

    const onDateChange = ({ date }) =>
      this.setState({ ...this.state, date })
   
    var selectedday = this.state.startDate && this.state.startDate.format('dddd')
    var selecteddate = this.state.startDate && this.state.startDate.format('LL')
    return (      
      <View style={styles.container}>
        <TouchableOpacity 
        onPress={() => this.props.navigation.navigate('Home')} 
        activeOpacity ={0.5}
      >
        <Text h1 style={styles.h1}>QMSafe</Text>
      </TouchableOpacity>
      <Text style={styles.textcss}>Timetable</Text>
      <Text style={{
        fontSize:15, 
        fontWeight:"bold", 
        color:"#003e80", 
        paddingBottom:10,
        marginLeft:10,
      }}>
        Today's Date: {moment().format('MMMM Do YYYY')}{'\n'}
        Day of Week: {moment().format('dddd')}
      </Text>
      <Dates
        onDatesChange={onDatesChange}
        isDateBlocked={isDateBlocked}
        startDate={this.state.startDate}
        focusedInput={this.state.focus}
        focusedMonth={ moment()}
        range
      />
      {/* <Text>Selected Date: {this.state.startDate && this.state.startDate.format('LL')}</Text>
      <Text>Selected Day: {selectedday}</Text> */}
      <ScrollView style={{height:150}}>
        <ShowLecturerClass
          selectedday={selectedday}
          selecteddate={selecteddate}
        />
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topcontainer:{
    alignItems:'center'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e6f2ff",
  },
  list: {
    flex: 1,
    marginTop:20,
  },
  h1:{
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
  date: {
    marginTop: 50
  },
  focused: {
    color: 'blue'
  }
});


