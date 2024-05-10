import {StyleSheet, Text, View, Image, TextInput} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Swipeable, TouchableOpacity} from 'react-native-gesture-handler';
import {openDatabase} from 'react-native-sqlite-storage';
import {useNavigation} from '@react-navigation/native';

const db = openDatabase({name: 'ContactDatabase.db'});

export default function Listdata({item, index, onComponentOpen, onDelete}) {
  const navigation = useNavigation();
  const ref = useRef();

  //right swiper
  const rightswipe = () => {
    return (
      <View
        style={{
          height: 70,
          marginTop: 10,
          backgroundColor: '#fff',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            width: 100,
            height: 70,
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            ref.current.close();
            onDelete(item.user_id);
            //deletecontact(item.user_id);
          }}>
          <Image
            source={require('../images/delete.png')}
            style={{
              height: 30,
              width: 30,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 100,
            height: 70,
            backgroundColor: 'dodgerblue',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            ref.current.close();
            navigation.navigate('Updatecontact', {
              data: {
                name: item.name,
                contactno: item.contactno,
                landline: item.landline,
                image: item.image,
                favorite: item.favorite,
                id: item.user_id,
              },
            });
          }}>
          <Image
            source={require('../images/edit.png')}
            style={{
              height: 30,
              width: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  //all those items where item.opened==false then close their swiper
  useEffect(() => {
    if (item.opened == false) {
      ref.current.close();
    }
  });

  return (
    <View style={{flex: 1}}>
      <Swipeable
        ref={ref}
        renderRightActions={rightswipe}
        onSwipeableOpen={() => {
          onComponentOpen(index);
        }}>
        <View style={styles.main}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{uri: item.image}}
              style={{
                height: 40,
                width: 40,
                marginLeft: 15,
              }}
            />
            <View style={{padding: 10}}>
              <Text style={{color: 'black'}}>{item.name}</Text>
              <Text style={{color: 'black', marginTop: 4}}>
                {item.contactno}
              </Text>
            </View>
          </View>
        </View>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '90%',
    height: 70,
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
