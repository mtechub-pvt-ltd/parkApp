import React from 'react';
import {StyleSheet,
Dimensions
} from 'react-native';
import Colors from '../../../../../utils/Colors';
const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;
import {widthPercentageToDP as wp, heightPercentageToDP as hp} 
from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    container1:
    {
flex:1,
backgroundColor:'white',
},
container: {
    marginTop:'25%',
  ...StyleSheet.absoluteFillObject,
  height: hp('85%'),
  width: Width,
  justifyContent: 'flex-end',
  alignItems: 'center',
  backgroundColor: 'white',
},
map: {
  ...StyleSheet.absoluteFillObject,
  //position:'absolute',
  //backgroundColor:'white'
},


  });
  export default styles;