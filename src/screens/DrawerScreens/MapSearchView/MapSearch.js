import React,{useState,useEffect,useRef} from 'react';
// Import required components
import {SafeAreaView, StyleSheet,TextInput,  Animated,ScrollView,BackHandler,
  Dimensions,Image,
     View,Text,TouchableOpacity,ActivityIndicator,TouchableHighlight
} from 'react-native';

import { IconButton } from 'react-native-paper';

//////////app components/////////
import LocationsBottomSheet from '../../../components/LocationTypes/LocationTypes';
import MapThemeBottomSheet from '../../../components/LocationTypes/MapTheme';
import AddedtosaveBottomSheet from '../../../components/Findings/AddtoSave';
import CustomHeader from '../../../components/Header/CustomHeader';

//////////////app pakages////////////
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';

// Import Map and Marker
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker,Circle,PROVIDER_GOOGLE,AnimatedRegion } from 'react-native-maps';
import { MapKeyApi } from '../../../utils/MapKey';

//////////////////app styles////////////////
import Colors from '../../../utils/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
 
////////////////app redux///////////
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../../redux/actions';

/////////////////app map styles////////
import { mapDarkStyle,  mapStandardStyle } from '../../../styles/MainMap/Mapstyles';

//////////////app styles/////////////
import LightModestyles from '../../../styles/MainMap/LightModestyles';
import DarkModestyles from '../../../styles/MainMap/DarkModestyles';

//////////////////pins////////////////////////
import { WalkingRoutes } from '../../../model/mapData';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

//////////////////////////app api/////////////////////////
import axios from 'axios';
import { BASE_URL } from '../../../utils/ApiRootUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MapSearch = ({navigation}) => {

  ////////////////////redux/////////////////////
  const { theme ,maptheme} = useSelector(state => state.userReducer);
  const dispatch = useDispatch();  

          //////////locationtype state/////////////
          const refRBSheet = useRef();  
          const refRBSheetmaptypes = useRef();  
    const refRBSheetSaveAdded=useRef();

    ////////////isfocused//////////
    const isfocussed = useIsFocused()

       //////////////////////map default location///////////////////
       const userlocationtogglebutton =()=>{
        if(usercurrloc === true)
        {
          console.log("location here:",usercurrloc)
          defaultlocation()
          //usercurrloc(false)
        }
        else{
          GetcurrLocation()
          //usercurrloc(true)
        }
      }

             //////////////////////map All locations///////////////////
             const alllocationtogglebutton =()=>{
              if(allloc === true)
              {
                setAllloc(false)
                //GetcurrLocation()
              }
              else{
            
                setAllloc(true)
                //defaultlocation()
              }
            }
    //////////////////////map default location///////////////////
    const defaultlocation =()=>{
      //setuserloc(true)
      setPinLat(56.002716)
      setPinLog(-4.580081)
      setusercurrloc(false)

    }

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);


  const _map = React.useRef(null);

  /////////////map states////////////
  const [mapmargin, setMapMargin]=useState(1)
    const [eror, setError]=useState()
const [region, setRegion] = useState();
const [marker, setMarker] = useState();
const [pinlat, setPinLat] = useState(56.002716);
const [pinlog, setPinLog] = useState(-4.580081);
const [userloc, setuserloc] = useState(false);


////////////////usercurrrent location///////////
const [usercurrloc, setusercurrloc] = useState(false);

////////////////All location///////////
const [allloc, setAllloc] = useState(false);

////////////////get user current location///////////
const [usercurrlocLat, setusercurrlocLat] = useState();
const [usercurrlocLng, setusercurrlocLng] = useState();

//const [userloc, setuserloc] = useState(false);
/////////////user current location////////////////
const GetcurrLocation=()=>{
  // setRegionLat(56.002716)
  // setRegionLog(-4.580081)
  // setPinLat(56.002716)
  // setPinLog(-4.580081)
  Geocoder.init(MapKeyApi); 
  Geolocation.getCurrentPosition(
                  (position) => {
                    setPinLat(55.98798763297044)
                    setPinLog(-4.5761023834347725)
                    // setusercurrlocLat('55.98798763297044')
                    // setusercurrlocLng('-4.5761023834347725')
                    // setusercurrlocLat(position.coords.latitude)
                    // setusercurrlocLng(position.coords.latitude)
                  setusercurrloc(true)
                  //setAllloc(false)
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
GetLocation()
GetUser()
}
    // Change the state every second or the time given by User.
    const interval = setInterval(() => {
      setShowText((showText) => !showText);
    }, 1000);
    return () => clearInterval(interval);
  },[isfocussed]);
