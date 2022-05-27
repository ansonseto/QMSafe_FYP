//Timetable page showing all classes for each day 
// only accessible by admin 
import React, { Component} from 'react'
import {ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import Dates from 'react-native-dates';
import moment from 'moment';
import ShowAllClassScreen from '../components/years/ShowAllClassScreen';

export default class AdminAttendanceScreen extends Component {
  state = {
    date: null,
    focus: 'startDate',
    startDate: null,
  }
  
  render() {    
    const isDateBlocked = (date) =>
      // date.isBefore(moment()-1617737563, 'day') //testing
      date.isBefore(null, 'day') 

    const onDatesChange = ({ startDate, focusedInput }) =>
      this.setState({ ...this.state, focus: focusedInput }, () =>
        this.setState({ ...this.state, startDate })
      );

    // const startD = new Date( startDate.seconds * 1000 + startDate.nanoseconds / 1000, ).toLocaleDateString()

    var selectedday = this.state.startDate && this.state.startDate.format('dddd')
    var selecteddate = this.state.startDate && this.state.startDate.format('LL')
    return (      
      <ScrollView style={styles.container}>
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
        style={styles.calendarcss}
        onDatesChange={onDatesChange}
        isDateBlocked={isDateBlocked}
        startDate={this.state.startDate}
        focusedInput={this.state.focus}
        focusedMonth={ moment()}
        range
      />
      <View>
        <ShowAllClassScreen
          selectedday={selectedday}
          selecteddate={selecteddate}
        />
      </View>
      </ScrollView>
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
});


