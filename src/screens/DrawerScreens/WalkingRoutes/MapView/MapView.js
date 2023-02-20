import React,{useState,useEffect} from 'react';
// Import required components
import {SafeAreaView, StyleSheet,TextInput,  Animated,ScrollView,
  Dimensions,Image,ActivityIndicator,FlatList,
     View,Text,TouchableOpacity
} from 'react-native';

//////////////////app components//////////
import CustomHeader  from '../../../../components/Header/CustomHeader';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';

// Import Map and Marker
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker,Circle,PROVIDER_GOOGLE} from 'react-native-maps';
import { MapKeyApi } from '../../../../utils/MapKey';

///////////app markers data///////////
import { CarParkings} from '../../../../model/mapData';

/////////////app styles////////////////
import Colors from '../../../../utils/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
 
/////////////////////////app redux//////////////////
import { useSelector,useDispatch } from 'react-redux';
import { setRoute } from '../../../../redux/actions';

///////////////////////map styles////////////////
import { mapDarkStyle,mapStandardStyle } from '../../../../styles/MainMap/Mapstyles';

//////////////////app styles//////////////////
import LightModestyles from '../../../../styles/MapView/LightModestyles';
import DarkModestyles from '../../../../styles/MapView/DarkModestyles';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

//////////////////////////app api/////////////////////////
import axios from 'axios';
import { BASE_URL } from '../../../../utils/ApiRootUrl';

const WalkingRouteSearch = ({navigation,route}) => {
console.log('previous data:',route.params)

///////////////////previous data////////////
const[predata]=useState(route.params)

const press=()=>{
  navigation.navigate('LocationDetail', 'WalkingRoutes')
}
  ////////////////////redux/////////////////////
  const { theme,locationid } = useSelector(state => state.userReducer);
  const dispatch = useDispatch();  

    ////////////isfocused//////////
    const isfocussed = useIsFocused()

    const onMarkerPress = (mapEventData) => {
        const markerID = mapEventData._targetInst.return.key;
    
        let x = (markerID * CARD_WIDTH) + (markerID * 20); 
        if (Platform.OS === 'ios') {
          x = x - SPACING_FOR_CARD_INSET;
        }
    
        _scrollView.current.scrollTo({x: x, y: 0, animated: true});
      }

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);


  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);

  /////////////map states////////////
  const [eror, setError]=useState()
  const [region, setRegion] = useState();
  const [regionlat, setRegionLat] = useState();
  const [regionlog, setRegionLog] = useState();
  const [marker, setMarker] = useState();
  const [pin, setPin] = useState();
  const [pinlat, setPinLat] = useState(56.002716);
  const [pinlog, setPinLog] = useState(-4.580081);
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
  useEffect( () => {
    //if(isfocussed){
      GetWalkingRoutes()
      GetDogWalks()
      GetCarParking()
      GetToilets()
    //}

    },[]);

    ////////////////Titles States/////////////
const [WalkingRoutes,setWalkingRoutes] = useState([]);
const [DogWalks,setDogWalks] = useState([]);
const [Parking,setParking] = useState([]);
const [Toilets,setToilets] = useState([]);

    //////////////GetWalkingRoutes Api Calling////////////////////
const GetWalkingRoutes=async() => {
axios({
method: 'GET',
url: BASE_URL+'location/getLocationByTypeWithOnePic/?type=walking-route',
})
.then(async function (response) {
console.log("response here in walking-route", JSON.stringify(response.data.result))
setWalkingRoutes(response.data.result)


})
.catch(function (error) {
if(error)
{     console.log('Email or Password is incorrect')}
//setModalVisible(true)

console.log("error", error)
})
}
          //////////////GetDogWalks Api Calling////////////////////
          const GetDogWalks=async() => {
            axios({
            method: 'GET',
            url: BASE_URL+'location/getLocationByTypeWithOnePic/?type=dog-walk',
            })
            .then(async function (response) {
            console.log("response here in dog-walk", JSON.stringify(response.data.result))
            setDogWalks(response.data.result)
            })
            .catch(function (error) {
            if(error)
            {     console.log('Email or Password is incorrect')}
            //setModalVisible(true)
            
            console.log("error", error)
            })
            }
                      //////////////GetCarParking Api Calling////////////////////
const GetCarParking=async() => {

  axios({
  method: 'GET',
  url: BASE_URL+'location/getLocationByTypeWithOnePic/?type=parking',
  })
  .then(async function (response) {
  console.log("response here in parking", JSON.stringify(response.data.result))
  setParking(response.data.result)
  })
  .catch(function (error) {
  if(error)
  {     console.log('Email or Password is incorrect')}
  //setModalVisible(true)
  
  console.log("error", error)
  })
  }
            //////////////GetToilets Api Calling////////////////////
