import React, {FC, useCallback, useContext, useState} from 'react';
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
import {Button, ListItem, Screen, Text, Header} from '../components';
import {HomeTabScreenProps} from '../navigators/HomeNavigator';
import {spacing, colors} from '../theme';
import {openLinkInBrowser} from '../utils/openLinkInBrowser';
import {isRTL} from '../i18n';
import {Icon} from '../components';
import {useStores} from 'app/models';
import {calculateFullAge} from 'app/models/helpers/dateHelpers';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {formatDate} from 'app/utils/formatDate';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import {UserContext} from 'app/utils/UserContext';
import {useFocusEffect} from '@react-navigation/native';
import Loading from 'app/components/Loading';
import moment from 'moment';
const chainReactLogo = require('../../assets/images/cr-logo.png');
const reactNativeLiveLogo = require('../../assets/images/rnl-logo.png');
const reactNativeRadioLogo = require('../../assets/images/rnr-logo.png');
const reactNativeNewsletterLogo = require('../../assets/images/rnn-logo.png');

const STATUS = ['Checkin', 'Vitals', 'Prescription', 'Pharmacy', 'Checkout'];
const PATIENTS = [
  {
    patientId: 1,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: true,
    pharmacySynced: true,
    checkoutSynced: true,
  },
  {
    patientId: 2,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: true,
    pharmacySynced: true,
    checkoutSynced: false,
  },
  {
    patientId: 3,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: true,
    checkoutSynced: true,
  },
  {
    patientId: 4,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 5,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 6,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 7,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 8,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 9,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 10,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
];

export const PatientStatusScreen: FC<HomeTabScreenProps<'PatientStatus'>> =
  function PatientStatusScreen(_props) {
    const [patient, setPatient] = useState('');
    const {navigation} = _props;
    const {patientStore, authenticationStore} = useStores();
    const {patientQueue, patientsForList} = patientStore;

    const [refresh, setRefresh] = useState('1');
    const [successResp, setSuccessResp] = useState<null | number[]>(null);
    const [isLoading, setIsLoading] = useState(false);
    const userContext = useContext(UserContext);

    useFocusEffect(
      useCallback(() => {
        setSuccessResp(global.successResponses ? global.successResponses : []);
        setRefresh(Math.random().toString());
        setIsLoading(false);
      }, [userContext.refreshData]),
    );

    const onSyncPressed = (patientData: any) => {
      try {
        let tempPatient = JSON.parse(JSON.stringify(patientData));

        if (userContext.clientSocket) {
          setIsLoading(true);
          userContext.clientSocket.write(
            JSON.stringify({
              sender: 'pharmacy',
              payload: {
                PatientId: tempPatient.PatientId,
                Status: 'Pharmacy',
                PharmacyTime: tempPatient.PharmacyTime,
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
          setTimeout(() => {
            setIsLoading(false);
          }, 1000 * 10);
        } else {
          ToastAndroid.show(
            'Unable to sync. Please check the connectivity',
            ToastAndroid.LONG,
          );
        }
      } catch (e) {
        setIsLoading(false);
      }
    };

    const PatientItem = ({title}) => (
      <View style={$patientItemView}>
        <View style={$patientItemTitleView}>
          <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {'MRN: ' + title.MRNNo}
          </Text>
        </View>
        <View style={[$patientItemDetailView, {padding: spacing.sm}]}>
          <Text testID="login-heading" preset="bold" style={$patientsText}>
            {title.FirstName +" "+title.LastName}
          </Text>
          <Text testID="login-heading" preset="default" style={$patientsText}>
            {
              // item.MRNNo + ' | ' +
              title.Gender + ' | ' + calculateFullAge(title.DOB)
            }
          </Text>
        </View>

        {/* Check in..... */}
        <View style={$patientItemDetailView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[$circleLineView, {marginTop: 20}]}>
              <View
                style={[
                  $circleStartView,
                  title.CheckInTime && {backgroundColor: colors.themeText},
                ]}
              />
              <View
                style={[
                  $lineView,
                  title.CheckInTime && {backgroundColor: colors.themeText},
                ]}
              />
            </View>
            <Icon
              icon={title.CheckInTime ? 'checkin_blue' : 'checkin'}
              size={30}
            />
            <View style={{flexDirection: 'column'}}>
              <Text
                testID="login-heading"
                preset="default"
                style={[
                  $patientsText,
                  {marginStart: spacing.sm},
                  title.CheckInTime && {color: colors.themeText},
                ]}>
                {'Check - In'}
              </Text>
              {title.CheckInTime && (
                <Text
                  testID="login-heading"
                  preset="default"
                  style={[
                    $patientsText,
                    {marginStart: spacing.sm, fontSize: 12},
                  ]}>
                  {/* {title.CheckInTime ? formatDate(title.CheckInTime) : ""} */}
                  {moment(title.CheckInTime).format('YYYY-MM-DD hh:mm A')}
                </Text>
              )}
            </View>
          </View>
          <View
            style={[
              $circleView,
              {backgroundColor: title.CheckInSynced ? 'green' : 'lightgray'},
            ]}>
            <Icon
              icon={title.CheckInSynced ? 'sync' : 'unsync'}
              color={title.CheckInSynced && 'green'}
              size={20}
            />
          </View>
        </View>

        {/* Vitals..... */}
        <View style={$patientItemDetailView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[$circleLineView]}>
              <View
                style={[
                  $lineView,
                  title.VitalsTime && {backgroundColor: colors.themeText},
                ]}
              />
              <View
                style={[
                  $circleStartView,
                  title.VitalsTime && {backgroundColor: colors.themeText},
                ]}
              />
              <View
                style={[
                  $lineView,
                  title.VitalsTime && {backgroundColor: colors.themeText},
                ]}
              />

              {/* <View style={[$lineView, title.Status == 'Vitals' && {backgroundColor: colors.themeText}]} />
              <View style={[$circleStartView, title.Status == 'Vitals' && {backgroundColor: colors.themeText}]} />
              <View style={[$lineView, title.Status == 'Vitals' && {backgroundColor: colors.themeText}]} /> */}
            </View>
            <Icon
              icon={title.VitalsTime ? 'vitals_blue' : 'vitals'}
              size={30}
            />
            <View style={{flexDirection: 'column'}}>
              <Text
                testID="login-heading"
                preset="default"
                // style={[$patientsText, {marginStart: spacing.sm}, title.Status == 'Vitals' && {color: colors.themeText}]}
                style={[
                  $patientsText,
                  {marginStart: spacing.sm},
                  title.VitalsTime && {color: colors.themeText},
                ]}>
                {'Vitals'}
              </Text>
              {title.VitalsTime && (
                <Text
                  testID="login-heading"
                  preset="default"
                  style={[
                    $patientsText,
                    {marginLeft: spacing.sm, fontSize: 12},
                  ]}>
                  {moment(title.VitalsTime).format('YYYY-MM-DD hh:mm A')}
                </Text>
              )}
            </View>
          </View>
          <View
            style={[
              $circleView,
              {backgroundColor: title.vitalsSynced ? 'green' : 'lightgray'},
            ]}>
            <Icon
              icon={title.vitalsSynced ? 'sync' : 'unsync'}
              color={title.vitalsSynced && 'green'}
              size={20}
            />
          </View>
        </View>

        {/* Prescription..... */}
        <View style={$patientItemDetailView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[$circleLineView]}>
              <View
                // style={[
                //   $lineView,
                //   title.Status == "Prescription" && { backgroundColor: colors.themeText },
                // ]}
                style={[
                  $lineView,
                  title.PrescriptionTime && {backgroundColor: colors.themeText},
                ]}
              />

              <View
                style={[
                  $circleStartView,
                  title.PrescriptionTime && {backgroundColor: colors.themeText},
                ]}
              />
              <View
                style={[
                  $lineView,
                  title.PrescriptionTime && {backgroundColor: colors.themeText},
                ]}
              />
            </View>
            <Icon
              icon={title.VitalsTime ? 'prescription_blue' : 'prescription'}
              size={30}
            />
            <View style={{flexDirection: 'column'}}>
              <Text
                testID="login-heading"
                preset="default"
                style={[
                  $patientsText,
                  {marginStart: spacing.sm},
                  title.PrescriptionTime && {color: colors.themeText},
                ]}>
                {'Prescription'}
              </Text>
              {title.PrescriptionTime && (
                <Text
                  testID="login-heading"
                  preset="default"
                  style={[
                    $patientsText,
                    {marginLeft: spacing.sm, fontSize: 12},
                  ]}>
                  {moment(title.PrescriptionTime).format('YYYY-MM-DD hh:mm A')}
                </Text>
              )}
            </View>
          </View>
          <View
            style={[
              $circleView,
              {
                backgroundColor: title.prescriptionSynced
                  ? 'green'
                  : 'lightgray',
              },
            ]}>
            <Icon
              icon={title.prescriptionSynced ? 'sync' : 'unsync'}
              color={title.vitalsSynced && 'green'}
              size={20}
            />
          </View>
        </View>

        {/* Pharmacy..... */}
        <View style={$patientItemDetailView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[$circleLineView]}>
              <View
                style={[
                  $lineView,
                  title.PharmacyTime && {backgroundColor: colors.themeText},
                ]}
              />
              <View
                style={[
                  $circleStartView,
                  title.PharmacyTime && {backgroundColor: colors.themeText},
                ]}
              />
              <View
                style={[
                  $lineView,
                  title.PharmacyTime && {backgroundColor: colors.themeText},
                ]}
              />
            </View>
            <Icon
              icon={title.PharmacyTime ? 'pharmacy_blue' : 'pharmacy'}
              size={30}
            />
            <View style={{flexDirection: 'column'}}>
              <Text
                testID="login-heading"
                preset="default"
                style={[
                  $patientsText,
                  {marginStart: spacing.sm},
                  title.PharmacyTime && {color: colors.themeText},
                ]}>
                {'Pharmacy'}
              </Text>
              {title.PharmacyTime && (
                <Text
                  testID="login-heading"
                  preset="default"
                  style={[
                    $patientsText,
                    {marginLeft: spacing.sm, fontSize: 12},
                  ]}>
                  {moment(title.PharmacyTime).format('YYYY-MM-DD hh:mm A')}
                </Text>
              )}
            </View>
          </View>
          {!successResp ? null : successResp.includes(
              title.PatientId,
            ) ? null : title.PharmacyTime ? (
            <TouchableOpacity
              onPress={() => onSyncPressed(title)}
              style={[
                // $circleView,
                {
                  backgroundColor: 'lightgray',
                  borderRadius: 4,
                },
              ]}>
              <Text
                preset="default"
                style={{fontSize: 10, paddingHorizontal: 1}}>
                Sync Locally
              </Text>
            </TouchableOpacity>
          ) : null}
          <View
            style={[
              $circleView,
              {backgroundColor: title.pharmacySynced ? 'green' : 'lightgray'},
            ]}>
            <Icon
              icon={title.pharmacySynced ? 'sync' : 'unsync'}
              color={title.vitalsSynced && 'green'}
              size={20}
            />
          </View>
        </View>

        {/* Checkout..... */}
        <View style={$patientItemDetailView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[$circleLineView]}>
              <View
                style={[
                  $lineView,
                  title.CheckoutTime && {
                    backgroundColor: colors.themeText,
                  },
                ]}
              />
              <View
                style={[
                  $circleStartView,
                  title.CheckoutTime && {
                    backgroundColor: colors.themeText,
                  },
                  {marginBottom: 20},
                ]}
              />

              {/* <View style={[$lineView, title.Status == 'Checkout' && {backgroundColor: colors.themeText}]} /> */}
            </View>
            <Icon icon="checkout" size={30} />
            <View style={{flexDirection: 'column'}}>
              <Text
                testID="login-heading"
                preset="default"
                style={[
                  $patientsText,
                  {marginStart: spacing.sm},
                  title.CheckoutTime && {color: colors.themeText},
                ]}>
                {'Check-Out'}
              </Text>
              {title.CheckoutTime && (
                <Text
                  testID="login-heading"
                  preset="default"
                  style={[
                    $patientsText,
                    {marginLeft: spacing.sm, fontSize: 12},
                  ]}>
                  {moment(title.CheckoutTime).format('YYYY-MM-DD hh:mm A')}
                </Text>
              )}
            </View>
          </View>
          <View
            style={[
              $circleView,
              {backgroundColor: title.checkoutSynced ? 'green' : 'lightgray'},
            ]}>
            <Icon
              icon={title.checkoutSynced ? 'sync' : 'unsync'}
              color={title.vitalsSynced && 'green'}
              size={20}
            />
          </View>
        </View>
      </View>
    );

    function patientItemPress(title: React.SetStateAction<string>) {
      console.log('-=-=-=-=-=-=-=-=-', title);
      // console.log('-=-=-=-=-=-=-=-=-', patient)
      setPatient(title);
    }

    function addNewPress() {
      navigation.navigate('Profile');
    }

    function advanceSearchPress() {
      navigation.navigate('Patient');
    }
    const profilePress = () => {
      // console.log('Profile pressed.......')
    };

    return (
      <>
        <Header
          LeftActionComponent={
            <HeaderBackButton
              {...{
                title: 'patientStatusScreen.patientStatus',
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
          <Loading isLoading={isLoading} />
          {/* <Text preset="heading" tx="patientStatusScreen.patientStatus" style={$title} /> */}
          <View style={$patientsListView}>
            <FlatList
              // data={patientQueue}
              data={patientsForList.filter(item=>item.isUserAdded)}
              key={refresh}
              // style={$patientsListView}
              extraData={patientsForList}
              renderItem={({item}) => <PatientItem title={item} />}
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
  flex: 6,
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
};

const $patientTitleText: TextStyle = {
  paddingHorizontal: spacing.sm,
};

const $patientItemInnerView: ViewStyle = {
  flex: 1.1,
};

const $patientItemIconsView: ViewStyle = {
  flex: 1.5,
  flexDirection: 'row',
  alignItems: 'center',
};

const $statusIconView: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: spacing.xxxs,
  paddingVertical: spacing.xxs,
};

const $patientItemDetailView: ViewStyle = {
  height: 50,
  backgroundColor: colors.background,
  // borderBottomRightRadius: 6,
  borderWidth: 0.25,
  // borderBottomLeftRadius: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: spacing.sm,
  alignItems: 'center',
};

const $circleView: ViewStyle = {
  width: 26,
  height: 26,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'lightgray',
  borderRadius: 13,
};

const $circleLineView: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginEnd: spacing.sm,
};

const $circleStartView: ViewStyle = {
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: 'lightgray',
};

const $lineView: ViewStyle = {
  width: 2,
  flex: 1,
  backgroundColor: 'lightgray',
};
// @home remove-file
