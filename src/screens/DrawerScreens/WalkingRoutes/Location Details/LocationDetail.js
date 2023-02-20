import React, { useRef,useState,useEffect }from "react";
import { Text, SafeAreaView, View,Image,ActivityIndicator,
    TouchableOpacity,ScrollView,
} from "react-native";

///////////////app naviagtion////////////////
  import { useIsFocused } from '@react-navigation/native';

///////////app components////////////
import CustomButton from "../../../../components/Button/CustomButton";
import OutlineButton from "../../../../components/Button/OutlineButton";
import ImageSlider from "../../../../components/ImageSlider/ImageSlider";
import CustomHeader from "../../../../components/Header/CustomHeader";
import FindingsBottomSheet from "../../../../components/Findings/Findings";
import FindMyCarBottomSheet from "../../../../components/Findings/FindMyCar";
import EditFindingsBottomSheet from "../../../../components/Findings/EditFindings";
import AddedtosaveBottomSheet from "../../../../components/Findings/AddtoSave";


////////////app Api things////////////
import axios from 'axios';
import { BASE_URL } from "../../../../utils/ApiRootUrl";
import AsyncStorage from '@react-native-async-storage/async-storage';

////////////////app redux///////////
import { useSelector,useDispatch } from 'react-redux';
import { setLOCID,setRoute } from '../../../../redux/actions';

//////////////app styles////////////////
import Colors from "../../../../utils/Colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} 
from 'react-native-responsive-screen';

////////////////app styles///////////
import LightModestyles from "../../../../styles/LocationDetail/LightModestyles";
import DarkModestyles from "../../../../styles/LocationDetail/DarkModestyles";
import styles from "../../MapSearchView/styles";


