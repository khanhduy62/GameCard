import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Card from './Card';

const getShuffledArr = arr => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

const generatedId = () => Math.random().toString(36).substr(2, 9);

const generateList = listFlipData => {
  const flipcards = getShuffledArr([
    ...listFlipData,
    ...listFlipData,
    ...listFlipData,
  ]);
  return flipcards.map(e => {
    const freezeObj = Object.assign({}, e);
    freezeObj.id = generatedId();
    freezeObj.flipped = false;
    freezeObj.correct = false;
    return freezeObj;
  });
};

const CardContainer = ({cards}) => {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(generateList(cards));
  const [gameTurn, setGameTurn] = useState(0);
  const firstCard = useRef();
  const latestCard = useRef();

  useEffect(() => {
    if (gameTurn === 2) {
      setTimeout(() => {
        const latestCardContent = latestCard.current.content;
        const latestCardId = latestCard.current.id;
        const firstCardContent = firstCard.current.content;
        const firstCardId = firstCard.current.id;

        const sameContent = firstCardContent === latestCardContent;
        const dataUpdated = data.map(el => {
          return {
            ...el,
            flipped: false,
            correct:
              el.correct ||
              (sameContent && el.id === firstCardId) ||
              (sameContent && el.id === latestCardId),
          };
        });
        firstCard.current = null;
        setGameTurn(0);
        setData(dataUpdated);
      }, 200);
    }
  }, [data, gameTurn]);

  const handleChange = id => {
    if (gameTurn !== 2) {
      const dataUpdated = data.map(el => {
        if (el.id === id) {
          if (!firstCard.current) {
            firstCard.current = el;
          }
          latestCard.current = el;
          return {
            ...el,
            flipped: true,
          };
        } else {
          return el;
        }
      });
      setGameTurn(gameTurn + 1);
      setData(dataUpdated);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.bottom}]}>
      {data.map(el => (
        <Card key={el.id} item={el} handleChange={handleChange} />
      ))}
    </View>
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
  },
});
export default CardContainer;
