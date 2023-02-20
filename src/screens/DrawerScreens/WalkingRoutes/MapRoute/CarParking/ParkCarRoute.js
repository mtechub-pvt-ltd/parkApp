import React, { useEffect, useState,useRef } from 'react';
import {
  SafeAreaView,ImageBackground,Dimensions,
   View, Text, TouchableOpacity,Image
} from 'react-native';

//////////////app components/////////////////
import Ionicons from 'react-native-vector-icons/Ionicons';

////////////////app pakages//////////////////
import MapView, { PROVIDER_GOOGLE,Polyline,Marker,AnimatedRegion  } 
from 'react-native-maps';

//////////////app styles///////////////////
import styles from './styles';
import Colors from '../../../../../utils/Colors';

///////////map direction libarary///////////////
import MapViewDirections from 'react-native-maps-directions';

/////////helper functions///////////////
import { locationPermission, getCurrentLocation } from '../../../../../helper/helperFunction';

//////////////map key///////////////////
import MapKeyApi from '../../../../../utils/MapKey'
import CustomHeader from '../../../../../components/Header/CustomHeader';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.08;
const LONGITUDE_DELTA =LATITUDE_DELTA * ASPECT_RATIO;

const ParkCarRoute = ({ navigation,route }) => {

  //previous data
  const[previousdata]=useState(route.params)
  console.log('orderid:',route.params)

  const mapRef = useRef()
  const markerRef = useRef()
  const ref = useRef();
    const [state, setState] = useState({
        curLoc: {
          latitude:  56.002716,
          //  previousdata.Cordinates[0],
          longitude:-4.580081
          //  previousdata.Cordinates[1],
          // latitude:    previousdata.pickupLocation.coordinates.longitude,
          // longitude:  previousdata.pickupLocation.coordinates.latitude,
            // latitude: 17.2619,
            // longitude: 78.3880,
        },
        destinationCords: {
          // latitude:    previousdata.pickupLocation.coordinates.longitude,
          //  longitude:  previousdata.pickupLocation.coordinates.latitude,
          latitude:    previousdata.Cordinates[0],
          longitude:  previousdata.Cordinates[1],
        },
        isLoading: false,
        coordinate: new AnimatedRegion({
          // latitude:    previousdata.nextlocation.longitude,
          // longitude:  previousdata.nextlocation.latitude,
          // latitude:    previousdata.dropoffLocation.coordinates.longitude,
          // longitude:  previousdata.dropoffLocation.coordinates.latitude,
          // latitude:    previousdata.location.longitude,
          // longitude:  previousdata.location.latitude,
          // latitude:    previousdata.pickupLocation.coordinates.longitude,
          // longitude:  previousdata.pickupLocation.coordinates.latitude,
            // latitude: 17.2619,
            // longitude: 78.3880,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        time: 0,
        distance: 0,
        heading: 0

    })

    const { curLoc, time, distance, destinationCords, isLoading, coordinate,heading } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const animate = (latitude, longitude) => {
      const newCoordinate = { latitude, longitude };
      if (Platform.OS == 'android') {
          if (markerRef.current) {
              markerRef.current.animateMarkerToCoordinate(newCoordinate, 1000);
          }
      } else {
          coordinate.timing(newCoordinate).start();
      }
  }

const getLiveLocation = async () => {
  const locPermissionDenied = await locationPermission()
  if (locPermissionDenied) {
      const { latitude, longitude, heading } = await getCurrentLocation()
      console.log("get live location after 4 second",heading)
      animate(latitude, longitude);
      updateState({
          heading: heading,
          curLoc: { latitude, longitude },
          coordinate: new AnimatedRegion({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
          })
      })
  }
}

const  handlePin = () =>
{
    return (
        <View>
            <ImageBackground source={require('../../../../../assets/LocationDetail/walking.png')} 
            style={{height: 30, width:30 }}>
                <Text style={{paddingBottom:25}}>Hello</Text>
            </ImageBackground>
        </View>
        )
}
const fetchTime = (d, t) => {
  updateState({
      distance: d,
      time: t
  })
}
  useEffect(() => {
    ref.current?.setAddressText('Rawalpindi');
  const interval = setInterval(() => {
    getLiveLocation()
}, 1000);
return () => clearInterval(interval)

  }, []);
  return (

    <SafeAreaView style={styles.container1}>
      {/* <View style ={{flexDirection:'row'}}>
       <View style={{justifyContent:'flex-start',alignSelf:'center',
       marginTop:'10%',marginLeft:'5%'
       //backgroundColor:'red'
       }}>
       <Ionicons name='chevron-back' size={30} 
       color={Colors.Appthemecolor}
       onPress={()=> navigation.navigate('MyOrders')}
       />
       </View>
       <View style={{flex:1,justifyContent:'center',alignContent:'center',
       alignItems:'center',
       //backgroundColor:''
       }}>
         <TouchableOpacity>
       <CustomHeader
          text={'Order # '+previousdata.locid}
        />
        </TouchableOpacity>
       </View>

   </View> */}
 
<View style={styles.container}>
 
 <MapView
     ref={mapRef}
  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
  style={styles.map}
  initialRegion={{
    ...curLoc,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
}}
  // region={{
  //   // latitude:  previousdata.pickupLocation.coordinates.latitude,
  //   // longitude:  previousdata.pickupLocation.coordinates.longitude,
  //   // latitudeDelta: 0.015,
  //   // longitudeDelta: 0.0121,
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  //   latitudeDelta: 0.015,
  //   longitudeDelta: 0.0121,
  // }}
  >

<Marker.Animated
                        ref={markerRef}
                        coordinate={
                          coordinate
                        }
                    >
                        <Image
                            source={require("../../../../../assets/LocationDetail/walking.png")}
                            style={{
                                width: 40,
                                height: 40,
                                //transform: [{rotate: `${heading}deg`}]
                            }}
                            resizeMode="contain"
                        />
                    </Marker.Animated>
                    {Object.keys(destinationCords).length > 0 && (<Marker
                        coordinate={destinationCords}
                        image={require("../../../../../assets/LocationDetail/walking.png")}
                    />)}

{Object.keys(destinationCords).length > 0 && (<MapViewDirections
                        origin={curLoc}
                        destination={destinationCords}
                        apikey={MapKeyApi}
                        strokeWidth={6}
                        strokeColor="red"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" 
                            and "${params.destination}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            fetchTime(result.distance, result.duration),
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        // right: 30,
                                        // bottom: 300,
                                        // left: 30,
                                        // top: 100,
                                    },
                                });
                        }}
                        onError={(errorMessage) => {
                            // console.log('GOT AN ERROR');
                        }}
                    />)}
       {/* <Marker.Animated
       //draggable
       coordinate={{
        latitude: previousdata.pickupLocation.coordinates.latitude,
        longitude: previousdata.pickupLocation.coordinates.longitude,
      }}
       // icon={require('../../Assets/markericon.jpg')}
       //image={require('../../Assets/markericon.jpg')}
       height= {50} width= {50}
       onDragEnd={
         (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
       }
       title={'Test Marker'}
       description={'This is a description of the marker'}  
     />
         <Marker.Animated
       //draggable
       coordinate={{
        latitude:  previousdata.dropoffLocation.coordinates.latitude,
        longitude: previousdata.dropoffLocation.coordinates.longitude,
      }}
        //icon={require('../../Assets/logo.png')}
       //image={require('../../Assets/markericon.jpg')}
       height= {30} width= {30}
       onDragEnd={
         (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
       }
       //icon= 'http://google-maps-icons.googlecode.com/files/sailboat-tourism.png'
       //title={'Test Marker'}
       description={'This is a description of the marker'}
     /> */}
   
	{/* <Polyline
		coordinates={[
			{ latitude:previousdata.pickupLocation.coordinates.latitude, longitude:previousdata.pickupLocation.coordinates.longitude },
			{ latitude:previousdata.dropoffLocation.coordinates.latitude, longitude: previousdata.dropoffLocation.coordinates.longitude},
			// { latitude: 37.7665248, longitude: -122.4161628 },
			// { latitude: 37.7734153, longitude: -122.4577787 },
			// { latitude: 37.7948605, longitude: -122.4596065 },
			// { latitude: 37.8025259, longitude: -122.4351431 }
		]}
		strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
		strokeColors={[
			'#7F0000',
			'#00000000', // no color, creates a "long" gradient between the previous and next coordinate
			'#B24112',
			'#E5845C',
			'#238C23',
			'#7F0000'
		]}
		strokeWidth={5}
	/> */}
</MapView>
</View>

    </SafeAreaView>
  )
};

export default ParkCarRoute;