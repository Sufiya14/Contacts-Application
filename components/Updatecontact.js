import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
import {launchImageLibrary} from 'react-native-image-picker';

const db = openDatabase({name: 'ContactDatabase.db'});

export default function Updatecontact({navigation}) {
  const route = useRoute();
  const [name, setName] = useState('');
  const [contactno, setContactno] = useState('');
  const [landline, setLandline] = useState('');
  const [image, setImage] = useState('');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setName(route.params.data.name);
    setContactno(route.params.data.contactno.toString());
    setFavorite(route.params.data.favorite);
    setLandline(route.params.data.landline.toString());
    setImage(route.params.data.image);
    //console.log(name, contactno, landline, image, favorite);
  }, []);

  const fav = () => {
    setFavorite(!favorite);
  };

  //image picker
  const imagepicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });
    if (!result.didCancel) {
      setImage(result.assets[0].uri);
    }
  };

  //update contact
  const update_contact = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE contacts set name=?, contactno=?, landline=?, image=?, favorite=? where user_id=?',
        [name, contactno, landline, image, favorite, route.params.data.id],
        (tx, result) => {
          console.log('Results', result.rowsAffected);
          navigation.navigate('Contactlist');
        },
      );
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.main}>
          <TextInput
            placeholder="Enter Name"
            placeholderTextColor="black"
            style={styles.textinput}
            value={name}
            onChangeText={text => setName(text)}
          />
          <TextInput
            placeholder="Enter Contact No"
            placeholderTextColor="black"
            maxLength={10}
            keyboardType="numeric"
            style={styles.textinput}
            value={contactno}
            onChangeText={text => setContactno(text)}
          />
          <TextInput
            placeholder="Enter Landline"
            placeholderTextColor="black"
            maxLength={10}
            keyboardType="numeric"
            value={landline}
            onChangeText={text => setLandline(text)}
            style={styles.textinput}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-evenly',
            }}>
            {image ? (
              <Image
                source={{uri: image}}
                style={{
                  height: 50,
                  width: 50,
                  marginRight: 10,
                }}
              />
            ) : null}
            <TouchableOpacity
              style={[
                styles.touchableOpacity,
                {width: '50%', backgroundColor: '#33691E'},
              ]}
              onPress={imagepicker}>
              <Text style={[styles.touchableOpacityText, {fontSize: 18}]}>
                Add Photo from gallery
              </Text>
            </TouchableOpacity>

            {favorite == 1 ? (
              <TouchableOpacity onPress={fav} style={{padding: 10}}>
                <Image
                  source={require('../images/favorite.png')}
                  style={{
                    height: 40,
                    width: 40,
                    borderColor: 'black',
                    borderWidth: 0,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={fav} style={{padding: 10}}>
                <Image
                  source={require('../images/unfavorite.png')}
                  style={{
                    height: 40,
                    width: 40,
                    borderColor: 'black',
                    borderWidth: 0,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.touchableOpacity,
              {marginTop: 20, backgroundColor: '#33691E'},
            ]}
            onPress={update_contact}>
            <Text style={styles.touchableOpacityText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  textinput: {
    height: 45,
    width: '90%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 7,
    marginTop: 15,
    color: 'black',
  },
  touchableOpacity: {
    backgroundColor: '#0091EA',
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },

  touchableOpacityText: {
    color: '#fff',
    fontSize: 23,
    textAlign: 'center',
    padding: 8,
  },
});
