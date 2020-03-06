/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { css } from '@emotion/native';
import Svg, {
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask
} from 'react-native-svg';
// @ts-ignore
import { NavLink } from '../NavLink/index.web';
// @ts-ignore
import { View, Animated, TouchableOpacity } from 'react-native';
import { useSelector } from '@foody/core';
import { useMe } from '@foody/graphql';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Hamburger } from '../Hamburger';
import { Spacer } from '../Spacer';
import { Row } from '../Grid/Row';
import { ExitIcon } from '../../icons/Exit';

interface Props {
  activeScreen: string;
  toggleLoginForm: () => void;
  toggleRegisterForm: () => void;
  logout: () => void;
  logoutCallback?: () => void;
  navigation: any;
}

interface Screen {
  label: string;
  screenName: string;
  isFirst?: boolean;
}

const APP_SCREENS: Screen[] = [
  {
    label: 'Recherche',
    isFirst: true,
    screenName: 'Search'
  },
  {
    label: 'Garde-manger',
    screenName: 'Pantries'
  },
  {
    label: 'Mes recettes',
    screenName: 'Recipes'
  },
  {
    label: 'Mes favoris',
    screenName: 'Favoris'
  },
  {
    label: 'Historique',
    screenName: 'History'
  }
];

const NAVIGATION_WIDTH = 300;

export const Navigation: React.FC<Props> = ({
  activeScreen,
  toggleLoginForm,
  toggleRegisterForm,
  navigation,
  logout,
  logoutCallback
}) => {
  const [skipUseMe, setSkipUseMe] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);
  const [navStyles, setNavStyles] = useState([styles.navigation]);
  const isConnected = useSelector(
    (state: any): boolean => state.app.isConnected
  );
  const { isMobileAndTablet, isDesktop } = useMediaQuery();
  // @ts-ignore
  const [animatedValue, setAnimatedValue] = useState(
    new Animated.Value(NAVIGATION_WIDTH)
  );

  const navigationIsClose = isMobileAndTablet && !showNavigation;
  const navigationIsOpen = isMobileAndTablet && showNavigation;

  useEffect(() => {
    if (isConnected) {
      setSkipUseMe(false);
    }

    if (isMobileAndTablet && navigationIsClose) {
      setNavStyles([...navStyles, styles.tablet]);
    }

    if (isMobileAndTablet && navigationIsOpen) {
      setNavStyles([...navStyles, styles.active]);
    }

    if (isDesktop) {
      setNavStyles([styles.navigation]);
      setShowNavigation(false);
    }
  }, [
    isMobileAndTablet && navigationIsClose,
    isMobileAndTablet && navigationIsOpen,
    isDesktop
  ]);

  useMe({
    skip: skipUseMe
  });

  const toggleNavigation = () => {
    Animated.timing(animatedValue, {
      toValue: showNavigation ? NAVIGATION_WIDTH : 0,
      duration: NAVIGATION_WIDTH,
      useNativeDriver: true
    }).start();
    setShowNavigation(!showNavigation);
  };

  if (isConnected) {
    return (
      <>
        <Hamburger onPress={toggleNavigation} />
        <Animated.View
          style={[
            ...navStyles,
            { transform: [{ translateX: isDesktop ? 0 : animatedValue }] }
          ]}>
          {/* TODO: Create overlay for close navigation */}
          <Hamburger onPress={toggleNavigation} />
          {APP_SCREENS.map(({ label, screenName }: Screen, index: number) => (
            <NavLink
              key={index}
              label={label}
              isActive={activeScreen === screenName}
              onPress={() => navigation.navigate(screenName)}
            />
          ))}
          <Spacer width={10} />
          <ExitIcon
            onPress={() => {
              logout();
              logoutCallback && logoutCallback();
            }}
          />
        </Animated.View>
      </>
    );
  }

  return (
    <>
      <Hamburger onPress={toggleNavigation} />
      <Animated.View
        style={[...navStyles, { transform: [{ translateX: animatedValue }] }]}>
        <NavLink label="Connexion" isFirst onPress={toggleLoginForm} />
        <NavLink label="Inscription" isLast onPress={toggleRegisterForm} />
      </Animated.View>
    </>
  );
};

const styles = {
  navigation: css({
    flexDirection: 'row'
  }),
  tablet: css({
    flexDirection: 'column',
    position: 'absolute',
    top: -40,
    right: 0,
    width: NAVIGATION_WIDTH,
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, .3)'
  }),
  active: css({})
};
