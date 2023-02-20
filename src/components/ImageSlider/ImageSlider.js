import React, { useRef,useState,useEffect }from "react";
import {View,Text,ActivityIndicator,Image,Dimensions} from 'react-native';

/////////////app styles//////////////
import styles from './styles';
import Colors from '../../utils/Colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} 
from 'react-native-responsive-screen';

///////////Slider pkages/////////////
import Carousel, { Pagination ,ParallaxImage} from 'react-native-snap-carousel';

////////////////app redux///////////
import { useSelector } from 'react-redux';

const { width: screenWidth } = Dimensions.get('window')
const Height = Dimensions.get("window").height;

const ImageSlider = (props) => {
    console.log('here item in list:',props)
    
      ////////////////////redux/////////////////////
      const { theme } = useSelector(state => state.userReducer);

      /////////////component states//////////////////
    const carouselRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);
  
    const [carolist, setCarolist] = useState([
        // {
        //     id: 1,
        //     image: props.imagesarray[0].image_url,
        //     text1: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
        //     text2: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam"
        // },
        // {
        //     id: 2,
        //     image: props.imagesarray[1].image_url,
        //     text1: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
        //     text2: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam"
        // },
        // {
        //     id: 3,
        //     image: props.imagesarray[2].image_url,
        //     text1: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
        //     text2: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam"
        // },
        // {
        //     id: 4,
        //     image: props.imagesarray[3].image_url,
        //     text1: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
        //     text2: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam"
        // },
    ]);
    
    const renderItem = ({ item }) => {
        console.log("here in item:",item)
        return (
                <View style={{
                    //backgroundColor: 'green',
                    alignItems: 'center',

                }}>
                        <Image 
                  source={{uri:item.image_url}}
                  style={{width:wp(90),height:hp(40),borderRadius:wp(3)}}
                  resizeMode='contain'
                />
                </View>

        )
    }
    const pagination = () => {
        return (
            <Pagination
                dotsLength={props.imagesarray.length}
                activeDotIndex={activeSlide}
                containerStyle={{
                }}
                // animatedDuration={50}
                dotElement={
                    <View
                        style={{
                            width: wp(3),
                            height: wp(3),
                            borderRadius: 30,
                            marginHorizontal: wp(2.2),
                            backgroundColor:Colors.Appthemecolorprimary
                    
                        }}></View>
                }
                inactiveDotElement={
                    <View
                        style={{
                            width: wp(2.5),
                            height: wp(2.5),
                            borderRadius: 30,
                            marginHorizontal: wp(2.2),
                            backgroundColor: Colors.AppgreyColor
                        }}></View>
                }
            />
        );
    };
      const goForward = () => {
        carouselRef.current.snapToNext();
      };
    useEffect(() => {
        setCarolist(carolist);
      }, []);
    return(
        <View style={[styles.container,{backgroundColor:theme ===false ? 'white' : 'black'}]}>
        <Carousel
          ref={carouselRef}
          sliderWidth={wp(100)}
          sliderHeight={hp(30)}
          itemWidth={wp(100)}
          data={props.imagesarray}
          renderItem={renderItem}
          containerCustomStyle={{
              marginTop: hp(0),
              alignSelf: 'center',
              borderRadius:wp(2)
          }}
          onSnapToItem={index => {
              setActiveSlide(index)
              console.log(index)
          }}
        />
               <View
                      style={{
                          alignSelf: 'center',
                      }}>
                      {pagination()}
                  </View>
      </View> 
    )
};

export default ImageSlider;