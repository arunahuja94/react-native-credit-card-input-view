import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  NativeModules,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ViewPropTypes,
  TextInput,
  findNodeHandle,
} from 'react-native';

import CreditCard from './CardView/CardView';
import CCInput from './CCInput';
import { InjectedProps } from './connectToState';
													 
const sHorizontal = StyleSheet.create({ 
  container: {
    alignItems: 'center',
    width: '100%',
    marginTop: -70,
  },
  form: {
    marginVertical: 20,
    width: '100%',
    flexDirection: 'row',
    marginHorizontal: 20,
    height: '100%',
  },
  inputContainer: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontWeight: 'bold',
  },
  input: {
    height: 40,
  },
});
const sVertical = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginTop: -70,
  },
  form: {
    marginTop: 20,
    marginBottom: 40,
    width: '85%',
    marginHorizontal: 40,
    height: '100%',
  },
  inputContainer: {
    marginVertical: 20,
  },
  inputLabel: {
    fontWeight: 'bold',
  },
  input: {
    height: 40,
  },
});
const CVC_INPUT_WIDTH = 70;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH = Dimensions.get('window').width * 0.5;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 100; // https://github.com/yannickcr/eslint-plugin-react/issues/106

/* eslint react/prop-types: 0 */ export default class CreditCardInput extends Component {
  state = {
    cardType: '',
  };
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    // inputStyle: Text.propTypes.style,
    inputStyle: TextInput.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,
    allowScroll: PropTypes.bool,
    useVertical: PropTypes.bool,
    additionalInputsProps: PropTypes.objectOf(
      PropTypes.shape(TextInput.propTypes)
    ),

    scrollViewProps: PropTypes.object,
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: 'CARD NUMBER',
      expiry: 'EXPIRY',
      cvc: 'CVC/CCV',
      postalCode: 'POSTAL CODE',
    },
    placeholders: {
      name: 'Full Name',
      number: '1234 5678 1234 5678',
      expiry: 'MM/YY',
      cvc: 'CVC',
      postalCode: '34567',
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
    validColor: '',
    invalidColor: 'red',
    placeholderColor: 'gray',
    allowScroll: false,
    useVertical: false,
    additionalInputsProps: {},
  };

  componentDidMount = () =>
    this._focus(this.props.focused, this.props.useVertical);

  componentDidUpdate(prevProps) {
    if (prevProps.focused !== this.props.focused)
      this._focus(this.props.focused, this.props.useVertical);
  }

  _focus = (field, useVertical) => {
    if (!field) {
      return false;
    } else if (useVertical) {
      return false;
    } else {
      const scrollResponder = this.refs.Form.getScrollResponder();
      const nodeHandle = findNodeHandle(this.refs[field]);

      NativeModules.UIManager.measureLayoutRelativeToParent(
        nodeHandle,
        (e) => {
          throw e;
        },
        (x) => {
          scrollResponder.scrollTo({
            x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0),
            animated: true,
          });
          this.refs[field].focus();
        }
      );
    }
  };

  _inputProps = (field) => {
    const {
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      labels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;
    const style = sHorizontal;

    return {
      inputStyle: [style.input, inputStyle],
      labelStyle: [style.inputLabel, labelStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,
      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    const {
      cardImageFront,
      cardImageBack,
      inputContainerStyle,
      values: { number, expiry, cvc, name, type, postalCode },
      focused,
      placeholderCardView,
      allowScroll,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      cardScale,
      cardFontFamily,
      cardBrandIcons,
      scrollViewProps,
      useVertical,
    } = this.props;
    const styles = useVertical ? sVertical : sHorizontal;
    //console.log(type);
    return (
      <View style={styles.container}>
        <CreditCard
          focused={focused}
          brand={this.state.cardType !== '' ? this.state.cardType : type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          placeholder={placeholderCardView}
          name={requiresName ? name : ' '}
          number={number}
          cvc={cvc}
          expiry={expiry}
          postalCode={postalCode} />
        <ScrollView
          ref="Form"
          horizontal={useVertical ? false : true}
          keyboardShouldPersistTaps="always"
          scrollEnabled={allowScroll}
          showsVerticalScrollIndicator={false}
          style={styles.form}
          contentContainerStyle={styles.vForm}
          {...scrollViewProps}>
          {requiresName && (
            <CCInput
              {...this._inputProps('name')}
              containerStyle={[
                styles.inputContainer,
                inputContainerStyle,
                { width: useVertical ? '100%' : NAME_INPUT_WIDTH },
              ]} />
          )}
          <CCInput
            {...this._inputProps('number')}
            keyboardType="numeric"
            containerStyle={[
              styles.inputContainer,
              inputContainerStyle,
              { width: useVertical ? '100%' : CARD_NUMBER_INPUT_WIDTH },
            ]}
          />
          <CCInput
            {...this._inputProps('expiry')}
            keyboardType="numeric"
            containerStyle={[styles.inputContainer, inputContainerStyle]} />
          {requiresCVC && (
            <CCInput
              {...this._inputProps('cvc')}
              keyboardType="numeric"
              containerStyle={[
                styles.inputContainer,
                inputContainerStyle,
                { width: useVertical ? '100%' : CVC_INPUT_WIDTH },
              ]} />
          )}
          {requiresPostalCode && (
            <CCInput
              {...this._inputProps('postalCode')}
              containerStyle={[
                styles.inputContainer,
                inputContainerStyle,
                { width: useVertical ? '100%' : POSTAL_CODE_INPUT_WIDTH },
              ]} />
          )}
 	  
        </ScrollView>
      </View>
    );
  }
}
