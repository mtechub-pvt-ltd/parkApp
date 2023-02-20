import React,{useState,useEffect,useRef} from 'react';
// Import required components
import {SafeAreaView, StyleSheet,TextInput,  Animated,ScrollView,
  Dimensions,Image,
     View,Text,TouchableOpacity,ActivityIndicator
} from 'react-native';

//////////////app pakages////////////
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';

// Import Map and Marker
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker,Circle,PROVIDER_GOOGLE,AnimatedRegion } from 'react-native-maps';
import { MapKeyApi } from '../../../utils/MapKey';

//////////////////app styles////////////////
import styles from './styles';
import Colors from '../../../utils/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
 
////////////////app redux///////////
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../../redux/actions';

/////////////////app map styles////////
import { mapDarkStyle,  mapStandardStyle } from '../../../styles/MainMap/Mapstyles';
import MapViewDirections from 'react-native-maps-directions';

//////////////app styles/////////////
import LightModestyles from '../../../styles/MainMap/LightModestyles';
import DarkModestyles from '../../../styles/MainMap/DarkModestyles';

///////////app helper functions////////////////////////////
import { locationPermission,getCurrentLocation } from '../../../helper/helperFunction';


const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.08;
const LONGITUDE_DELTA =LATITUDE_DELTA * ASPECT_RATIO;

const Route = ({navigation}) => {

  ////////////////////redux/////////////////////
  const { theme } = useSelector(state => state.userReducer);
  const dispatch = useDispatch();  

  const mapRef = useRef()
  const markerRef = useRef()
  const ref = useRef();
  const [state, setState] = useState({
    curLoc: {
        latitude: 22.6293867,
        longitude: 88.4354486,
      // latitude:    previousdata.pickupLocation.coordinates.longitude,
      // longitude:  previousdata.pickupLocation.coordinates.latitude,
        // latitude: 17.2619,
        // longitude: 78.3880,
    },
    destinationCords: {
      // latitude:    previousdata.pickupLocation.coordinates.longitude,
      //  longitude:  previousdata.pickupLocation.coordinates.latitude,
      latitude: 22.6345648,
      longitude: 88.4377279,
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

  /////////////map states////////////
  const [mapmargin, setMapMargin]=useState(1)
    const [eror, setError]=useState()
const [region, setRegion] = useState();
const [regionlat, setRegionLat] = useState();
const [regionlog, setRegionLog] = useState();
const [marker, setMarker] = useState();
const [pin, setPin] = useState();
const [pinlat, setPinLat] = useState();
const [pinlog, setPinLog] = useState();


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

      <View style={[styles.container,{marginBottom:mapmargin, backgroundColor: theme === false? 'white':'  black'}]}>
         {curLoc > 0 ? 
           
 <MapView
 ref={mapRef}
provider={PROVIDER_GOOGLE} // remove if not using Google Maps
style={styles.map}
initialRegion={{
...curLoc,
latitudeDelta: LATITUDE_DELTA,
longitudeDelta: LONGITUDE_DELTA,
}}
>

<Marker.Animated
                    ref={markerRef}
                    coordinate={
                      coordinate
                    }
                >
                    <Image
                         image={require('../../../assets/Home/CurrentPin.png')}
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
                    image={require('../../../assets/Home/CurrentPin.png')}
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

</MapView>
: null}
      </View>


  );
};
 
export default Route;

