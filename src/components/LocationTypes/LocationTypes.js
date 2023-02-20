import React, {useRef, useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {TextInput, Avatar} from 'react-native-paper';
////////////////app components////////////////
import CustomButton from '../Button/CustomButton';

/////////////////app pakages//////////////
import RBSheet from 'react-native-raw-bottom-sheet';

//////////////////pickers///////////////
import ImagePicker from 'react-native-image-crop-picker';

////////////app icons///////////////
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

////////////////app redux///////////
import {useSelector} from 'react-redux';

////////////app styles///////////////
import LightModestyles from '../../styles/MapView/LightModestyles';
import styles from './styles';
import Colors from '../../utils/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//////////////////////////app api/////////////////////////
import axios from 'axios';
import {BASE_URL} from '../../utils/ApiRootUrl';

import {useNavigation} from '@react-navigation/native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const LocationsBottomSheet = props => {
  const navigation = useNavigation();

  ////////////////////redux/////////////////////
  const {theme} = useSelector(state => state.userReducer);

  //ReviewAdded state and funnction
  const refRBSheetSaveAdded = useRef();
  useEffect(() => {
    GetWalkingRoutes();
    GetDogWalks();
    GetCarParking();
    GetToilets();
  }, []);

  ////////////////Titles States/////////////
  const [WalkingRoutes, setWalkingRoutes] = useState();
  const [DogWalks, setDogWalks] = useState();
  const [CarParking, setCarParking] = useState();
  const [Toilets, setToilets] = useState();

  //////////////GetWalkingRoutes Api Calling////////////////////
  const GetWalkingRoutes = async () => {
    console.log('here', BASE_URL + 'title/getTitles');
    axios({
      method: 'GET',
      url: BASE_URL + 'location/getLocationByType/?type=walking-route',
    })
      .then(async function (response) {
        console.log(
          'response here in get useer',
          JSON.stringify(response.data.result.images),
        );
        setWalkingRoutes(response.data.result);
      })
      .catch(function (error) {
        if (error) {
          console.log('Email or Password is incorrect');
        }
        //setModalVisible(true)

        console.log('error', error);
      });
  };
  //////////////GetDogWalks Api Calling////////////////////
  const GetDogWalks = async () => {
    console.log('here', BASE_URL + 'title/getTitles');
    axios({
      method: 'GET',
      url: BASE_URL + 'location/getLocationByType/?type=dog-walk',
    })
      .then(async function (response) {
        console.log(
          'response here in get useer',
          JSON.stringify(response.data.result),
        );
        setDogWalks(response.data.result);
      })
      .catch(function (error) {
        if (error) {
          console.log('Email or Password is incorrect');
        }
        //setModalVisible(true)

        console.log('error', error);
      });
  };
  //////////////GetCarParking Api Calling////////////////////
  const GetCarParking = async () => {
    console.log('here', BASE_URL + 'title/getTitles');
    axios({
      method: 'GET',
      url: BASE_URL + 'location/getLocationByType/?type=parking',
    })
      .then(async function (response) {
        console.log(
          'response here in get useer',
          JSON.stringify(response.data.result),
        );
        setCarParking(response.data.result);
      })
      .catch(function (error) {
        if (error) {
          console.log('Email or Password is incorrect');
        }
        //setModalVisible(true)

        console.log('error', error);
      });
  };
  //////////////GetToilets Api Calling////////////////////
  const GetToilets = async () => {
    console.log('here', BASE_URL + 'title/getTitles');
    axios({
      method: 'GET',
      url: BASE_URL + 'location/getLocationByType/?type=toilet',
    })
      .then(async function (response) {
        console.log(
          'response here in get useer',
          JSON.stringify(response.data.result),
        );
        setToilets(response.data.result);
      })
      .catch(function (error) {
        if (error) {
          console.log('Email or Password is incorrect');
        }
        //setModalVisible(true)

        console.log('error', error);
      });
  };
  return (
    <RBSheet
      //sstyle={{flex:1}}
      ref={props.refRBSheet}
      closeOnDragDown={true}
      closeOnPressMask={false}
      height={500}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(52, 52, 52, 0.7)',
        },
        draggableIcon: {
          backgroundColor: theme === false ? 'white' : 'black',
        },
        container: {
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: hp(90),
          backgroundColor: theme === false ? 'white' : 'black',
          borderTopColor: Colors.Appthemecolorprimary,
          borderTopWidth: 15,
        },
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{marginHorizontal: wp(2)}}>
        <View
          style={{
            //backgroundColor:theme === false ? 'white':'rgba(52, 52, 52, 1)',
            // height:hp(5),
            paddingVertical: wp(1),
            justifyContent: 'center',
            marginBottom: hp(0.5),
            width: wp(100),
            borderTopLeftRadius: wp(2),
            borderTopRightRadius: wp(2),
          }}>
          <TouchableOpacity
            onPress={() => props.refRBSheet.current.close()}
            activeOpacity={1}>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: wp(5),
                alignItems: 'center',
              }}>
              <Ionicons
                name={'chevron-down'}
                size={23}
                color={theme === false ? 'grey' : 'white'}
                onPress={() => props.refRBSheet.current.close()}
              />
              <View style={{marginLeft: wp(3)}}>
                <Text
                  style={[
                    LightModestyles.cardDescription,
                    {
                      color: Colors.Appthemecolorprimary,
                      marginTop: hp(0),
                      // theme === false ? 'black':'white'
                    },
                  ]}>
                  What 's Nearby
                </Text>
                {/* <Text
              style={[LightModestyles.cardsubDescription,
                {color:theme === false ? 'black':'white'}]}
                >Lorem</Text> */}
              </View>
              {/* <View>
          <Text style={styles.sidetext}>What's Nearby</Text>
          <Text style={styles.sidetext}>Lorem ipsum</Text>
          </View> */}
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.Topicsview}>
            <Text style={styles.sidetext}>WalkingRoutes</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('WalkingRouteSearch', 'WalkingRoute'),
                  props.refRBSheet.current.close();
              }}>
              <View style={styles.SeeView}>
                <Text
                  style={styles.Seetext}
                  onPress={() => {
                    navigation.navigate('WalkingRouteSearch', 'WalkingRoute'),
                      props.refRBSheet.current.close();
                  }}>
                  View On Map
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {WalkingRoutes === '' ? null : (
            <FlatList
              data={WalkingRoutes}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('LocationDetail', {
                      navplace: 'Walking Routes',
                      locid: item._id,
                    }),
                      props.refRBSheet.current.close();
                  }}>
                  <View style={styles.flatlistmainview}>
                    <View style={{marginBottom:hp(0)}}>
                      <Image
                        source={{
                          uri:
                            item.images.length === 0
                              ? null
                              : item.images[0].image_url,
                        }}
                        style={styles.flatlistimgesview}
                        resizeMode='cover'
                        imageStyle={styles.flatlistimage}></Image>
                    </View>

                    <View
                      style={styles.textview}>
                      <Text style={styles.flatlisttitletext} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={[styles.flatlisttitletext, {bottom: hp(0)}]}>
                        {item.distance} Km
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index}
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
        <View>
          <View style={styles.Topicsview}>
            <Text style={styles.sidetext}>Dog Walks</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('WalkingRouteSearch', 'DogWalks'),
                  props.refRBSheet.current.close();
              }}>
              <View style={styles.SeeView}>
                <Text
                  style={styles.Seetext}
                  onPress={() => {
                    navigation.navigate('WalkingRouteSearch', 'DogWalks'),
                      props.refRBSheet.current.close();
                  }}>
                  View On Map
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {DogWalks === '' ? null : (
            <FlatList
              data={DogWalks}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('LocationDetail', {
                      navplace: 'Dogs Walk',
                      locid: item._id,
                    }),
                      props.refRBSheet.current.close();
                  }}>
                  <View style={styles.flatlistmainview}>
                  <View style={{marginBottom:hp(0)}}>
                      <Image
                        source={{
                          uri:
                            item.images.length === 0
                              ? null
                              : item.images[0].image_url,
                        }}
                        style={styles.flatlistimgesview}
                        resizeMode='cover'
                        imageStyle={styles.flatlistimage}></Image>
                    </View>

                    <View
                      style={styles.textview}>
                      <Text style={styles.flatlisttitletext} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={[styles.flatlisttitletext, {bottom: hp(0)}]}>
                        {item.distance} Km
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index}
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
        <View>
          <View style={styles.Topicsview}>
            <Text style={styles.sidetext}>Car parking</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('WalkingRouteSearch', 'CarParkings'),
                  props.refRBSheet.current.close();
              }}>
              <View style={styles.SeeView}>
                <Text
                  style={styles.Seetext}
                  onPress={() => {
                    navigation.navigate('WalkingRouteSearch', 'CarParkings'),
                      props.refRBSheet.current.close();
                  }}>
                  View On Map
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {CarParking === '' ? null : (
            <FlatList
              data={CarParking}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('LocationDetail', {
                      navplace: 'Car Parkings',
                      locid: item._id,
                    }),
                      props.refRBSheet.current.close();
                  }}>
                  <View style={styles.flatlistmainview}>
                  <View style={{marginBottom:hp(0)}}>
                      <Image
                        source={{
                          uri:
                            item.images.length === 0
                              ? null
                              : item.images[0].image_url,
                        }}
                        style={styles.flatlistimgesview}
                        resizeMode='cover'
                        imageStyle={styles.flatlistimage}></Image>
                    </View>

                    <View
                      style={styles.textview}>
                      <Text style={styles.flatlisttitletext} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={[styles.flatlisttitletext, {bottom: hp(0)}]}>
                        {item.distance} Km
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index}
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
        <View>
          <View style={styles.Topicsview}>
            <Text style={styles.sidetext}>Toilet locations</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('WalkingRouteSearch', 'Toilets'),
                  props.refRBSheet.current.close();
              }}>
              <View style={styles.SeeView}>
                <Text
                  style={styles.Seetext}
                  onPress={() => {
                    navigation.navigate('WalkingRouteSearch', 'Toilets'),
                      props.refRBSheet.current.close();
                  }}>
                  View On Map
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {Toilets === '' ? null : (
            <FlatList
              data={Toilets}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('LocationDetail', {
                      navplace: 'Toilets',
                      locid: item._id,
                    }),
                      props.refRBSheet.current.close();
                  }}>
                  <View style={styles.flatlistmainview}>
                  <View style={{marginBottom:hp(0)}}>
                      <Image
                        source={{
                          uri:
                            item.images.length === 0
                              ? null
                              : item.images[0].image_url,
                        }}
                        style={styles.flatlistimgesview}
                        resizeMode='cover'
                        imageStyle={styles.flatlistimage}></Image>
                    </View>

                    <View
                      style={styles.textview}>
                      <Text style={styles.flatlisttitletext} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={[styles.flatlisttitletext, {bottom: hp(0)}]}>
                        {item.distance} Km
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index}
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </RBSheet>
  );
};

export default LocationsBottomSheet;