const GetToilets=async() => {
  axios({
  method: 'GET',
  url: BASE_URL+'location/getLocationByTypeWithOnePic/?type=toilet',
  })
  .then(async function (response) {
  console.log("response here in toilet", JSON.stringify(response.data.result))
  setToilets(response.data.result)

  })
  .catch(function (error) {
  if(error)
  {     console.log('Email or Password is incorrect')}
  //setModalVisible(true)
  
  console.log("error", error)
  })
  }
  
  const interpolations = Parking.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      ((index + 1) * CARD_WIDTH),
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp"
    });

    return { scale };
  });
// useEffect(() => {
//     if (isfocussed) {
//         //GetcurrLocation()
//     }
//     // mapAnimation.addListener(({ value }) => {
//     //   let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
//     //   if (index >= CarParkings.length) {
//     //     index = CarParkings.length - 1;
//     //   }
//     //   if (index <= 0) {
//     //     index = 0;
//     //   }

//       // clearTimeout(regionTimeout);

//       // const regionTimeout = setTimeout(() => {
//       //   if( mapIndex !== index ) {
//       //     mapIndex = index;
//       //     const { coordinate } =CarParkings[index];
//       //     _map.current.animateToRegion(
//       //       {
//       //         ...coordinate,
//       //         latitudeDelta:region.latitudeDelta,
//       //         longitudeDelta: region.longitudeDelta,
//       //       },
//       //       350
//       //     );
//       //   }
//       // }, 10);
//    // });
//   },[isfocussed]);

