import React,{useState,useEffect} from 'react';
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
import MapView, {Marker,Circle,PROVIDER_GOOGLE,Polyline} from 'react-native-maps';
import { MapKeyApi } from '../../../../utils/MapKey';

//////////////////app styles////////////////
import Colors from '../../../../utils/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
 
////////////////app redux///////////
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../../redux/actions';

/////////////////app map styles////////
import { mapDarkStyle, mapStandardStyle } from '../../../../styles/MainMap/Mapstyles';
//////////////app styles/////////////
import LightModestyles from '../../../../styles/MainMap/LightModestyles';
import DarkModestyles from '../../../../styles/MainMap/DarkModestyles';

const { width, height } = Dimensions.get("window");



const MapRoute = ({navigation}) => {

  ////////////////////redux/////////////////////
  const { theme } = useSelector(state => state.userReducer);
  const dispatch = useDispatch();  

    ////////////isfocused//////////
    const isfocussed = useIsFocused()


  const _map = React.useRef(null);

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
/////////////user current location////////////////
const GetcurrLocation=()=>{
  Geocoder.init(MapKeyApi); 
  Geolocation.getCurrentPosition(
                  (position) => {
                    setRegionLat(position.coords.latitude)
                    setRegionLog(position.coords.latitude)
                  setRegion({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0462,
                    longitudeDelta: 0.0261,
                  });
                  console.log('map regions:',region)
                  setMarker({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    // latitudeDelta: 0.0462,
                    // longitudeDelta: 0.0261,
                  });
                      Geocoder.from(position.coords.latitude,
                         position.coords.longitude)
                          .then(json => {
                              console.log(json);
      var addressComponent = json.results[0].address_components;
                          })

                          .catch(error => console.warn(error));
                  },
                  (error) => {
                      // See error code charts below.
                  
                              setError(error.message)
                     
                          console.log(error.code, error.message);
                  },
                  {
                      enableHighAccuracy: false,
                      timeout: 10000,
                      maximumAge: 100000
                  }
              );
}
useEffect(() => {
  if (isfocussed) {
    GetcurrLocation()
}
  },[isfocussed]);
  return (

      <View style={[LightModestyles.container,{marginBottom:mapmargin, backgroundColor: theme === false? 'white':'  black'}]}>
          {regionlat && regionlog > 0 ? 
        <MapView
        ref={_map}
          style={[LightModestyles.mapStyle,{marginBottom:mapmargin}]}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          showsUserLocation={false}
          showsMyLocationButton={true}
          //onRegionChange={GetcurrLocation()}
          onMapReady={()=> { setMapMargin(0)} }
          zoomEnabled={true}
          region={region}
        customMapStyle={theme === false? mapStandardStyle :  mapDarkStyle}
        >
                    {marker != ''?
                  <Marker
                  draggable={true}
                  coordinate={marker}
                    title={'title'}
                    description={'here'}
                    image={require('../../../../assets/Home/CurrentPin.png')}
                    onDragStart={(e)=>
                      console.log('Darg Start:',e.nativeEvent.coordinate)}
                      onDragEnd={(e)=>
                       { console.log('Darg Start:',e.nativeEvent.coordinate),
                       setPinLat(e.nativeEvent.coordinate.latitude)
                       setPinLog(e.nativeEvent.coordinate.longitude)
                        console.log('Darg Start:',pinlat,pinlog),
                        setPin({
                          latitude:e.nativeEvent.coordinate.latitude,
                          longitude:e.nativeEvent.coordinate.longitude
                        })}
                      }
             
                  />
                  :
                  null
                }
       {pinlat && pinlog > 0 ? 
<Circle center={{latitude:pinlat,longitude:pinlog}}  radius={500}
strokeWidth={2}
strokeColor={'black'}
fillColor={Colors.Appthemecolorprimary}
/>

         :
         null
              }
              <Polyline
		coordinates={[
		
           { latitude:  22.6345648,longitude: 88.4354486},
			{ latitude: 88.4354486,  longitude: 22.6345648},
			{ latitude:  22.6345648, longitude:  22.6345648 },
			{ latitude: 37.8025259, longitude: -122.4351431 }
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
	/>
        </MapView>
        :
        <ActivityIndicator
        size={'large'}
        style={{marginTop: hp(45),
        backgroundColor:theme=== false?'white': 'black'
        }}
      />
      }
      <View style={[LightModestyles.searchBox,{backgroundColor:theme === false ? 'white':'rgba(52, 52, 52, 1)',
    borderColor:theme === false ? 'white':'black'
    }]}>
      <Ionicons name={'menu'} size={25} 
          color= {theme ===false? 'black':'white'}
          onPress={() => navigation.toggleDrawer()}/>
        <TextInput 
          placeholder="Search here"
          //editable={false}
          placeholderTextColor={theme === false ? 'black':'white'}
          autoCapitalize="none"
          style={{flex:1,padding:0,backgroundColor:theme === false ? 'white':'rgba(52, 52, 52, 1)',
        color:theme === false ? 'black':'white',
        marginLeft:wp(5)
      }}
        />
    
      </View>


    

      </View>


  );
};
 
export default MapRoute;