const LocationDetail= ({navigation,route}) => {
console.log("navp,ace ghere:",route.params)
      ////////////isfocused//////////
      const isfocussed = useIsFocused()

  /////////////////prevoius data state////////
  const[predata]=useState(route.params)

      ////////////////////redux/////////////////////
      const { theme,locationid,routeid } = useSelector(state => state.userReducer);
      const dispatch = useDispatch();  

    //bottomsheets states
    const refRBSheet = useRef();
    const refRBSheetSaveAdded=useRef();
    const refRBSheetEditFindings = useRef();
    const refFindMyCarRBSheet = useRef();


    //sliderimages
    const[sliderimage,setsliderimage]=useState([])

//faltlist state
const [data, setdata]=useState()
const [LocationTitle, setLocationTitle]=useState()
const [LocationDesc, setLocationDesc]=useState()
const [LocationDistance, setLocationDistance]=useState()
const [LocationTime, setLocationTime]=useState()
const [findings, setfindings]=useState('')
const [findingsid, setfindingsID]=useState('')
const [findparkCar, setfindParkCar]=useState('')
const [findparkCarCoord, setfindParkCarCoord]=useState('')

const [dataloader,setdataloader] = useState(true);

//get data api calling
const GetLocationDetail= async() => {
axios({
  method: 'GET',
  url:BASE_URL+'location/getLocationById/'+predata.locid,
})
.then(async function (response) {
  //console.log("response in location detail", JSON.stringify(response.data.data.images))
  setdata(response.data.data)
  setLocationTitle(response.data.data.title)
  setLocationDesc(response.data.data.description)
  setLocationDistance(response.data.data.distance)
  setLocationTime(response.data.data.avg_time)
  await AsyncStorage.setItem('Locid',response.data.data._id);
  GetFindingsDetail()
  setsliderimage(response.data.data.images)
  setdataloader(false)
})
.catch(function (error) {
  console.log("error", error)
})
}                         
const [findingsmessage, setfindingsmessage]=useState('')                             
///////////findings ststus states
const [findingsStatus, setfindingsStatus]=useState('')
const [SavedStatus, setSavedStatus]=useState('')                                                    
//get findings api calling
const GetFindingsDetail= async(props) => {
  var user= await AsyncStorage.getItem('Userid')
axios({
  method: 'GET',
  url:BASE_URL+'findings/getUserFindingForLocation/?location_id='+predata.locid+'&userId='+user,
})
.then(async function (response) {
  console.log("response in location detail findings", JSON.stringify(response.data))
  setfindingsmessage(response.data.result)
  setfindingsID(response.data.result._id)
  setfindings(response.data.result.findings)
  setSavedStatus(response.data.result.savedStatus)
  setfindingsStatus(response.data.result.savedStatus)
})
.catch(function (error) {
  console.log("error", error)
})
}  

//get findings api calling
const GetFindParkCar= async(props) => {
  var user= await AsyncStorage.getItem('Userid')
  console.log("userid:",user)
axios({
  method: 'GET',
  url:BASE_URL+'parking/getParkingsByUserId/'+user,
})
.then(async function (response) {
  console.log("response in location detail", JSON.stringify(response.data))
  setfindParkCar(response.data.data[0].isParked)
  setfindParkCarCoord(response.data.data[0].parking_id.location.coordinates)
})
.catch(function (error) {
  console.log("error", error)
})
} 

useEffect(() => { 
  if (isfocussed) {
    GetLocationDetail()
    GetFindParkCar()
    GetFindingsDetail()
}
},[isfocussed,findingsStatus,SavedStatus]);

///////////////Data states/////////
const [Findings,  setFindings] = React.useState();
const [saved,  setsaved] = React.useState(true);
//////////////////////Api Calling/////////////////
const AddSavedLocation = async() => {
 var user= await AsyncStorage.getItem('Userid')
 console.log("userid:",user,predata.locid)

   axios({
     method: 'POST',
     url: BASE_URL + 'findings/addFindings',
     data: {
       location_id: predata.locid,
       userId: user
       //findings: Findings
     },
   })
     .then(function (response) {
       console.log("response", JSON.stringify(response.data))
       refRBSheetSaveAdded.current.open()

     })
     .catch(function (error) {
       console.log("error", error)
     })
 }
 const unSavedLocation = async(props) => {
  console.log("id here:",props)
    axios({
      method: 'DELETE',
      url: BASE_URL + 'findings/deleteFindings/'+props,
    })
      .then(function (response) {
        console.log("response unsaved", JSON.stringify(response.data))
        refRBSheetSaveAdded.current.open()
 
      })
      .catch(function (error) {
        console.log("error", error)
      })
  }
const togglesavedlocation=(props)=>{
  if(saved=== true)
  {
    AddSavedLocation()
    setsaved(false)
  }
  else
  {
    unSavedLocation(props)
    setsaved(true)
  }
}
  return (
    <SafeAreaView style={theme === false?LightModestyles.container: DarkModestyles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
      <CustomHeader
headerlabel={
  predata.navplace === 'Walking Routes'?'Walking Routes':  predata.navplace === 'Dogs Walk'?'Dog Walks': 
  predata.navplace === 'Car Parkings'?'Car Parking':  predata.navplace === 'Toilets'?'Toilets': null
}
iconPress={() => {navigation.goBack()}}
icon={'chevron-back'}
/>

  {  predata.navplace === 'Walking Routes'?   
   <ImageSlider
        imagesarray={sliderimage}
        />: predata.navplace === 'Dogs Walk'?    
        <ImageSlider
        imagesarray={sliderimage}
        />:
        predata.navplace === 'Car Parkings'?   
         <ImageSlider
        imagesarray={sliderimage}
        />: predata.navplace === 'Toilets'?   
         <ImageSlider
        imagesarray={sliderimage}
        />: <ActivityIndicator
        size={'large'}
        style={{marginTop: hp(45)}}
      />}

      {dataloader === true?
      <ActivityIndicator
      size={'large'}
      style={{marginTop: hp(45)}}
    />:
    <View>
              <View style={{marginHorizontal:wp(5),marginTop:hp(2)}}>
        
        {     predata.navplace === 'Car Parkings'? 
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={theme === false?LightModestyles.mainheadingtext: DarkModestyles.mainheadingtext}>
             {LocationTitle}
          </Text>
             <View>
             <View style={{flexDirection:'row',alignItems:'center',
    justifyContent:'space-between',
    marginHorizontal:wp(0)}}>
              <Image 
                   source={require("../../../../assets/LocationDetail/Icon-directions.png") }
                   style={LightModestyles.textlasticon}
                   resizeMode='contain'
                 />
        <Text style={theme === false?LightModestyles.belowtext: DarkModestyles.belowtext}>{LocationDistance}</Text>
    </View>
    <View style={{flexDirection:'row',
    justifyContent:'space-between',alignItems:'center',
    marginHorizontal:wp(0)}}>
             <Image 
                   source={require("../../../../assets/LocationDetail/walking.png") }
                   style={LightModestyles.textlasticon}
                   resizeMode='contain'
                 />
        <Text style={theme === false?LightModestyles.belowtext: DarkModestyles.belowtext}>{LocationTime}</Text>
    </View>
             </View>
 
        </View>
        :  <Text style={theme === false?LightModestyles.mainheadingtext: DarkModestyles.mainheadingtext}>
       {LocationTitle}</Text>}  
           <View style={{marginVertical:10}}>
           <Text style={theme === false?LightModestyles.subtext: DarkModestyles.subtext}>{LocationDesc}</Text>
           </View>
           </View>
   <View style={{flexDirection:'row',
    justifyContent:'space-between',
    marginTop:hp(3),alignItems:'center',
    marginHorizontal:wp(5)}}>
      
        {     predata.navplace === 'Car Parkings'?
        
         <View style={LightModestyles.buttonview}>
     {findings === ''?
              <CustomButton
          title={'Add Findings'}
          widthset={'35%'}
          iscolor={'walking        '}
        //   loading={loading}
        //   disabled={disable}
          onPress={() => refRBSheet.current.open()}
        />
        :<View style={{
        marginTop:hp(0.1),
        marginHorizontal:wp(15)}}>
         </View>
 }
 </View>
       //    <CustomButton
       //    title={'Add Findings'}
       //    widthset={'35%'}
       //    iscolor={'walking        '}
       //  //   loading={loading}
       //  //   disabled={disable}
       //    onPress={() => refRBSheet.current.open()}
       //  />
        :
         <View>
        <View style={{flexDirection:'row',alignItems:'center',
    justifyContent:'space-between',
    marginHorizontal:wp(0)}}>
              <Image 
                   source={require("../../../../assets/LocationDetail/Icon-directions.png") }
                   style={LightModestyles.textlasticon}
                   resizeMode='contain'
                 />
        <Text style={theme === false?LightModestyles.belowtext: DarkModestyles.belowtext}>{LocationDistance}</Text>
    </View>
    <View style={{flexDirection:'row',
    justifyContent:'space-between',alignItems:'center',
    marginHorizontal:wp(0)}}>
             <Image 
                   source={require("../../../../assets/LocationDetail/walking.png") }
                   style={LightModestyles.textlasticon}
                   resizeMode='contain'
                 />
        <Text style={theme === false?LightModestyles.belowtext: DarkModestyles.belowtext}>{LocationTime}</Text>
    </View>
        </View>}
        <View style={{flexDirection:'row',marginHorizontal:predata.navplace === 'Car Parkings'?wp(2):wp(12)}}>
        </View>
        <TouchableOpacity onPress={()=> 
       //  {reviews()
       //   //  navigation.navigate('Reviews')
       // }
         navigation.navigate('Reviews',{LocationID:predata.locid})
         }>
        <View style={LightModestyles.renderviews}>
 
 <Image 
            source={require("../../../../assets/LocationDetail/review.png") }
            style={LightModestyles.lasticon}
            resizeMode='contain'
          />
 </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={()=> togglesavedlocation(findingsid)}>
        <View style={[LightModestyles.renderviews,{backgroundcolor:saved === true ?'red':'yellow'}]}>
        <Image 
                       source={require("../../../../assets/LocationDetail/location.png") }
                       style={[LightModestyles.lasticon,{color:saved === true ?'red':'yellow'}]}
                   resizeMode='contain'
                 />
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('MapRoute')}>
        <View style={LightModestyles.renderviews}>
        <Image 
                     source={require("../../../../assets/LocationDetail/directions.png") }
                     style={LightModestyles.lasticon}
                   resizeMode='contain'
                 />
        </View>
        </TouchableOpacity>
    </View>
    {findings !=''  && predata.navplace === 'Car Parkings'?
         <OutlineButton
         title={'Edit Findings'}
         widthset={'70%'}
         //iscolor={'walking'}
       //   loading={loading}
       //   disabled={disable}
         onPress={() =>   
          navigation.navigate('ParkCarRoute',{Cordinates:findparkCarCoord})
          //   refFindMyCarRBSheet.current.open()
        }
       />
    //        <View style={{flexDirection:'row',marginHorizontal:wp(8),justifyContent:'space-between',marginTop:hp(3)}}>
    //        <Text style={theme === false?LightModestyles.belowtext: DarkModestyles.belowtext}>{findings}</Text>
    //        <TouchableOpacity      onPress={() => 
    //           refRBSheetEditFindings.current.open()}>
    //        <Text style={theme === false?[LightModestyles.belowtext,{fontWeight:'bold'}]:
    //        [DarkModestyles.belowtext,{fontWeight:'bold'}]}>Edit</Text>
    //        </TouchableOpacity>
     
    //  </View>
    :null}
    {     predata.navplace === 'Car Parkings'?
      <View style={[LightModestyles.buttonview,{justifyContent:'center', marginHorizontal:wp(8),
      alignItems:'center'}]}>
  
      {findparkCar === true ?
      <OutlineButton
      title={'Find My Car'}
      widthset={'70%'}
      //iscolor={'walking'}
    //   loading={loading}
    //   disabled={disable}
      onPress={() =>   
       navigation.navigate('ParkCarRoute',{Cordinates:findparkCarCoord})
       //   refFindMyCarRBSheet.current.open()
     }
    />
     :    <CustomButton
     title={'Park Car'}
     widthset={'70%'}
     iscolor={'walking'}
   //   loading={loading}
   //   disabled={disable}
   onPress={() => refFindMyCarRBSheet.current.open()}
   />
     }
        {/*  */}
      </View>
    :
 
    <View style={LightModestyles.buttonview}>
     {findings === ''?
          <CustomButton
          title={'Add Your Findings'}
          widthset={'80%'}
          iscolor={'walking'}
        //   loading={loading}
        //   disabled={disable}
          onPress={() =>      refRBSheet.current.open()}
        />
        :

        <View style={{
          //flexDirection:'row',
          marginHorizontal:wp(8),
          //justifyContent:'space-between'
        }}>
                {/* <TouchableOpacity    
                style={{alignSelf:'flex-end',marginBottom:hp(1),backgroundColor:Colors.Appthemecolorprimary,
              height:hp(5),width:wp(15),borderRadius:wp(3),alignItems:'center',justifyContent:'center'
              }}
                onPress={() => 
          refRBSheetEditFindings.current.open()}>

       <Text style={theme === false?[LightModestyles.belowtext,{fontWeight:'bold'}]:
       [DarkModestyles.belowtext,{fontWeight:'bold'}]}>Edit</Text>
       </TouchableOpacity> */}
 
       <Text style={theme === false?LightModestyles.belowtext: DarkModestyles.belowtext}>{findings}</Text>
       <View style={{marginTop:hp(3)}}></View>
        <OutlineButton
         title={'Edit Findings'}
         widthset={'70%'}
         //iscolor={'walking'}
       //   loading={loading}
       //   disabled={disable}
         onPress={() =>   
          navigation.navigate('ParkCarRoute',{Cordinates:findparkCarCoord})
          //   refFindMyCarRBSheet.current.open()
        }
       />
 </View>
 
     }
            </View>
 }
      </View>}

            </ScrollView>
            <FindingsBottomSheet
              refRBSheet={refRBSheet}
              onClose={() => refRBSheet.current.close()}
              title={'Gallery'}
              LocationID={predata.locid}
            />
                   <EditFindingsBottomSheet
              refRBSheet={refRBSheetEditFindings}
              onClose={() => refRBSheetEditFindings.current.close()}
              title={'Gallery'}
              LocationID={predata.locid}
              findingID={findingsid}
            />
                  <FindMyCarBottomSheet
              refRBSheet={refFindMyCarRBSheet}
              onClose={() => refFindMyCarRBSheet.current.close()}
              title={'Gallery'}
              LocationID={predata.locid}
            />
                               <AddedtosaveBottomSheet
              refRBSheet={refRBSheetSaveAdded}
              onClose={() => {refRBSheetSaveAdded.current.close()}}
              title={'Sucessfully Add to Saved'}
            />
    </SafeAreaView>
  );
};


export default  LocationDetail;