import React from 'react';
import { View, StyleSheet, Image, Switch } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,

} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

///////////////app redux////////////////
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../redux/actions';
import { tapGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler';

///////////////app styles///////////////////
import LightModestyles from '../../styles/Drawer/LightModestyles';
import DarkModestyles from '../../styles/Drawer/DarkModestyles';
import styles from '../../components/Button/styles';
import Colors from '../../utils/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export function DrawerContent(props) {

    ////////////////redux///////////
    const { theme } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const onToggleSwitch1 = () => setIsSwitchOn(!isSwitchOn);

    const onToggleSwitch = async () => {

        if (theme === false) {
            //setIsSwitchOn('LIGHT')
            dispatch(setTheme(true));
            console.log('theme here LIGHT:', theme)
            await AsyncStorage.setItem('Apptheme', 'LIGHT');
        }
        else {
            //setIsSwitchOn('DARK')
            dispatch(setTheme(false));
            console.log('theme here DARK:', theme)
            await AsyncStorage.setItem('Apptheme', 'DARK');
        }
    }
    const onToggleSwitch22 = async () => {

        if (isSwitchOn === 'DARK') {
            ///setIsSwitchOn('LIGHT')
            dispatch(setTheme('LIGHT'));
            console.log('theme here LIGHT:', theme)
            await AsyncStorage.setItem('Apptheme', 'LIGHT');
        }
        else {
            //setIsSwitchOn('DARK')
            dispatch(setTheme(false));
            console.log('theme here DARK:', theme)
            await AsyncStorage.setItem('Apptheme', 'DARK');
        }
    }
    //setIsSwitchOn(!isSwitchOn);


    return (
        <View style={theme === false ? [LightModestyles.container,{marginTop:hp(5)} ]: 
        [DarkModestyles.container,{marginTop:hp(5)} ]}>
            <DrawerContentScrollView {...props}>
                <View style={theme === false ? LightModestyles.drawerContent : DarkModestyles.drawerContent}>
                    {/* <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/Drawer/Home.png')}
                                style={{ width: size, height: size }}
                            />
                        )}
                        label="Home"
                        labelStyle={theme === false ? LightModestyles.contentmaintext : DarkModestyles.contentmaintext}
                        onPress={() => { props.navigation.navigate('MapSearch') }}
                    />
                    <Text style={{color:    Colors.Appthemecolorprimary,fontWeight:'bold',
                textAlign:'center',fontSize:hp(3)
                }}>
                        Search Places{theme}</Text> */}
                    <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            source={require('../../assets/Drawer/WalkingRoutes.png')}
                            style={{ width: size, height: size }}
                        />
                    )}
                        label="Walking Routes"
                        labelStyle={theme === false ? LightModestyles.contentmaintext : DarkModestyles.contentmaintext}
                        onPress={() => { props.navigation.navigate('WalkingRouteSearch','WalkingRoute')}}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/Drawer/DogWalks.png')}
                                style={{ width: size, height: size }}
                            />
                        )}
                        label="dog walks"
                        labelStyle={theme === false ? LightModestyles.contentmaintext : DarkModestyles.contentmaintext}
                        onPress={()=> props.navigation.navigate('WalkingRouteSearch','DogWalks')}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/Drawer/CarParkings.png')}
                                style={{ width: size, height: size }}
                            />
                        )}
                        label="car parking "
                        labelStyle={theme === false ? LightModestyles.contentmaintext : DarkModestyles.contentmaintext}
                        onPress={()=> props.navigation.navigate('WalkingRouteSearch','CarParking')}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/Drawer/Toilets.png')}
                                style={{ width: size, height: size }}
                            />
                        )}
                        label="toilet locations"
                        labelStyle={theme === false ? LightModestyles.contentmaintext : DarkModestyles.contentmaintext}
                        onPress={()=> props.navigation.navigate('WalkingRouteSearch','Toilets')}
                    />
                    <DrawerItem
                          icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/Drawer/Saved.png')}
                                style={{ width: size, height: size }}
                            />
                        )}
                        label="Saved"
                        labelStyle={theme === false ? LightModestyles.contentmaintext : DarkModestyles.contentmaintext}
                        onPress={() => { props.navigation.navigate('SavedLoctaion') }}
                    />
          
                    <TouchableRipple
                    onPress={() => {onToggleSwitch()}}
                    >

                        <View style={LightModestyles.preference}>
                            <View style={{flexDirection:'row',justifyContent:"space-between"}}>
                            <Image
                                source={require('../../assets/Drawer/Darkmode.png')}
                                style={{ width:wp(7), height:hp(3) }}
                            />
                            <Text
                                style={[LightModestyles.contentmaintext,{color:theme === false ? 'black':'white'
                                ,marginLeft:wp(8),fontWeight:"bold"} ]
                            }
                            >Dark Mode</Text>
                            </View>
                  

                            <View >
                                <Switch value={theme} onValueChange={onToggleSwitch}
                                color={Colors.Appthemecolorprimary} />
                            </View>
                        </View>
                    </TouchableRipple>

                    <DrawerItem
                         icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/Drawer/Translator.png')}
                                style={{ width: size, height: size }}
                            />
                        )}
                        label="Change Languages"
                        labelStyle={theme === false ? LightModestyles.contentmaintext : DarkModestyles.contentmaintext}
                        onPress={() => { props.navigation.navigate('SupportScreen') }}
                    />
                    <DrawerItem
                      icon={({ color, size }) => (
                        <Image
                            source={require('../../assets/Drawer/Contactus.png')}
                            style={{ width: size, height: size }}
                        />
                    )}
                        label="Contact Us"
                        labelStyle={theme === false ? LightModestyles.contentmaintext : DarkModestyles.contentmaintext}
                        //onPress={() => { props.navigation.navigate('SupportScreen') }}
                    />
                    <DrawerItem
                         icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/Drawer/Aboutus.png')}
                                style={{ width: size, height: size }}
                            />
                        )}
                        label="About Us"
                        labelStyle={theme === false ? LightModestyles.contentmaintext : DarkModestyles.contentmaintext}
                        //onPress={() => { props.navigation.navigate('SupportScreen') }}
                    />
                    <DrawerItem
                     icon={({ color, size }) => (
                        <Image
                            source={require('../../assets/Drawer/Privacy.png')}
                            style={{ width: size, height: size }}
                        />
                    )}
                        label="Privacy Policy"
                        labelStyle={theme === false ? LightModestyles.contentmaintext : DarkModestyles.contentmaintext}
                        //onPress={() => { props.navigation.navigate('SupportScreen') }}
                    />

                </View>
            </DrawerContentScrollView>

        </View>
    );
}


