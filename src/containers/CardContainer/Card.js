import React, {useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Images from '../../assets/Images';

const {width, height} = Dimensions.get('window');

const Card = ({item, handleChange}) => {
  const insets = useSafeAreaInsets();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: !item.flipped ? 180 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [item.flipped, rotateAnim]);

  const frontInterpolate = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '0deg'],
  });

  const onClick = () => handleChange(item.id);

  if (item.correct) {
    return (
      <View
        style={[
          styles.item,
          styles.unActiveView,
          {
            width: (width - insets.left * 3) / 8,
            height: (height - insets.bottom * 3) / 3,
          },
        ]}
      />
    );
  }
  return (
    <TouchableOpacity disabled={item.flipped} onPress={onClick}>
      <Animated.Image
        source={item.content}
        style={[
          styles.item,
          {
            transform: [
              {
                rotateY: frontInterpolate,
              },
            ],
          },
          {
            width: (width - insets.left * 3) / 8,
            height: (height - insets.bottom * 3) / 3,
          },
        ]}
      />
      <Animated.Image
        source={Images.background}
        style={[
          styles.item,
          styles.flippedCardBack,
          {
            transform: [
              {
                rotateY: backInterpolate,
              },
            ],
          },
          {
            width: (width - insets.left * 3) / 8,
            height: (height - insets.bottom * 3) / 3,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    marginTop: 5,
    borderRadius: 4,
    backfaceVisibility: 'hidden',
  },
  unActiveView: {
    opacity: 0,
  },
  flippedCardBack: {
    position: 'absolute',
  },
});

export default Card;
