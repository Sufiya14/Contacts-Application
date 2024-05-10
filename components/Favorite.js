import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'ContactDatabase.db'});

export default function Favorite() {
  const isFocused = useIsFocused();
  const [favorites, setFavorites] = useState([]);

  //favorite list
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'Select * from contacts where favorite=? order by name ASC',
        ['1'],
        (tx, result) => {
          let tmp = [];
          for (let i = 0; i < result.rows.length; i++) {
            tmp.push(result.rows.item(i));
          }
          setFavorites(tmp);
        },
      );
    });
  }, [isFocused]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {favorites ? (
        <FlatList
          data={favorites}
          renderItem={({item, index}) => {
            return (
              <View>
                <View
                  style={{
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
                  }}>
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
              </View>
            );
          }}
        />
      ) : (
        <View>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            No favorite added.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
