import React, {useState, useEffect, useReducer,} from 'react';
import {SafeAreaView,FlatList, TouchableHighlight,StyleSheet,ScrollView,View,Text,NativeModules,NativeEventEmitter,Button,} from 'react-native';
import {Colors,} from 'react-native/Libraries/NewAppScreen';
import BleManager from 'react-native-ble-manager';
import GetLocation from 'react-native-get-location';
import auth, { firebase } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { TouchableOpacity } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BLEScreen = ({navigation}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongtitude] = useState('')
  const peripherals = new Map();
  const [list, setList] = useState([]);
  const user = auth().currentUser
  const [uniqueId, setUniqueId] =useState('')
  const [devicerssi, setDeviceRSSI] =useState('')


  const startScan = () => {
    if (!isScanning) {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 15000,
      })
      .then(location => {
        var obj =  JSON.stringify(location)
        var stringify = JSON.parse(obj)
        setLatitude(stringify.latitude);
        setLongtitude(stringify.longitude);
      }).catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      });
      setUniqueId(DeviceInfo.getUniqueId())
      console.log(DeviceInfo.getUniqueId())
      BleManager.readRSSI(uniqueId).then((devicerssi) => {
        devicerssi = unqiueId.rssi 
        setDeviceRSSI(devicerssi) 
        console.log(devicerssi)
      }); 
      BleManager.scan([], 3, true).then((results) => {
        console.log('Scanning...');
        setIsScanning(true);
      }).catch(err => {
        console.error(err);
      });
    }    
  }

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
  }

  const handleDisconnectedPeripheral = (data) => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  const handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        // if(peripheral.advertising.txPowerLevel==null){
        //   peripheral.advertising.txPowerLevel=-59
        // }
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  }

  const handleDiscoverPeripheral = (peripheral) => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    // if(peripheral.advertising.txPowerLevel==null){
    //   peripheral.advertising.txPowerLevel=-59
    // } 
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
    var distance = Math.abs(10 *((peripheral.advertising.txPowerLevel-devicerssi)/(10 * 2)))
    if(distance<=2){
      database()
      .ref('proximityexchange/' + user.displayName)
      .set({
        deviceid: peripheral.id,
        exchangedAt: firebase.firestore.Timestamp.now(),
        distance: distance,
      })
      .then(() => console.log(peripheral.id + 'less than 2m'))
      .catch((error) => alert(error))
    }
  }

  const testPeripheral = (peripheral) => {
    if (peripheral){
      if (peripheral.connected){
        BleManager.disconnect(peripheral.id);
      }else{
        BleManager.connect(peripheral.id).then(() => {
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            setList(Array.from(peripherals.values()));
          }
          setTimeout(() => {
            /* Test read current RSSI value */
            BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
              BleManager.readRSSI(peripheral.id).then((rssi) => {
                let p = peripherals.get(peripheral.id);
                if (p) {
                  p.rssi = rssi;
                  peripherals.set(peripheral.id, p);
                  setList(Array.from(peripherals.values()));
                }                
              });                                          
            });
          }, 900);
        }).catch((error) => {console.log('Connection error', error);});
      }
    }

  }

  useEffect(() => {
    BleManager.start({showAlert: false});
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );

    return (() => {
      console.log('unmount');
      bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan );
      bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
      bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
    })
  }, []);

  const renderItem = (item) => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => testPeripheral(item) }>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
          <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2}}>RSSI: {item.rssi}</Text>
          <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20}}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  return (
    <>
      <SafeAreaView>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            
            <View style={{margin: 10}}>
              <Button 
                title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                onPress={() => startScan() } 
              />            
            </View>
            
            <View style={{margin: 10}}>
              <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected() } />
            </View>
            <View>
            <Text>Your Current Location: </Text>
            <Text>Latitude: {latitude}</Text>
            <Text>Longitude: {longitude}</Text>
            <Text>Current Device id: {uniqueId}</Text>
            <Text>Current Device rssi: {devicerssi}</Text>
            </View>
            <ScrollView>
            {(list.length == 0) &&
              <View style={{flex:1, margin: 20}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            }
            </ScrollView>
          </View> 
          <ScrollView>
          {list.map((item,index)=>(
            <TouchableOpacity key={index} onPress={()=>{testPeripheral(item)}} style={{padding:10, alignItems:'center',}}>
              <Text style={{ fontWeight: "800" }}>{item.name}</Text>
              <Text>RSSI value: {item.rssi}</Text>
              <Text>ID: {item.id}</Text>
              <Text>TxPower: {item.advertising.txPowerLevel}
              </Text>
              <Text>Distance: {Math.abs(10 *((item.advertising.txPowerLevel-devicerssi)/(10 * 2)))}</Text>
            </TouchableOpacity>
          ))}   
          </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default BLEScreen;
