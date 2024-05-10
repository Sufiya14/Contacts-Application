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
import {React, useEffect, useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'ContactDatabase.db'});

export default function Newcontact({navigation}) {
  const [name, setName] = useState('');
  const [contactno, setContactno] = useState('');
  const [landline, setLandline] = useState('');
  const [image, setImage] = useState('');
  const [favorite, setFavorite] = useState(false);

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

  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='contacts'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS contacts', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS contacts(user_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), contactno INT(10), landline INT(10), image VARCHAR(20), favorite VARCHAR(5))',
              [],
            );
          } else {
            console.log('already created table');
          }
        },
      );
    });
  }, []);

  //set favorite ,by default it is false as by default a contact is unfavorite
  const fav = () => {
    setFavorite(!favorite);
  };
  //add contact
  const add_contact = () => {
    if (!name) {
      alert('Please fill name');
      return;
    }
    if (!contactno) {
      alert('Please fill Contact Number');
      return;
    }
    if (!landline) {
      alert('Please fill Landline');
      return;
    }
    if (!image) {
      alert('Please attach image');
      return;
    }

    db.transaction(txn => {
      txn.executeSql(
        'INSERT  INTO contacts(name, contactno , landline , image , favorite ) VALUES (?,?,?,?,?)',
        [name, contactno, landline, image, favorite],
        (tx, res) => {
          if (res.rowsAffected == 1) {
            navigation.navigate('Contactlist');
          } else {
            console.log(res);
          }
        },
        error => {
          console.log(error);
        },
      );
    });
    setName('');
    setContactno('');
    setLandline('');
    setFavorite(false);
    setImage('');
    alert('contact added success.');
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
              <Text style={[styles.touchableOpacityText, {fontSize: 16}]}>
                Add Photo from gallery
              </Text>
            </TouchableOpacity>

            {favorite ? (
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
            onPress={add_contact}>
            <Text style={styles.touchableOpacityText}>Save</Text>
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
