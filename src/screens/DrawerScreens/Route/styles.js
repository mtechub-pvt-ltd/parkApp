import React from 'react';
import {StyleSheet,
Dimensions
} from 'react-native';
import Colors from '../../../utils/Colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} 
from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const styles = StyleSheet.create({
    container: {
      
      flex: 1,
       // position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 10,
        height:hp('100%'),
        width:wp('100%'),
        alignItems: 'center',
        //backgroundColor:'white',
        zIndex: 10
        //justifyContent: 'flex-end',
      },
      mapStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },

 

        map: {
          ...StyleSheet.absoluteFillObject,
          //position:'absolute',
          //backgroundColor:'white'
        },
  });
  export default styles;
  