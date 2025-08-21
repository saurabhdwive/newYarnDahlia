// src/navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PromotionScreen from '../../Screens/promotion/promotion';
import PromptScreen from '../../Screens/PromptScreen';
import { View, Text, Image } from 'react-native';
import HomeScreen from '../HomeScreen';
import { Icon } from 'react-native-paper';
import NotificationScreen from '../notification screen/notification_screen';
import ProfileScreen from '../profile_screen';
import OrderStack from '../../navigation/OrderStack';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const tabIcons = {
    order_now: {
        active: require('../../../assets/images/sHome.png'), // selected image
        inactive: require('../../../assets/images/chat.png'), // default image
    },
    promotion: require('../../../assets/images/promotion.png'),
    notifications: require('../../../assets/images/notification.png'),
    profile: require('../../../assets/images/profile.png'),
};

export default function BottomTabs() {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    height: 84,
                },
                tabBarLabelStyle: {
                    marginTop: 6,
                },
                tabBarIconStyle: {
                    marginTop: 9,
                },
                tabBarIcon: ({ focused, color }) => {
                    let iconSource;
                    if (route.name === t('order_now')) {
                        iconSource = focused
                            ? tabIcons.order_now.active
                            : tabIcons.order_now.inactive;
                    } else if (route.name === t('promotion')) {
                        iconSource = tabIcons.promotion;
                    } else if (route.name === t('notifications')) {
                        iconSource = tabIcons.notifications;
                    } else if (route.name === t('profile')) {
                        iconSource = tabIcons.profile;
                    }

                    return (
                        <Image
                            source={iconSource}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: color,
                                marginBottom: 0,
                            }}
                            resizeMode="contain"
                        />
                    );
                },
                tabBarActiveTintColor: 'rgb(212,44,32,1)',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                keyboardHidesTabBar: false,
            })}
        >
            <Tab.Screen name={t('order_now')} component={OrderStack} />
            <Tab.Screen name={t('promotion')} component={PromotionScreen} />
            <Tab.Screen name={t('notifications')} component={NotificationScreen} />
            <Tab.Screen name={t('profile')} component={ProfileScreen} />
        </Tab.Navigator>
    );
}
