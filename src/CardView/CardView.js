import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground, Image, Text, Platform } from 'react-native';
import defaultIcons from '../Icons';
import FlipCard from 'react-native-flip-card-plus';
import s from './styles';

const BASE_SIZE = { width: 300, height: 190 };
const addGaps = (value) => {
  const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
  const onlyNumbers = String(value).replace(/[^\d]/g, '');

  return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
    [$1, $2, $3, $4].filter((group) => !!group).join(' ')
  );
};

const propTypes = {
  focused: PropTypes.string,
  display: PropTypes.bool,
  brand: PropTypes.string,
  name: PropTypes.string,
  number: PropTypes.string,
  expiry: PropTypes.string,
  expiryTitle: PropTypes.string,
  cvc: PropTypes.string,
  placeholder: PropTypes.object,
  postalCode: PropTypes.string,
  onPressfunc: PropTypes.func,
  flipDirection: PropTypes.string,
  onLongPressfunc: PropTypes.func,
  scale: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  fontFamily: PropTypes.string,
  imageFront: PropTypes.number,
  imageBack: PropTypes.number,
  customIcons: PropTypes.object,
};

const defaultProps = {
  name: '',
  placeholder: {
    number: '•••• •••• •••• ••••',
    name: 'NAME',
    expiryTitle: 'MONTH/YEAR',
    expiry: '••/••',
    cvc: '•••',
    postalCode: 'BANK NAME',
  },

  scale: 1,
  fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  imageFront: require('../images/card-front.png'),
  imageBack: require('../images/card-back.png'),
  onPressfunc: () => {},
  flipDirection: 'h',
  onLongPressfunc: () => {},
  display: false,
};

const CardView = (props) => {
  const {
    focused,
    brand,
    name,
    number,
    expiryTitle,
    expiry,
    cvc,
    postalCode,
    customIcons,
    placeholder,
    imageFront,
    imageBack,
    scale,
    fontFamily,
    onPressfunc,
    flipDirection,
    onLongPressfunc,
    style,
    display,
  } = props;

  const Icons = { ...defaultIcons, ...customIcons };
  const isAmex = brand === 'american-express';
  const shouldFlip = () => !isAmex && focused === 'cvc';

  const containerSize = { ...BASE_SIZE, height: BASE_SIZE.height * scale };
  const transform = {
    transform: [
      { scale },
      { translateY: (BASE_SIZE.height * (scale - 1)) / 2 },
    ],
  };

  const baseSyle = [s.baseText, { fontFamily }];

  const isFocused = (type) => focused === type && s.focused;

  return (
    <View style={[s.cardContainer, containerSize, style]}>
      <FlipCard
        style={{ borderWidth: 0 }}
        flipHorizontal={flipDirection.toLowerCase() == 'h' ? true : false}
        flipVertical={flipDirection.toLowerCase() == 'v' ? true : false}
        friction={10}
        perspective={2000}
        pressable={true}
        pressableCustomFunc={true}
        onPressed={onPressfunc}
        longPressable={true}
        onLongPressed={onLongPressfunc}
        flip={shouldFlip()}>
        <ImageBackground
          style={[BASE_SIZE, s.cardFace, transform]}
          source={imageFront}>
          <Image
            resizeMode={'contain'}
            style={[s.icon]}
            source={Icons[brand]}
          />
          <Text
            style={[
              ...baseSyle,
              s.postalCode,
              !number && s.placeholder,
              isFocused('postalCode'),
            ]}>
            {!postalCode ? placeholder.postalCode : postalCode}
          </Text>
          <Text
            style={[
              ...baseSyle,
              s.number,
              !number && s.placeholder,
              isFocused('number'),
            ]}>
            {!number ? placeholder.number : display ? addGaps(number) : number}
          </Text>
          <Text
            style={[
              ...baseSyle,
              s.name,
              !name && s.placeholder,
              isFocused('name'),
            ]}
            numberOfLines={1}>
            {!name ? placeholder.name : name.toUpperCase()}
          </Text>
          <Text
            style={[
              s.baseText,
              { fontFamily },
              s.expiryLabel,
              !expiryTitle && s.placeholder,
              focused === 'expiry' && s.focused,
            ]}>
            {!expiryTitle ? placeholder.expiryTitle : expiryTitle.toUpperCase()}
          </Text>
          <Text
            style={[
              ...baseSyle,
              s.expiry,
              !expiry && s.placeholder,
              isFocused('expiry'),
            ]}>
            {!expiry ? placeholder.expiry : expiry}
          </Text>
          {isAmex && (
            <Text
              style={[
                ...baseSyle,
                s.amexCVC,
                !cvc && s.placeholder,
                isFocused('cvc'),
              ]}>
              {!cvc ? placeholder.cvc : cvc}
            </Text>
          )}
        </ImageBackground>
        <ImageBackground
          style={[BASE_SIZE, s.cardFace, transform]}
          source={imageBack}>
          <Text
            style={[
              s.baseText,
              s.cvc,
              !cvc && s.placeholder,
              isFocused('cvc'),
            ]}>
            {!cvc ? placeholder.cvc : cvc}
          </Text>
        </ImageBackground>
      </FlipCard>
    </View>
  );
};

CardView.defaultProps = defaultProps;
CardView.propTypes = propTypes;

export default CardView;
