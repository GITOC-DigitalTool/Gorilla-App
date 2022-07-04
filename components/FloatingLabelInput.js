import React, { Component } from "react";
import { View, StatusBar, TextInput, Animated } from "react-native";
import { FormStyles, COLORS } from "../constants";

const defaultStyles = {
  labelStyle: {
    position: "absolute",
    left: 0,
  },
  textInput: {
    height: 30,
    fontSize: 28,
    color: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
  },
  focusedTextInput: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  selectionColor: COLORS.primary,
};

class FloatingLabelInput extends Component {
  state = {
    isFocused: false,
  };

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value === "" ? 0 : 1
    );
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== "" ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  render() {
    const { label, ...props } = this.props;
    const { isFocused } = this.state;
    const style = defaultStyles;
    const animatedLabelStyle = {
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 12],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ["#888", "#888"],
      }),
    };
    return (
      <View style={{ paddingTop: 18 }}>
        <Animated.Text style={[style.labelStyle, animatedLabelStyle]}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={[
            style.textInput,
            isFocused && style.focusedTextInput,
            FormStyles.TextInput,
          ]}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
          selectionColor={style.selectionColor}
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }
}

export default FloatingLabelInput;
