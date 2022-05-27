import React, { useState,Component } from 'react'
import { SearchBar } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore';

let helperArray=[]
export default class SearchBarScreen extends React.Component { 
    state = {
        search: '',
        allUsers:helperArray,
        userFiltered: helperArray,
    }
    
    getUser=()=>{
        firestore()
        .collection('users')
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            helperArray.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
        })
    }
    
    updateSearch = search => { 
        this.setState({ 
            userFiltered: this.state.allUsers.filter(i=>
                i.name.toLowerCase()===search.toLowerCase()
            )
        })
    }
    render() {
        const { search } = this.state
        return (
            <SearchBar
                lightTheme        
                round 
                showCancel={true}
                placeholder="Search User Here....."
                onChangeText={this.updateSearch}
                value={search}
            />  
        )
    }
}