const reduxwalkingroutes=(props)=>{
console.log("here in func:",props)

  //dispatch(setRoute(props._id))
      //navigation.navigate('LocationDetail','Walking Routes')
}
  return (

      <View style={[LightModestyles.container,{ backgroundColor: theme === false? 'white':'  black'}]}>

         {/* {regionlat && regionlog > 0 ?  */}
        <MapView
        ref={_map}
          style={LightModestyles.mapStyle}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          showsUserLocation={false}
          //zoomEnabled={true}
          initialRegion={      {
            latitude: pinlat,
            longitude: pinlog,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          customMapStyle={theme === false? mapStandardStyle :  mapDarkStyle}
        >

                  {route.params === 'WalkingRoute'  && WalkingRoutes != ''?
                  WalkingRoutes.map((marker, index) => {
          // const scaleStyle = {
          //   transform: [
          //     {
          //       scale: interpolations[index].scale,
          //     },
          //   ],
          // };
          return (
        
            <Marker key={index} 
            //coordinate={marker.coordinate} 
            coordinate={
              {      
                      latitude: marker.location.coordinates[0],
                      longitude: marker.location.coordinates[1]
            }}
            onPress={(e)=>onMarkerPress(e)}>
              <Animated.View style={[LightModestyles.markerWrap]}>
                <Image
                  source={require('../../../../assets/mainSeacrh/WalkingRoute.png')}
                  style={[LightModestyles.marker]}
                  resizeMode='cover'
                />
              </Animated.View>
            </Marker>
 
          );
        }):
        route.params === 'DogWalks' && DogWalks!= ''?
        DogWalks.map((marker, index) => {
          // const scaleStyle = {
          //   transform: [
          //     {
          //       scale: interpolations[index].scale,
          //     },
          //   ],
          // };
          return (
        
            <Marker key={index} 
            //coordinate={marker.coordinate} 
            coordinate={
              {      
                      latitude: marker.location.coordinates[0],
                      longitude: marker.location.coordinates[1]
            }}
            onPress={(e)=>onMarkerPress(e)}>
              <Animated.View style={[LightModestyles.markerWrap]}>
                <Image
                  source={require('../../../../assets/mainSeacrh/DogWalks.png')}
                  style={[LightModestyles.marker]}
                  resizeMode='cover'
                />
              </Animated.View>
            </Marker>
 
          );
        }):
        route.params === 'CarParkings' && Parking != ''?
        Parking.map((marker, index) => {
          // const scaleStyle = {
          //   transform: [
          //     {
          //       scale: interpolations[index].scale,
          //     },
          //   ],
          // };
          return (
        
            <Marker key={index} 
            //coordinate={marker.coordinate} 
            coordinate={
              {      
                      latitude: marker.location.coordinates[0],
                      longitude: marker.location.coordinates[1]
            }}
            onPress={(e)=>onMarkerPress(e)}>
              <Animated.View style={[LightModestyles.markerWrap]}>
                <Image
                  source={require('../../../../assets/mainSeacrh/CarParkings.png')}
                  style={[LightModestyles.marker]}
                  resizeMode='cover'
                />
              </Animated.View>
            </Marker>
 
          );
        }):
        route.params === 'Toilets' && Toilets != ''?
        Toilets.map((marker, index) => {
          // const scaleStyle = {
          //   transform: [
          //     {
          //       scale: interpolations[index].scale,
          //     },
          //   ],
          // };
          return (
        
            <Marker key={index} 
            //coordinate={marker.coordinate} 
            coordinate={
              {      
                      latitude: marker.location.coordinates[0],
                      longitude: marker.location.coordinates[1]
            }}
            onPress={(e)=>onMarkerPress(e)}>
              <Animated.View style={[LightModestyles.markerWrap]}>
                <Image
                  source={require('../../../../assets/mainSeacrh/Toilets.png')}
                  style={[LightModestyles.marker]}
                  resizeMode='cover'
                />
              </Animated.View>
            </Marker>
 
          );
        })
        :
        null
        }
                    {marker != ''?
                  <Marker
                  //draggable={true}
                  coordinate={
                    {      
                            latitude: pinlat,
                    longitude: pinlog}}
                    title={'title'}
                    description={'here'}
                    image={require('../../../../assets/Home/CurrentPin.png')}
                    // onDragStart={(e)=>
                    //   console.log('Darg Start:',e.nativeEvent.coordinate)}
                      onDragEnd={(e)=>
                       {  console.log('Drag End:',e.nativeEvent.coordinate),
                       setPinLat(e.nativeEvent.coordinate.latitude)
                       setPinLog(e.nativeEvent.coordinate.longitude)
                        alert('DragEnd:',pinlat,pinlog)}
                      }
             
                  />
                  :
                  null
                }
       {/* {pinlat && pinlog > 0 ?  */}
<Circle center={{latitude:pinlat,longitude:pinlog}} radius={1000}
strokeWidth={1.5}
strokeColor={Colors.Appthemecolorprimary}
fillColor={'rgba(26,81,59,0.2)'}
/>
         {/* :
         null
              } */}
        </MapView>
        {/* :
        <ActivityIndicator
        size={'large'}
        style={{marginTop: hp(45)}}
      />
      } */}

<CustomHeader
headerlabel={ route.params === 'WalkingRoute'?'Walking Routes':  route.params === 'DogWalks'?'Dog Walks': 
route.params === 'CarParkings'?'Car Parking':  route.params === 'Toilets'?'Toilets': null}
iconPress={() => {navigation.toggleDrawer()}}
icon={'menu'}
/>
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={LightModestyles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET, 
          bottom: 0,
          right: SPACING_FOR_CARD_INSET
        }}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                }
              },
            },
          ],
          {useNativeDriver: true}
        )}
      >
        {route.params === 'WalkingRoute' && WalkingRoutes != ''?
        WalkingRoutes.map((marker, index) =>(
          <TouchableOpacity
          activeOpacity={1}
          onPress={async ()=>
           {
           //reduxwalkingroutes(marker)
     //await
     //dispatch(setLOCID(marker._id)),
              navigation.navigate('LocationDetail',{navplace:'Walking Routes',locid:marker._id})
          
      
    
           //console.log("here id ",id)
            
            //navigation.navigate('LocationDetail','Walking Routes')
          }
           }>
         <View style={[LightModestyles.card,{backgroundColor:theme === false ? 'white':'rgba(52, 52, 52, 1)'}]} 
         key={index}>
          <Image 
                  source={{uri:marker.images.length === 0 ?null:marker.images[0].image_url}}
                  style={LightModestyles.cardImage}
                  resizeMode="cover"
                />
            <View style={LightModestyles.textContent}>
              <Text numberOfLines={1} style={[LightModestyles.cardtitle,,
                {color:theme === false ? 'rgba(69, 79, 99, 1)':'white'}]}>{marker.title}</Text>
              <View style={{flexDirection:"row"}}>
              <Text numberOfLines={5} style={[LightModestyles.cardDescription,
                {color:theme === false ? 'rgba(120, 132, 158, 1)':'white'}]}>{marker.description}</Text>
              <View style={{marginTop:hp(5)}}>
              <Image 
                  source={require('../../../../assets/Home/save.png')}
                  style={{width:wp(5),height:hp(5)}}
                  resizeMode='contain'
                />
                </View>
            </View>
          </View>
          </View>
          </TouchableOpacity>
        ))
      :
      route.params === 'DogWalks' && DogWalks != ''?
        DogWalks.map((marker, index) =>(
          <TouchableOpacity 
          activeOpacity={1}
          onPress={()=>navigation.navigate('LocationDetail',{navplace:'Dogs Walk',locid:marker._id})}>
          <View style={[LightModestyles.card,{backgroundColor:theme === false ? 'white':'rgba(52, 52, 52, 1)'}]} 
           key={index}>
          <Image 
             source={{uri:marker.images.length === 0 ?null:marker.images[0].image_url}}
                 // source={marker.image}
                  style={LightModestyles.cardImage}
                  resizeMode="cover"
                />
            <View style={LightModestyles.textContent}>
              <Text numberOfLines={1} style={[LightModestyles.cardtitle,
                {color:theme === false ? 'rgba(69, 79, 99, 1)':'white'}]}>{marker.title}</Text>
              <View style={{flexDirection:"row"}}>
              <Text numberOfLines={5} style={[LightModestyles.cardDescription,
                {color:theme === false ? 'rgba(120, 132, 158, 1)':'white'}]}>{marker.description}</Text>
              <View style={{marginTop:hp(5)}}>
              <Image 
                  source={require('../../../../assets/Home/save.png')}
                  style={{width:wp(5),height:hp(5)}}
                  resizeMode='contain'
                />
                </View>
            </View>
          </View>
          </View>                              
          </TouchableOpacity>
        ))
        :
        route.params === 'CarParkings' && Parking != '' ?
        Parking.map((marker, index) =>(
          <TouchableOpacity 
          activeOpacity={1}
          onPress={()=>navigation.navigate('LocationDetail',{navplace:'Car Parkings',locid:marker._id})}>
          <View style={[LightModestyles.card,{backgroundColor:theme === false ? 'white':'rgba(52, 52, 52, 1)'}]} 
           key={index}>
          <Image 
             source={{uri:marker.images.length === 0 ?null:marker.images[0].image_url}}
                  //source={marker.image}
                  style={LightModestyles.cardImage}
                  resizeMode="cover"
                />
            <View style={LightModestyles.textContent}>
              <Text numberOfLines={1} style={[LightModestyles.cardtitle,
                {color:theme === false ? 'rgba(69, 79, 99, 1)':'white'}]}>{marker.title}</Text>
              <View style={{flexDirection:"row"}}>
              <Text numberOfLines={5} style={[LightModestyles.cardDescription,
                {color:theme === false ? 'rgba(120, 132, 158, 1)':'white'}]}>{marker.description}</Text>
              <View style={{marginTop:hp(5)}}>
              <Image 
                  source={require('../../../../assets/Home/save.png')}
                  style={{width:wp(5),height:hp(5)}}
                  resizeMode='contain'
                />
                </View>
            </View>
          </View>
          </View>        
          </TouchableOpacity>
        ))
        :
        route.params === 'Toilets' && Toilets != ''?
      Toilets.map((marker, index) =>(

        <TouchableOpacity 
        activeOpacity={1}
        onPress={()=>navigation.navigate('LocationDetail',{navplace:'Toilets',locid:marker._id})}>
          <View style={[LightModestyles.card,{backgroundColor:theme === false ? 'white':'rgba(52, 52, 52, 1)'}]} 
           key={index}>
          <Image 
             source={{uri:marker.images.length === 0 ?null:marker.images[0].image_url}}
                  //source={marker.image}
                  style={LightModestyles.cardImage}
                  resizeMode="cover"
                />
            <View style={LightModestyles.textContent}>
              <Text numberOfLines={1} style={[LightModestyles.cardtitle,
                {color:theme === false ? 'rgba(69, 79, 99, 1)':'white'}]}>{marker.title}</Text>
              <View style={{flexDirection:"row"}}>
              <Text numberOfLines={5} style={[LightModestyles.cardDescription,
                {color:theme === false ? 'rgba(120, 132, 158, 1)':'white'}]}>{marker.description}</Text>
              <View style={{marginTop:hp(5)}}>
              <Image 
                  source={require('../../../../assets/Home/save.png')}
                  style={{width:wp(5),height:hp(5)}}
                  resizeMode='contain'
                />
                </View>
            </View>
          </View>
                                  
   
          </View>      
          </TouchableOpacity>      
        ))
        : null
      }
      </Animated.ScrollView>
      </View>
  );
};
 
export default WalkingRouteSearch;

