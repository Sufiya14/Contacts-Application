import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import Listdata from './Listdata';

const db = openDatabase({name: 'ContactDatabase.db'});

export default function Contactlist({navigation}) {
  const isFocused = useIsFocused();
  const [contact, setContact] = useState([]);
  const [search, setSearch] = useState('');
  const [showClear, setShowclear] = useState(false); //show clear button only when search results shows to clear search results.

  useEffect(() => {
    getAllcontact();
  }, [isFocused]);

  //getallcontacts
  const getAllcontact = () => {
    db.transaction(tx => {
      tx.executeSql(
        'Select * from contacts order by name ASC',
        [],
        (tx, result) => {
          let tmp = [];
          for (let i = 0; i < result.rows.length; i++) {
            //console.log(result.rows.item(i))
            tmp.push(result.rows.item(i));
            tmp[i].opened = false; //opened:false key value added so that at one time no two or more right swipe open
          }
          setContact(tmp);
        },
      );
    });
    setShowclear(false);
  };

  //to make only one component open at a time i.e;. at one time one right swiper opened.
  const openComponent = ind => {
    let tempdata = contact;
    tempdata.map((item, index) => {
      if (index == ind) {
        item.opened = true;
      } else {
        item.opened = false;
      }
    });
    let temp = [];
    tempdata.map(item => {
      temp.push(item);
    });
    console.log(temp);
    setContact(temp);
  };

  //search working
  const searchContact = () => {
    db.transaction(tx => {
      tx.executeSql(
        'Select  distinct * from contacts where name LIKE ?',
        [`%${search}%`],
        (tx, result) => {
          let tmp = [];
          console.log(result.rows.item);
          for (let i = 0; i < result.rows.length; i++) {
            tmp.push(result.rows.item(i));
            tmp[i].opened = false;
          }
          setContact(tmp);
        },
      );
    });
    setShowclear(true);
  };

  //clear search
  const clearSearch = () => {
    setSearch('');
    getAllcontact();
  };

  //delete contact
  const deletecontact = id => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE from contacts where user_id=?',
        [id],
        (tx, result) => {
          console.log('deleted contact');
          getAllcontact();
        },
      );
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          flexDirection: 'row',
          margin: 20,
        }}>
        <TextInput
          placeholder="Search contact..."
          placeholderTextColor="black"
          value={search}
          onChangeText={text => setSearch(text)}
          style={styles.textinput}
        />
        <TouchableOpacity
          style={[
            styles.touchableOpacity,
            {
              height: 45,
              width: '28%',
              backgroundColor: '#33691E',
              marginTop: 15,
              marginLeft: 10,
            },
          ]}
          onPress={searchContact}>
          <Image
            source={require('../images/search.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
        {showClear ? (
          <TouchableOpacity
            style={[
              styles.touchableOpacity,
              {
                height: 45,
                width: '20%',
                backgroundColor: 'red',
                marginTop: 15,
                marginLeft: 10,
              },
            ]}
            onPress={clearSearch}>
            {/* <Image
              source={require('../images/remove.png')}
              style={{width: 30, height: 30}}
            /> */}
            <Text style={[styles.touchableOpacityText]}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {contact ? (
        <FlatList
          data={contact}
          renderItem={({item, index}) => {
            return (
              <Listdata
                item={item}
                index={index}
                onComponentOpen={x => {
                  openComponent(x);
                }}
                onDelete={x => {
                  deletecontact(x);
                }}
              />
            );
          }}
        />
      ) : null}
      {/* <ScrollView>
      </ScrollView> */}

      <TouchableOpacity
        onPress={() => navigation.navigate('Newcontact')}
        style={styles.touchableImage}>
        <Image
          source={require('../images/plus.png')}
          style={{width: 30, height: 30}}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textinput: {
    height: 45,
    width: '50%',
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
    fontSize: 10,
    textAlign: 'center',
    padding: 8,
  },
  touchableImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#33691E',
    position: 'absolute',
    right: 30,
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