//////////////// location data state///////////
const [pinsdata, setPinsdata] = useState();
  //////////////Api Calling////////////////////
const GetLocation=async() => {
  console.log('here',BASE_URL+'location/getAllLocations')
  axios({
  method: 'GET',
  url: BASE_URL+'location/getAllLocations',
  })
  .then(async function (response) {
  console.log("response here in LOCATION", JSON.stringify(response.data.data))
  setPinsdata(response.data.data)
      //navigation.navigate('Drawerroute')
  })
  .catch(function (error) {
  if(error)
  {     console.log('Email or Password is incorrect')}
  //setModalVisible(true)
  
  console.log("error", error)
  })
  }
//////////////// location data state///////////
const [ParkingDetail, setParkingDetail] = useState();
const [ParkingID, setParkingID] = useState();
const [ParkingTime, setParkingTime] = useState();
const [count, setcount] = useState(1);
//const count =0
  //////////////Api Calling////////////////////
const GetUser=async() => {
  var user= await AsyncStorage.getItem('Userid')
  console.log("userid:",user,count)
  axios({
  method: 'GET',
  url: BASE_URL+'user/getUser/'+user,
  })
  .then(async function (response) {
  console.log("response here in get useer detail", JSON.stringify(response.data))
  setParkingDetail(response.data.userDetails[0].user_parkings[0].isParked)
  //setParkingDetail(response.data.userDetails[0].user_parkings)
  setParkingID(response.data.userDetails[0].user_parkings[0]._id)
  setParkingTime(response.data.userDetails[0].user_parkings[0].parkTime)
  })
  .catch(function (error) {
  if(error)
  {     console.log('Email or Password is incorrect')}
  //setModalVisible(true)
  
  console.log("error", error)
  })
  }
  const [showText, setShowText] = useState(true);
///////////////Data states/////////
const [Findings,  setFindings] = React.useState();
//////////////////////Api Calling/////////////////
const UnParkCar = async(props) => {
 var user= await AsyncStorage.getItem('Userid')
 console.log("userid:",user,props)
 var date =new Date().toLocaleString()
//var totaltime=ParkingTime-date
console.log("total time of parking:",date)
   axios({
     method: 'PUT',
     url: BASE_URL + 'parking/unPark',
     data: {
      parkingId : props,
    unParkTime: date,
    totalParkingTime :"10 hours"
     },
   })
     .then(function (response) {
       console.log("response", JSON.stringify(response.data))
       setcount(count+1)
       refRBSheetSaveAdded.current.open()

     })
     .catch(function (error) {
       console.log("error", error)
     })
 }
//  useEffect(() => {
//   // back handle exit app
//   BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
//   return () => {
//       BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
//   };
// }, []);
// let backHandlerClickCount = 0;
// const backButtonHandler = () => {
//   const shortToast = message => {
//       Toast.show(message, {
//           duration: Toast.durations.LONG,
//           position: Toast.positions.BOTTOM,
//       });
//   }
//   let backHandlerClickCount;
//   backHandlerClickCount += 1;
//   if ((backHandlerClickCount < 2)) {
//       shortToast('Press again to quit the application');
//   } else {
//       BackHandler.exitApp();
//   }

//   // timeout for fade and exit
//   setTimeout(() => {
//       backHandlerClickCount = 0;
//   }, 1000);
  
