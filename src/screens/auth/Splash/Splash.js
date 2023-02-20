import React,{useEffect,useState} from 'react';
import { 
    View, 
    Text, 
    Dimensions,
    StyleSheet,
    StatusBar,
    ImageBackground
} from 'react-native';

//////////////////app components///////////
import CustomButton from '../../../components/Button/CustomButton';

////////////app pakages/////////////
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

///////////////////app redux///////////////////
import { useSelector,useDispatch } from 'react-redux';
import { setTheme,setUserID,setToken } from '../../../redux/actions';

/////////////app styles//////////
import {widthPercentageToDP as wp, heightPercentageToDP as hp} 
from 'react-native-responsive-screen';

//////////////////////////app api/////////////////////////
import axios from 'axios';
import { BASE_URL } from '../../../utils/ApiRootUrl';


////////////////token api////////////
import { checkPermission } from '../../../api/FCMToken';

const SplashScreen = ({navigation}) => {

      ////////////////user fcm token/////////////
const [fcmtoken,setFCMToken] = useState();
 
      ////////////////redux///////////
      const { theme,id,token } = useSelector(state => state.userReducer);
      const dispatch = useDispatch();

      /////////////theme function//////////////
    const themehere =async() => {
        var themehere= await AsyncStorage.getItem('Apptheme');
        console.log('heree map:',themehere)

        if(themehere === 'DARK')
        {
            dispatch(setTheme(false));
            console.log('heree map:',theme)
        }
    else{
        dispatch(setTheme(true));
        //console.log('heree map:',theme)
    }
      
    }
//////////////Api Calling////////////////////
const GetUser=async(props) => {
//     AsyncStorage.removeItem('Userid');
// AsyncStorage.removeItem('Token');
console.log('here',BASE_URL+'user/createUser')
axios({
method: 'post',
url: BASE_URL+'user/createUser',
data:{
token : props,
},
})
.then(async function (response) {
console.log("response here in get useer", JSON.stringify(response.data.data.user.token))
//dispatch(setUserID(response.data.data.user._id));
//dispatch(setToken(response.data.data.user.token));
    await AsyncStorage.setItem('Userid',response.data.data.user._id);
    await AsyncStorage.setItem('Token',response.data.data.user.token);
    //navigation.navigate('Drawerroute')
})
.catch(function (error) {
if(error)
{     console.log('Email or Password is incorrect')}
//setModalVisible(true)

console.log("error", error)
})
}

    useEffect( () => {

        themehere()
        checkPermission().then(result => {
            console.log("here in google password",result,);
            setFCMToken(result)
            GetUser(result)
            //do something with the result
          })
         GetAppTitles()
    },[]);

          ////////////////Titles States/////////////
const [Titles,setTitles] = useState();
const [SubTitles,setSubTitles] = useState();

    //////////////Titles Api Calling////////////////////
const GetAppTitles=async() => {

console.log('here',BASE_URL+'title/getTitles')
axios({
method: 'GET',
url: BASE_URL+'title/getTitles',
})
.then(async function (response) {
console.log("response here in get useer", JSON.stringify(response.data.result))
setTitles(response.data.result[0].title)
setSubTitles(response.data.result[0].description)
})
.catch(function (error) {
if(error)
{     console.log('Email or Password is incorrect')}
//setModalVisible(true)

console.log("error", error)
})
}
    return (
        <ImageBackground source={theme === false?require('../../../assets/Auth/splash.png') 
        :require('../../../assets/Auth/darkbg.png')}
        resizeMode="cover" style={styles.container}>
      {theme === false?
       <StatusBar backgroundColor='white' barStyle='dark-content'/>
           :
           <StatusBar backgroundColor='black' barStyle='light-content'/>
      }
   
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={ theme === false?require('../../../assets/Auth/logo.png'):null}
            style={styles.logo}
            resizeMode='cover'
            />
         
        </View>
     
        <View 
            style={[styles.footer, {
                backgroundColor: '#1A513B'
                //backgroundColor: colors.background
            }]}
     
        >
            <Text style={[styles.title, {
                   color: 'white'
                //color: colors.text
            }]}>{Titles}
            </Text>
            <Text style={styles.text}>{SubTitles}</Text>
            {/* <View style={styles.button}>
            <TouchableOpacity onPress={()=>navigation.navigate('SignInScreen')}>
        
                    <Text style={styles.textSign}>Get Started</Text>
        
            
            </TouchableOpacity>
            </View> */}
            <View style={styles.button}>
            <CustomButton
              title={'Get Started'}
              widthset={'70%'}
              iscolor={'splash'}
            //   loading={loading}
            //   disabled={disable}
              onPress={() => navigation.navigate('Drawerroute')}
            /></View>
        </View>
      {/* </View> */}
      </ImageBackground>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    //backgroundColor: '#009387'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingVertical: 50,
      paddingHorizontal: 30,
      backgroundColor: '#1A513B'
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize:hp(4.9),
      fontWeight: 'bold',
      textAlign:'center'
  },
  text: {
    color: 'white',
      marginTop:5,
      fontSize:hp(1.5),
      textAlign:'center'
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  }
});

