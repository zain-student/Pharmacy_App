import React, {FC, useCallback, useContext, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
} from 'react-native';
import {Header, Button, ListItem, Screen, Text} from '../components';
import {HomeTabScreenProps} from '../navigators/HomeNavigator';
import {spacing, colors} from '../theme';
import {openLinkInBrowser} from '../utils/openLinkInBrowser';
import {isRTL} from '../i18n';
import {useStores} from 'app/models';
import {ageCalculator, calculateFullAge} from 'app/models/helpers/dateHelpers';
import {DrawerIconButton} from './HomeScreen/DrawerIconButton';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import Loading from 'app/components/Loading';
import {UserContext} from 'app/utils/UserContext';
import {useFocusEffect} from '@react-navigation/native';

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

export const TodaysPatientsScreen: FC<HomeTabScreenProps<'TodaysPatients'>> =
  function TodaysPatientsScreen(_props) {
    const [patient, setPatient] = useState('');
    const {navigation} = _props;
    const {patientStore, orderStore, stockStore} = useStores();
    const {patientQueue, patientQueueForList, patientsForList} = patientStore;
    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState('1');
    const userContext = useContext(UserContext);

    useFocusEffect(
      useCallback(() => {
        setRefresh(Math.random().toString());
      }, [userContext.refreshData]),
    );

    function onItemPress(item: any) {
      console.log('-=-=-=-=-=-=-=', item);
      patientStore.selectAPatient(item);
      load(item);
    }

    const load = async item => {
      console.warn('running', item);
      setIsLoading(true);
      await orderStore.fetchOrders(item.PatientId);
      console.warn('here');
      await stockStore.fetchStocks();
      setIsLoading(false);
      navigation.navigate('Patient');
    };

    const PatientItem = ({title, index}) => (
      <TouchableOpacity
        onPress={() => onItemPress(title)}
        style={$patientItemView}>
        <View style={$patientItemTitleView}>
          <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {'T/No: ' + (index + 1)}
          </Text>
          <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {'MRN: ' + title.MRNNo}
          </Text>
        </View>
        <View style={$patientItemDetailView}>
          <Text
            testID="login-heading"
            preset="bold"
            style={[$patientsText, {maxWidth: '50%'}]}>
            {title.FirstName + ' ' + title.LastName}
          </Text>
          <Text testID="login-heading" preset="default" style={$patientsText}>
            {
              // item.MRNNo + ' | ' +
              title.Gender + ' | ' + calculateFullAge(title.DOB)
            }
          </Text>
        </View>
        {false ? (
          <View style={[$patientItemDetailView, {flexDirection: 'column'}]}>
            <FlatList
              data={title.Services}
              // style={$patientsListView}
              numColumns={2}
              extraData={title.Services}
              renderItem={({item}) => {
                return (
                  <View style={$serviceItem}>
                    <Text testID="login-heading" style={$patientsText}>
                      {item.ServiceName}
                    </Text>
                  </View>
                );
              }}
              keyExtractor={item => item.ServiceId}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );

    const profilePress = () => {
      // console.log('Profile pressed.......')
    };

    return (
      <>
        {console.log('inside patient queue screen....', patientQueueForList())}
        {console.log(
          'inside patient queue screen....',
          patientStore.patientsForList,
        )}
        <Header
          LeftActionComponent={
            <HeaderBackButton
              {...{
                title: 'todaysPatientsScreen.todaysPatients',
                navigation: navigation,
              }}
            />
          }
          RightActionComponent={<ProfileIconButton onPress={profilePress} />}
        />
        <Loading isLoading={isLoading} />
        <Screen
          preset="fixed"
          contentContainerStyle={$container}
          //  safeAreaEdges={["top"]}
        >
          <View style={$patientsListView}>
            <FlatList
              data={patientStore.patientsForList}
              extraData={patientStore.patientsForList}
              key={refresh}
              renderItem={({item, index}) => {
                let showItem = false;
                {
                  for (let i = 0; i < item.Medications.length; i++) {
                    showItem = item.Medications[i].Dispatched
                      ? item.Medications[i].Dispatched
                      : false;
                  }
                }
                if (!showItem) {
                  return <PatientItem title={item} index={index} />;
                } else {
                  return null;
                }
              }}
              keyExtractor={item => item.PatientId}
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

const $title: TextStyle = {
  flex: 0.5,
  marginBottom: spacing.sm,
};

const $patientsListView: ViewStyle = {
  flex: 1,
  // borderWidth: 1,
  width: '100%',
  alignSelf: 'center',
  // marginVertical: spacing.sm,
};

const $patientsText: TextStyle = {
  // padding: spacing.sm,
};

const $buttonsView: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  // alignSelf: 'baseline',
  // position: 'absolute',
  // bottom: 20,
  width: '100%',
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $patientItemView: ViewStyle = {
  elevation: 8,
  marginVertical: spacing.md,
  backgroundColor: colors.background,
  borderRadius: 10,
};

const $patientItemTitleView: ViewStyle = {
  flex: 1,
  backgroundColor: colors.themeColorLight,
  borderTopRightRadius: 6,
  borderTopLeftRadius: 6,
  padding: spacing.sm,
  borderWidth: 0.25,
  elevation: 0,
  flexDirection: 'row',
  justifyContent: 'space-around',
};

const $patientTitleText: TextStyle = {
  fontSize: 14,
  color: colors.themeText,
  // paddingHorizontal: spacing.sm
};

const $serviceItem: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  backgroundColor: colors.themeYellow,
  margin: '2%',
  borderRadius: 5,
};

const $patientItemDetailView: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  // borderBottomRightRadius: 6,
  borderWidth: 0.25,
  // borderBottomLeftRadius: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: spacing.sm,
};

// @home remove-file
