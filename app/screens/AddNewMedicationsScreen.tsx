import React, {FC, useContext, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {
  Header,
  TextField,
  Button,
  ListItem,
  Screen,
  Text,
  Profile,
} from '../components';
import {HomeTabScreenProps} from '../navigators/HomeNavigator';
import {PatientStackScreenProps} from 'app/navigators';
import {spacing, colors} from '../theme';
import {openLinkInBrowser} from '../utils/openLinkInBrowser';
import {isRTL} from '../i18n';
import {useStores} from 'app/models';
import {ageCalculator, calculateFullAge} from 'app/models/helpers/dateHelpers';
import {formatDate} from 'app/utils/formatDate';
import {ScrollView} from 'react-native-gesture-handler';
import {format} from 'date-fns';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {StackActions} from '@react-navigation/native';
import moment from 'moment';
import {UserContext} from 'app/utils/UserContext';

const chainReactLogo = require('../../assets/images/cr-logo.png');
const reactNativeLiveLogo = require('../../assets/images/rnl-logo.png');
const reactNativeRadioLogo = require('../../assets/images/rnr-logo.png');
const reactNativeNewsletterLogo = require('../../assets/images/rnn-logo.png');

const PATIENTS = [
  {
    patientId: 1,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 2,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 3,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 4,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 5,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 6,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 7,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 8,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 9,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 10,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
];

export const AddNewMedicationsScreen: FC<
  PatientStackScreenProps<'AddNewMedications'>
> = function AddNewMedicationsScreen(_props) {
  const [patient, setPatient] = useState('');
  const {navigation} = _props;
  const {patientStore, stockStore, authenticationStore} = useStores();
  const {
    patientQueue,
    patientQueueForList,
    patientsForList,
    getSelectedPatient,
    addDispatchedMedicines,
    addPyarmacyTime,
  } = patientStore;
  // const [fields, setFields] = useState(fieldStore.fieldsForList)
  const [values, setValues] = useState({});
  const [nursingNote, setNursingNote] = useState('');
  const [patientList, setPatientList] = useState(patientsForList);
  const [currentPatient, setCurrentPatient] = useState(getSelectedPatient());
  const [medicineToDispatch, setMedicineToDispatch] = useState([]);
  const userContext = useContext(UserContext);

  function dispatchPressed() {
    console.log('Dispatched Medications list.....', medicineToDispatch);
    if (medicineToDispatch.length === 0) {
      return;
    }
    for (let i = 0; i < medicineToDispatch.length; i++) {
      const med = medicineToDispatch[i];
      addDispatchedMedicines(
        true,
        med.Quantity,
        i,
        med.PatientId,
        med.MedicineId,
      );
    }
    // console.log("Medications list.....", nursingNote)
    // patientStore.addVitals(values)
    // patientStore.addNursingNote(nursingNote)
    const currentDateTime = moment().toISOString();
    addPyarmacyTime(currentDateTime);
    // // console.log('-=-=-==--=-=-=-=-', patientStore.getSelectedPatient())
    // patientStore.getSelectedPatient.length > 0 &&
    //   patientStore.deselectPatient(patientStore.getSelectedPatient[0])
    sendDataToRecep(currentDateTime);
    ToastAndroid.show('Dispatched Successfully!', ToastAndroid.SHORT);
    navigation.dispatch(StackActions.replace('Home'));
  }

  const sendDataToRecep = async (currentDateTime: string) => {
    try {
      if (userContext.clientSocket) {
        userContext.clientSocket.write(
          JSON.stringify({
            sender: 'pharmacy',
            payload: {
              PatientId: currentPatient[0].PatientId,
              Status: 'Pharmacy',
              PharmacyTime: currentDateTime,
              EnteredBy: {
                UserId: authenticationStore.login
                  ? authenticationStore.login[0]?.UserId
                  : '',
                FullName: authenticationStore.login
                  ? authenticationStore.login[0]?.FullName
                  : '',
              },
              
            },
          }),
        );
      } else {
        // global.dataToTransfer = JSON.stringify({
        //   sender: 'pharmacy',
        //   payload: {
        //     PatientId: currentPatient[0].PatientId,
        //     Status: 'Pharmacy',
        //     PharmacyTime: currentDateTime,
        //   },
        // });
      }
    } catch (e) {}
  };

  const profilePress = () => {
    // console.log('Profile pressed.......')
  };

  return (
    <>
      <Header
        LeftActionComponent={
          <HeaderBackButton
            {...{
              title: 'addNewMedicationsScreen.addNewMedications',
              navigation: navigation,
            }}
          />
        }
        RightActionComponent={<ProfileIconButton onPress={profilePress} />}
      />
      <Screen
        preset="fixed"
        contentContainerStyle={$container}
        // safeAreaEdges={["top"]}
      >
        <Profile />
        {/* <Text preset="heading" tx="vitalsHistoryScreen.vitalsHistoryScreen" style={$title} /> */}
        <ScrollView style={$patientsListView}>
          {currentPatient[0].Medications.map(item => {
            // for (let i = 0; i < stockStore.stocksForList.length; i++) {
            //   if (stockStore.stocksForList[i].MedicineId == item.MedicineId) {
            medicineToDispatch.push(item);
            return (
              <View style={$fieldRowView}>
                <Text preset="formLabel" style={$medicineNameText}>
                  {item.DrugName}
                </Text>
                <View style={$quantityView}>
                  <Text
                    preset="formLabel"
                    style={[
                      $quantityStyle,
                      // stockStore.stocksForList[i].AvailableQTY <
                      //   item.Quantity && {
                      //   color: 'red',
                      // },
                    ]}>
                    {/* {item.AvailableQTY} */}
                    {item.Quantity}
                  </Text>
                  {/* {stockStore.stocksForList[i].AvailableQTY < item.Quantity && (
                    <Text
                      preset="formLabel"
                      style={{marginStart: '2%', marginTop: spacing.sm}}>
                      {'Only ' +
                        stockStore.stocksForList[i].AvailableQTY +
                        ' in Stock.'}
                    </Text>
                  )} */}
                </View>
              </View>
            );
            // } else {
            //   return (
            //     <View style={$fieldRowView}>
            //       <Text preset="formLabel" style={$medicineNameText}>
            //         {item.DrugName}
            //       </Text>
            //       <View style={$quantityView}>
            //         <Text
            //           preset="formLabel"
            //           style={[
            //             $quantityStyle,
            //             {
            //               color: 'red',
            //             },
            //           ]}>
            //           {/* {item.AvailableQTY} */}
            //           {item.Quantity}
            //         </Text>
            //         <Text
            //           preset="formLabel"
            //           style={{marginStart: '2%', marginTop: spacing.sm}}>
            //           {'Not in stock'}
            //         </Text>
            //       </View>
            //     </View>
            //   );
            // }
            // }
          })}
        </ScrollView>
        <View style={$buttonsView}>
          <Button
            testID="login-button"
            tx={'Dispatch'}
            style={[$tapButton, {backgroundColor: colors.themeText}]}
            preset="reversed"
            onPress={dispatchPressed}
          />
        </View>
      </Screen>
    </>
  );
};

const $container: ViewStyle = {
  // paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  flex: 1,
};

const $patientsListView: ViewStyle = {
  // flex: 1,
  // borderWidth: 1,
  width: '100%',
  alignSelf: 'center',
  marginVertical: spacing.sm,
  borderRadius: 10,
  elevation: 5,
  backgroundColor: colors.background,
  paddingTop: spacing.sm,
  paddingBottom: spacing.lg,
};

const $buttonsView: ViewStyle = {
  width: '100%',
  marginBottom: 60,
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $fieldRowView: ViewStyle = {
  marginStart: '4%',
};

const $quantityStyle: TextStyle = {
  marginStart: '2%',
  marginTop: spacing.sm,
  borderWidth: 1,
  width: '50%',
  borderRadius: 5,
  paddingVertical: spacing.xxs,
  textAlign: 'center',
};

const $quantityView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: spacing.xs,
};

const $medicineNameText: TextStyle = {
  marginStart: '2%',
  marginTop: spacing.sm,
  color: colors.themeText,
};

// @home remove-file
