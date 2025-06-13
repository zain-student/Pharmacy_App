/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams, // @demo remove-current-line
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import * as Screens from 'app/screens';
import Config from '../config';
import {useStores} from '../models'; // @demo remove-current-line
import {DemoNavigator, DemoTabParamList} from './DemoNavigator'; // @demo remove-current-line
import {HomeNavigator, HomeTabParamList} from './HomeNavigator';
import {navigationRef, useBackButtonHandler} from './navigationUtilities';
import {colors} from 'app/theme';
import {PatientNavigator, PatientStackParamList} from './PatientNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from 'app/utils/UserContext';
import {MMKV} from 'react-native-mmkv';
import KeepAwake from 'react-native-keep-awake';
var net = require('react-native-tcp');
export const mmkvStorage = new MMKV();

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined;
  Login: undefined; // @demo remove-current-line
  Landing: undefined;
  SitesScreen: undefined;
  Home: NavigatorScreenParams<HomeTabParamList>; // @demo remove-current-line
  Patient: NavigatorScreenParams<PatientStackParamList>;
  Demo: NavigatorScreenParams<DemoTabParamList>; // @demo remove-current-line
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
};

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = observer(function AppStack() {
  // @demo remove-block-start
  const {
    authenticationStore: {isAuthenticated},
    patientStore,
  } = useStores();

  const [clientSocket, setClientSocket] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  const updateclientSocket = (socket: any) => {
    setClientSocket(socket);
  };

  useEffect(() => {
    try {
      KeepAwake.activate();
      global.successResponses = [];
      if (mmkvStorage.getString('successResponses')) {
        global.successResponses = JSON.parse(
          mmkvStorage.getString('successResponses'),
        );
      }
      console.warn('initiatings');
      global.connectionEstabished = false;
      initiateConnection();
    } catch (e) {}
  }, []);

  const initiateConnection = async () => {
    try {
      // await AsyncStorage.setItem('socketIp', '10.0.2.15');
      let data = await AsyncStorage.getItem('socketIp');
      console.warn('data', data);
      if (data) {
        global.ip = data;
        startConnectionDiscovery();
      }
    } catch (e) {}
  };
  const startConnectionDiscovery = () => {
    clearInterval(global.connectionDiscoveryInterval);

    global.connectionDiscoveryInterval = setInterval(() => {
      if (!global.connectionEstabished) {
        createClient();
      }
    }, 3000);
  };

  const createClient = async () => {
    try {
      console.warn('creating client', global.ip);
      // let ip = await NetworkInfo.getGatewayIPAddress();

      const client = net.createConnection(6666, global.ip, () => {
        console.log('opened client on ' + JSON.stringify(client.address()));
        client.write(JSON.stringify({type: 'initial', from: 'pharmacy'}));
        updateclientSocket(client);
        global.clientSock = client;
        //@ts-ignore
        // if (global.dataToTransfer) {
        //   //@ts-ignore
        //   client.write(global.dataToTransfer);
        // }
        global.connectionEstabished = true;
        clearInterval(global.connectionDiscoveryInterval);
        AsyncStorage.setItem('socketIp', global.ip);
        // ToastAndroid.show('Connected successfully!', ToastAndroid.LONG);
      });

      client.on('data', data => {
        try {
          let receivedData = JSON.parse(data);
          console.log('Client Received: ' + receivedData);
          if (receivedData && receivedData.receiver === 'pharmacy') {
            if (receivedData.type === 'resp_success') {
              if (receivedData.from === 'receptionist') {
                global.successResponses.push(receivedData.patientId);
                mmkvStorage.set(
                  'successResponses',
                  JSON.stringify(global.successResponses),
                );
                setRefreshData(!refreshData);
                // global.socket = socket;
                // global.isServerConnected = true;
                // updateSocket(socket);
              }
              return;
            }
            try {
              client.write(
                JSON.stringify({
                  type: 'resp_success',
                  from: 'pharmacy',
                  patientId: receivedData.payload.PatientId,
                  isCheckoutSync: receivedData.isCheckoutSync,
                }),
              );
            } catch (e) {}
            let isCheckoutSync = receivedData.isCheckoutSync;
            receivedData = receivedData.payload;
            let item = patientStore.patientsForList.find(
              patient => patient.PatientId === receivedData.PatientId,
            );
            console.warn('item::', item);
            if (item) {
              if (isCheckoutSync) {
                let indexToFind = patientStore.patientsForList.findIndex(
                  patient => patient.PatientId === receivedData.PatientId,
                );
                patientStore.addCheckedOutSynced(
                  indexToFind,
                  receivedData.CheckoutTime,
                );
                setTimeout(() => {
                  setRefreshData(!refreshData);
                }, 1000);
              }
            } else {
              console.warn('receivedData', receivedData);
              let medications: any = receivedData.Medications.map(itm => {
                let splitArray = itm.split(':');
                return {
                  MedicineId: splitArray[0],
                  DrugName: splitArray[1],
                  Quantity: splitArray[2],
                  EnteredOn: splitArray[3],
                  OrderNumber: splitArray[4],
                  ProviderName: splitArray[5],
                  DirectionToPatient: splitArray[6],
                  Dispatched: false,
                  PatientId: receivedData.PatientId,
                };
              });
              console.warn('meds', medications);
              let temp = {
                PatientId: receivedData.PatientId,
                FirstName: receivedData.FirstName,
                LastName: receivedData.LastName,
                MRNNo: receivedData.MRNNo,
                DOB: receivedData.DOB,
                CNIC: '',
                CellPhoneNumber: '',
                Gender: receivedData.Gender,
                SiteName: '',
                MartialStatus: '',
                SpouseName: '',
                ZakatEligible: false,
                Country: 'Pakistan',
                City: '',
                Province: '',
                Address: '',
                EnteredOn: '',
                Services: [],

                Status: receivedData.status,
                CheckInTime: receivedData.CheckInTime,
                VitalsTime: receivedData.VitalsTime,
                PrescriptionTime: receivedData.PrescriptionTime,
                PharmacyTime: '',

                CheckInSynced: false,
                NursingNote: '',
                Vitals: [],
                Medications: medications,
              };
              patientStore.addNewPatient(temp);
              setTimeout(() => {
                setRefreshData(!refreshData);
              }, 1000);
            }
          }
        } catch (e) {
          console.warn('err', e);
        }
        // client.destroy(); // kill client after server's response
        // this.server.close();
      });

      client.on('error', error => {
        updateclientSocket(null);
        global.connectionEstabished = false;
        startConnectionDiscovery();
        console.log('client error ' + error);
      });

      client.on('close', () => {
        console.log('client close');
        updateclientSocket(null);
        global.connectionEstabished = false;
        startConnectionDiscovery();
      });
    } catch (e) {}
  };

  const resetConnection = () => {
    try {
      if (global.clientSock) {
        global.clientSock.destroy();
        global.clientSock = null;
      }
      // updateclientSocket(null);
      // global.connectionEstabished = false;
    } catch (e) {
      console.warn('err::', e);
    }
  };

  // @demo remove-block-end
  return (
    <UserContext.Provider
      value={{
        clientSocket,
        refreshData,
        updateclientSocket,
        startConnectionDiscovery,
        resetConnection,
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          navigationBarColor: colors.background,
        }}
        // initialRouteName={isAuthenticated ? "Home " : "Landing"} // @demo remove-current-line
      >
        {/* @demo remove-block-start */}
        {isAuthenticated ? (
          <>
            {/* @demo remove-block-end */}
            {/* <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} /> */}
            {/* @demo remove-block-start */}
            <Stack.Screen name="Home" component={HomeNavigator} />
            <Stack.Screen name="Patient" component={PatientNavigator} />
            {/* <Stack.Screen name="Demo" component={DemoNavigator} /> */}
          </>
        ) : (
          <>
            <Stack.Screen name="Landing" component={Screens.LandingScreen} />
            <Stack.Screen name="Sites" component={Screens.SitesScreen} />
            <Stack.Screen name="Login" component={Screens.LoginScreen} />
          </>
        )}
        {/* @demo remove-block-end */}
        {/** 🔥 Your screens go here */}
        {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
      </Stack.Navigator>
    </UserContext.Provider>
  );
});

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps,
) {
  const colorScheme = useColorScheme();

  useBackButtonHandler(routeName => exitRoutes.includes(routeName));

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      {...props}>
      <AppStack />
    </NavigationContainer>
  );
});