//   return true;
// }
  return (
      <View style={[LightModestyles.container,{marginBottom:mapmargin, backgroundColor: theme === false? 'white':'  black'}]}>
        <MapView
        ref={_map}
          style={[LightModestyles.mapStyle,{marginBottom:mapmargin}]}
         provider={PROVIDER_GOOGLE} // remove if not using Google Maps 
          onMapReady={()=> { setMapMargin(0)} }
          zoomEnabled={true}
          //showsUserLocation={true}
          //zoomControlEnabled={true}
          followsUserLocation={setusercurrloc} 
          onRegionChange ={() => setuserloc(true)}
          onRegionChangeComplete={
            _map.current?.animateToRegion({
              latitude: pinlat,
              longitude: pinlog,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
              //duration: 1
            })
       
          } 
          initialRegion={      {
            latitude: pinlat,
            longitude: pinlog,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onLayout={()=>{
            _map.current.fitToCoordinates({latitude: pinlat, longitude: pinlog})
          }}
        customMapStyle={theme === false? mapStandardStyle :  mapDarkStyle}
        >
                  {allloc === true?
                  pinsdata.map((marker, index) => {
          return (
        
            <Marker key={index} 
            coordinate={
              {      
                      latitude: marker.location.coordinates[0],
                      longitude: marker.location.coordinates[1]
            }}
            //coordinate={location.coordinates} 
           // onPress={(e)=>onMarkerPress(e)}
           >
              <Animated.View style={[LightModestyles.markerWrap,{alignItems:'center'}]}>
                <Image
                  source={
                    marker.type === "walking-route"?
                    require('../../../assets/AllLocations/WalkingRoute.png'):
                    marker.type === "parking"?
                    require('../../../assets/AllLocations/CarParking.png'):
                    marker.type === "dog-walk"?
                    require('../../../assets/AllLocations/DogWalks.png'):
                    marker.type ===  "toilet"?
                    require('../../../assets/AllLocations/Toilet.png'):
                    null
                  }
                  style={[LightModestyles.marker]}
                  resizeMode='contain'
                />
                    <Text numberOfLines={2} 
              style={[LightModestyles.cardDescription,
                {color:Colors.Appthemecolorprimary
                 // theme === false ? 'black':'white'
                }]}
                >
                      { marker.type === "walking-route"?'Walking routes'
                      :
                      marker.type === "parking"?'Car Parking'
                      :
                      marker.type === "dog-walk"? 'Dogs Walks'
                      :
                      marker.type ===  "toilet"? 'Toilet Locations':null}
                       </Text>
              </Animated.View>
            </Marker>
 
          );
        }):null}
                    {marker != ''?
                  <Marker
                  draggable={true}
                  coordinate={
                    {      
                    //latitude: pinlat,
                    //longitude: pinlog
                    latitude:56.002716,
                    longitude: -4.580081
                  }}
                    title={'title'}
                    description={'here'}
                    image={require('../../../assets/Home/CurrentPin.png')}
                    onDragStart={(e)=>
                      console.log('Darg Start:',e.nativeEvent.coordinate)}
                      onDragEnd={(e)=>
                       { console.log('Darg Start:',e.nativeEvent.coordinate),
                       setPinLat(e.nativeEvent.coordinate.latitude)
                       setPinLog(e.nativeEvent.coordinate.longitude)
                        console.log('Darg Start:',pinlat,pinlog)}
                      }
                  />
                  :
                  null
                }
      

<Circle center={{latitude:56.002716,longitude:-4.580081}}  radius={1000}
strokeWidth={1.5}
strokeColor={Colors.Appthemecolorprimary}
fillColor={'rgba(26,81,59,0.2)'}
/>
{marker != ''?
                  <Marker
                  draggable={true}
                  coordinate={
                    {      
                  latitude: pinlat,
                  longitude: pinlog
                    // latitude:56.002716,
                    // longitude: -4.580081
                  }}
                    title={'title'}
                    description={'here'}
                    image={require('../../../assets/Home/CurrentPin.png')}
                    width={wp(12)}
                    height={hp(12)}
                    onDragStart={(e)=>
                      console.log('Darg Start:',e.nativeEvent.coordinate)}
                      onDragEnd={(e)=>
                       { console.log('Darg Start:',e.nativeEvent.coordinate),
                       setPinLat(e.nativeEvent.coordinate.latitude)
                       setPinLog(e.nativeEvent.coordinate.longitude)
                        console.log('Darg Start:',pinlat,pinlog)}
                      }
                  />
                  :
                  null
                }
        </MapView>
        <CustomHeader
headerlabel={ 'BALOCH PARK'}
iconPress={() => {navigation.toggleDrawer()}}
icon={'menu'}
/>
      {ParkingDetail === true?   
       <TouchableOpacity onPress={()=>
         UnParkCar(ParkingID)
        }
        style={[LightModestyles.carparkingview,
          {backgroundColor:theme === false ? 'white':'rgba(52, 52, 52, 1)',
          //allloc === true? Colors.Appthemecolorprimary:'rgba(52, 52, 52, 1)'
          //theme === false ? 'white':'rgba(52, 52, 52, 1)',
}]}>
            <View style={[LightModestyles.carContent]}>
            <IconButton
                icon={require('../../../assets/Home/CarParkings.png')}
                //icon="image"
                color={'red'}
                size={45}
                style={{display: showText ? 'none' : 'flex'}}
                // onPress={() =>
                //  // alllocationtogglebutton()
                // }
              />
            </View>
        </TouchableOpacity>:
        null}
      <View style={{bottom:wp(25),right:0,position: "absolute",paddingBottom:hp(0)}}>

  {theme === false ?    

              <TouchableOpacity onPress={()=>   alllocationtogglebutton()}>
              <View 
              style={[LightModestyles.currentlocationview,
                {backgroundColor:allloc === true? Colors.Appthemecolorprimary:'white'
                //theme === false ? 'white':'rgba(52, 52, 52, 1)',
      }]}
               >
                  <View style={[LightModestyles.textContent]}>
                  <IconButton
                      icon={require('../../../assets/Home/eye.png')}
                      //icon="image"
                      color={allloc === true? 'white':Colors.Appthemecolorprimary}
                      size={wp(6)}
                      onPress={() =>
                        alllocationtogglebutton()
                      }
                    />
      
                  </View>
                </View>
              </TouchableOpacity>
        :
  
           <TouchableOpacity onPress={()=>   alllocationtogglebutton()}>
           <View 
           style={[LightModestyles.currentlocationview,
             {backgroundColor:allloc === true? Colors.Appthemecolorprimary:'rgba(52, 52, 52, 1)'
             //theme === false ? 'white':'rgba(52, 52, 52, 1)',
   }]}
            >
               <View style={[LightModestyles.textContent]}>
               <IconButton
                   icon={require('../../../assets/Home/eye.png')}
                   //icon="image"
                   color={allloc === true? 'white':Colors.Appthemecolorprimary}
                   size={wp(6)}
                   onPress={() =>
                     alllocationtogglebutton()
                   }
                 />
   
               </View>
             </View>
           </TouchableOpacity>
        }
    {theme === false ?   
           <TouchableOpacity onPress={()=>
            {
              userlocationtogglebutton()
            }}>
          <View 
          style={[LightModestyles.currentlocationview,{
            backgroundColor:usercurrloc === true? Colors.Appthemecolorprimary:'white'
            //theme === false ? 'white':'rgba(52, 52, 52, 1)'
          }]}
           >
           
              <IconButton
                  icon={require('../../../assets/Home/currentlocation.png')}
                  //icon="image"
                  color={usercurrloc === true? 'white':Colors.Appthemecolorprimary}
                  size={24}
                  onPress={() =>
                   { 
                    userlocationtogglebutton()
                  }
                  }
                />
      
              
            </View>
          </TouchableOpacity>
          :
          
          <TouchableOpacity onPress={()=>
            {
              userlocationtogglebutton()
            }}>
          <View 
          style={[LightModestyles.currentlocationview,{
            backgroundColor:usercurrloc === true? Colors.Appthemecolorprimary:'rgba(52, 52, 52, 1)'
            //theme === false ? 'white':'rgba(52, 52, 52, 1)'
          }]}
           >
              <View style={LightModestyles.textContent}>
              <IconButton
                  icon={require('../../../assets/Home/currentlocation.png')}
                  //icon="image"
                  color={usercurrloc === true? 'white':Colors.Appthemecolorprimary}
                  size={24}
                  onPress={() =>
                   { 
                    userlocationtogglebutton()
                  }
                  }
                />
              </View>
              
            </View>
          </TouchableOpacity>
          }
      </View>
      <Animated.View
style={LightModestyles.lastView}
      > 
      <View style={{backgroundColor:theme === false ? 'white':'rgba(52, 52, 52, 1)',
      height:hp(12),borderTopWidth:8,borderTopColor:Colors.Appthemecolorprimary,
    width:wp(100),borderTopLeftRadius:wp(2),borderTopRightRadius:wp(2),justifyContent:'center'}}>
      <TouchableOpacity onPress={()=> refRBSheet.current.open()}
       activeOpacity={1}
      >
      <View style={{flexDirection:'row',marginHorizontal:wp(5),alignItems:'center'}}>
      <Ionicons name={'chevron-up'} size={23} 
          color= {theme ===false? 'grey':'white'}
          onPress={() => refRBSheet.current.open()}/>
          <View style={{marginLeft:wp(3)}}>
          <Text numberOfLines={2} 
              style={[LightModestyles.cardDescription,
                {color:Colors.Appthemecolorprimary,marginTop:hp(0)
                 // theme === false ? 'black':'white'
                }]}
                >What 's Nearby</Text>
                      {/* <Text numberOfLines={5} 
              style={[LightModestyles.cardsubDescription,
                {color:theme === false ? 'black':'white'}]}
                >Lorem</Text> */}
          </View>
          </View>
      </TouchableOpacity>
      </View>
      </Animated.View>
      <LocationsBottomSheet
              refRBSheet={refRBSheet}
              onClose={() => refRBSheet.current.close()}
              title={'Gallery'}
            />
                  <MapThemeBottomSheet
              refRBSheet={refRBSheetmaptypes}
              onClose={() => refRBSheetmaptypes.current.close()}
              title={'Gallery'}
            />
                                     <AddedtosaveBottomSheet
              refRBSheet={refRBSheetSaveAdded}
              onClose={() => {refRBSheetSaveAdded.current.close()}}
              title={'Sucessfully Add to Saved'}
            />
      </View>


  );
};
 
export default MapSearch;

