import React, { useRef,useState,useEffect }from "react";
import { Text, SafeAreaView, View,TouchableOpacity,
  KeyboardAvoidingView,} from "react-native";
 import { TextInput,Avatar } from 'react-native-paper';

 ///////////////////app pakages date time picker/////////////
//import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker';

  ////////////////app components////////////////
import CustomButton from "../Button/CustomButton";

/////////////////app pakages//////////////
import RBSheet from "react-native-raw-bottom-sheet";


////////////app icons///////////////
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons'


////////////////app redux///////////
import { useSelector } from 'react-redux';

////////////app styles///////////////
import styles from "./styles";
import Colors from "../../utils/Colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} 
from 'react-native-responsive-screen';

////////////////api////////////////
import axios from 'axios';
import { BASE_URL } from "../../utils/ApiRootUrl";
import AsyncStorage from '@react-native-async-storage/async-storage';

const FindMyCarBottomSheet= (props) => {

    ////////////////////redux/////////////////////
    const { theme } = useSelector(state => state.userReducer);

    /////////////data states///////////////
    const[platenumber,setPlateNumber]=useState()
    //const[time,setTime]=useState()

//////////////////////Api Calling/////////////////
const AddCarParking= async() => {
  var user= await AsyncStorage.getItem('Userid')
  console.log("userid:",user,props.LocationID)
 
    axios({
      method: 'POST',
      url: BASE_URL + 'parking/parkVehicle',
      data: {
        userId: user,
        parkTime : time,
        plateNumber: platenumber,
        lane_number : "1",
        parkingDetails : "I m on my way to school",
        parking_id: props.LocationID,
        carColor: "red"
      },
    })
      .then(function (response) {
        console.log("response", JSON.stringify(response.data))
        props.refRBSheet.current.close()
 
      })
      .catch(function (error) {
        console.log("error", error)
      })
  }
     //datepicker states
 const [date, setDate] = useState(new Date());
 const [mode, setMode] = useState('date');
 const [show, setShow] = useState(false);
 const [showyearwise, setshowyearwise] = useState(false);
 const [birthdaydaywise, setbirthdaydaywise] = useState('');

// timepicker states
const [time, setTime] = useState(new Date());
  const [modeTime, setModeTime] = useState('date');
  const [showTime, setShowTime] = useState(false);
  const [showTimewise, setshowTimewise] = useState(false);
  const [sendTimewise, setsendTimewise] = useState(false);

 //datepicker
 const onChange = (event, selectedDate) => {
  const currentDate = selectedDate || date;
  setShow(Platform.OS === 'ios');
  setDate(currentDate);
  var d = new Date();
  d = selectedDate
  if (d != undefined) {
    let year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0");
    let day = d.getDate().toString().padStart(2, "0");
    console.log(year + '-' + month + '-' + day);
    console.log(typeof (year + '-' + month + '-' + day))
    setshowyearwise(year + "-" + month + "-" + day)
    setbirthdaydaywise(day + "-" + month + "-" + year).toISOString()
    //console('date ha yhn',showyearwise)
  }

}

const showMode = (currentMode) => {
  setShow(true);
  setMode(currentMode);
  console.log('mode',mode)
};

const showDatepicker = () => {
  showMode('date');
};

//timepicker
const onChangeTime = (event, selectedDate) => {
  const currentDate = selectedDate || time;
  setShowTime(Platform.OS === 'ios');
  setTime(currentDate);
  var d = new Date();
  d = selectedDate
  console.log(selectedDate)
  if (d != undefined) {
      console.log(d)
      setsendTimewise(d)
      //isValidSetStateTime(true)
      //console.log()
      setshowTimewise(d.getHours() + ":" +
       d.getMinutes()+ ":" + d.getSeconds())
  }
};
const showModeTime = (currentMode) => {
  setShowTime(true);
  setModeTime(currentMode);
  console.log('mode',mode)
};

const showTimepicker = () => {
  showModeTime('time');
};
  return (
    
    // <View style={[styles.container,{ backgroundColor: theme ===false? 'white':'black'}]}>
      <RBSheet
         //sstyle={{flex:1}}
         ref={props.refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={500}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(52, 52, 52, 0.9)',
          },
          draggableIcon: 
          {
             backgroundColor: theme ===false? 'white':'black'
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius:20,
            height: hp(45),
            backgroundColor: theme ===false? 'white':'black'
        }
        }}

      >

         <View style={{flexDirection:'column', marginHorizontal:20,marginVertical:20}}>
     
      
         <TextInput
      //label="Enter Your Name"
      onChangeText={setPlateNumber}
      style={[styles.paperinput,{  backgroundColor: theme === false? 'white':'rgba(52, 52, 52, 0.5)'}]}
      mode={'outlined' }
      outlineColor={Colors.Appthemecolorprimary}
      activeOutlineColor={Colors.Appthemecolorprimary}
      placeholder="Car Plate Number "
      placeholderTextColor={ theme === false?"black":'white'}
      textColor={theme === false?"black":'white'}
      theme={{ colors: 'red'}}
      // value={text}
      // onChangeText={text => setText(text)}
    />
        <TouchableOpacity  onPress={showTimepicker}>
    <TextInput
      //label="Enter Your Name"
      disabled={false}
      onChangeText={onChangeTime}
      value={showTimewise}
      style={[styles.paperinput,{  backgroundColor: theme === false? 'white':'rgba(52, 52, 52, 0.5)',
      color:theme === false? 'white':'rgba(52, 52, 52, 0.5)',
    }]}
      mode={'outlined' }
      color={theme === false? 'white':'rgba(52, 52, 52, 0.5)'}
      outlineColor={Colors.Appthemecolorprimary}
      activeOutlineColor={Colors.Appthemecolorprimary}
      placeholder="Time For Parking"
      placeholderTextColor={ theme === false?"black":'white'}
      textColor={theme === false?"black":'white'}
      theme={{ colors: 'grey'}}
      // value={text}
      // onChangeText={text => setText(text)}
    />
    </TouchableOpacity>
  <View style={styles.button}>
            <CustomButton
              title={'Add'}
              widthset={'80%'}
              iscolor={'here'}
            //   loading={loading}
            //   disabled={disable}
            onPress={()=>AddCarParking()}
            /></View> 
      
          </View>
          {showTime && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={time}
                        mode={modeTime}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeTime}
                    />
                )}
        {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          
          is24Hour={true}
          display="default"
          textColor="red"
          themeVariant="light"
          onChange={onChange}
          style={{
            shadowColor: '#fff',
            shadowRadius: 0,
            shadowOpacity: 1,
            shadowOffset: { height: 0, width: 0 },
            color:'#1669F',
            textColor:'#1669F'
          }}
        />
      )}
      </RBSheet>

    // </View>
  );
};


export default FindMyCarBottomSheet;