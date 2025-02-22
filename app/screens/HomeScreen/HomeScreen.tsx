import {Link, RouteProp, useRoute} from '@react-navigation/native';
import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  Platform,
  SectionList,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
import {DrawerLayout, DrawerState} from 'react-native-gesture-handler';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {Icon, ListItem, Screen, Text, Header} from '../../components';
import {isRTL} from '../../i18n';
import {
  HomeTabParamList,
  HomeTabScreenProps,
} from '../../navigators/HomeNavigator';
import {colors, spacing} from '../../theme';
import {useSafeAreaInsetsStyle} from '../../utils/useSafeAreaInsetsStyle';
// import * as Homes from "./DrawerScreens"
import {DrawerIconButton} from './DrawerIconButton';
import {ProfileIconButton} from './ProfileIconButton';
import {useStores} from '../../models';
import {UserContext} from 'app/utils/UserContext';
import QrCodeScanner from 'app/components/QRCodePopup';

const logo = require('../../../assets/images/logo.png');

const MENU = [
  {
    id: 1,
    name: "Today's Patients",
    data: [],
    icon: 'button_search',
  },
  {
    id: 2,
    name: 'Patient Status',
    data: [],
    icon: 'button_search',
  },
  {
    id: 3,
    name: 'Medication Orders',
    data: [],
    icon: 'button_search',
  },
  {
    id: 4,
    name: 'Dispatch Medicine',
    data: [],
    icon: 'button_search',
  },
  {
    id: 6,
    name: 'Scan QR Code',
    data: [],
    icon: 'button_search',
  },
  {
    id: 5,
    name: 'Signout',
    data: [],
    icon: 'button_search',
  },
];

export interface Home {
  name: string;
  description: string;
  data: ReactElement[];
}

interface HomeListItem {
  item: {name: string; useCases: string[]};
  sectionIndex: number;
  menuPressed?: (sectionIndex: number, itemIndex?: number) => void;
  drawerMenuPressed?: (item) => void;
}

const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const WebListItem: FC<HomeListItem> = ({item, sectionIndex}) => {
  const sectionSlug = item.name.toLowerCase();
  return (
    <View>
      <Link to={`/showroom/${sectionSlug}`} style={$menuContainer}>
        <Text preset="bold">{item.name}</Text>
      </Link>
      {item.useCases.map(u => {
        const itemSlug = slugify(u);

        return (
          <Link
            key={`section${sectionIndex}-${u}`}
            to={`/showroom/${sectionSlug}/${itemSlug}`}>
            <Text>{u}</Text>
          </Link>
        );
      })}
    </View>
  );
};

const NativeListItem: FC<HomeListItem> = ({
  item,
  sectionIndex,
  menuPressed,
}) => {
  // console.log('item............', item)
  return (
    <View>
      <Text
        onPress={() => menuPressed(sectionIndex)}
        preset="bold"
        style={$menuContainer}>
        {item.name}
      </Text>
      {item.useCases.map((u, index) => (
        <ListItem
          key={`section${sectionIndex}-${u}`}
          onPress={() => menuPressed(sectionIndex, index + 1)}
          text={u}
          rightIcon={isRTL ? 'caretLeft' : 'caretRight'}
        />
      ))}
    </View>
  );
};

const MenuButtonListItem: FC<HomeListItem> = ({
  item,
  sectionIndex,
  menuPressed,
  drawerMenuPressed,
}) => {
  if (item.name !== 'Signout') {
    return (
      <TouchableOpacity
        onPress={() => drawerMenuPressed(item)}
        style={$menuButtonContainer}>
        <Icon
          icon={
            item.name == 'Medication Orders'
              ? 'button_vitals_history'
              : item.name == 'Dispatch Medicine'
              ? 'button_add'
              : item.name == "Today's Patients"
              ? 'button_queue'
              : item.name == 'Patient Status'
              ? 'button_status'
              : 'button_logout'
          }
          // color={focused && colors.tint}
          size={90}
        />
        <Text
          numberOfLines={2}
          style={{fontSize: 10}}
          // onPress={() => menuPressed(sectionIndex)}
          onPress={() => drawerMenuPressed(item)}
          preset="bold">
          {item.name}
        </Text>
        {item.useCases.map((u, index) => (
          <ListItem
            key={`section${sectionIndex}-${u}`}
            onPress={() => menuPressed(sectionIndex, index + 1)}
            text={u}
            rightIcon={isRTL ? 'caretLeft' : 'caretRight'}
          />
        ))}
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};
const ShowroomListItem = Platform.select({
  web: WebListItem,
  default: NativeListItem,
});

export const HomeScreen: FC<HomeTabScreenProps<'Home'>> = function HomeScreen(
  _props,
) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const drawerRef = useRef<DrawerLayout>();
  const listRef = useRef<SectionList>();
  const menuRef = useRef<FlatList>();
  const progress = useSharedValue(0);
  const route = useRoute<RouteProp<HomeTabParamList, 'Home'>>();
  const params = route.params;
  const userContext = useContext(UserContext);
  // const { pickerStore} = useStores()
  const [isLoading, setIsLoading] = React.useState(false);
  const {siteStore, patientStore, vitalStore} = useStores();
  const [showQrCodeScanner, setshowQrCodeScanner] = React.useState(false);

  const {
    authenticationStore: {logout, appIsOnline},
    // patientStore,
    //  serviceStore
    stockStore,
  } = useStores();

  useEffect(() => {
    // if(appIsOnline() == '1'){
    (async function load() {
      //   // setIsLoading(true)
      //   // await pickerStore.fetchPickers()
      //   // await serviceStore.fetchServices()
      if (patientStore.latestIndex() == 0) {
        await patientStore.fetchPatients(siteStore.getSelectedSite());
      }
      //   setIsLoading(false);
    })();
    // testData();

    // }
    getStocks();
  }, []);

  // const testData = () => {
  //   try {
  //     let receivedData = {
  //       Address: 'koohi goth',
  //       AddressLine1: null,
  //       AddressLine2: null,
  //       Biometric: null,
  //       CNIC: '42501-2274864-9',
  //       CNICRelationId: 0,
  //       CellPhone: null,
  //       CellPhoneNumber: '00000000000',
  //       City: 'Karachi',
  //       CityId: null,
  //       Country: 'Pakistan',
  //       DOB: '11/22/2002 12:00:00 AM',
  //       EnteredBy: 0,
  //       EnteredOn: '2024-06-01T14:41:05.19',
  //       FirstName: 'Sehrish',
  //       Gender: 'Female',
  //       HomePhone: null,
  //       IsVaccination: false,
  //       IsZakatEligible: false,
  //       LastName: 'Aqib  Javeed',
  //       Latitude: null,
  //       Longitude: null,
  //       MRNNo: '01-02-0126152',
  //       MaritalStatusId: null,
  //       MartialStatus: 'Married',
  //       MiddleName: null,
  //       MobileNumber1: null,
  //       OrganizationCod: null,
  //       PatientId: 126152,
  //       PatientImage: null,
  //       PatientName: null,
  //       PatientSpouseName: null,
  //       PrefferedLanguageId: null,
  //       Province: 'Sindh',
  //       ProvinceId: null,
  //       RaceId: null,
  //       RelationId: 0,
  //       ReligionId: null,
  //       SiteCod: null,
  //       SiteId: null,
  //       SiteName: 'KGH',
  //       SpouseName: 'Aqib  Javeed',
  //       UpdatedBy: 0,
  //       UpdatedOn: '0001-01-01T00:00:00',
  //       VaccinationBy: null,
  //       VaccinationOn: null,
  //       VillageName: null,
  //       WorkPhone: null,
  //       WorkPhoneExt: null,
  //       ZakatEligible: true,
  //       ZakatEligibleOn: null,
  //       medication: [
  //         {
  //           Alert: false,
  //           Date: '2024-06-01T00:00:00',
  //           DirectionToPatient:
  //             ' 1  TABLET  2 times a day  For 3 Days  Starting From 01-Jun-2024 ',
  //           DirectionToProivder: '',
  //           DrugName: 'Diclofanac Sodium_50mg_Tab',
  //           EnteredBy: 0,
  //           EnteredByName: 'EnteredBy',
  //           EnteredOn: '2024-06-01T15:04:56.75',
  //           Id: 364980,
  //           Issued: false,
  //           MRNo: '01-02-0126152',
  //           MedicineId: 52,
  //           NoteId: 144111,
  //           OrderNumber: 'PH-24-85943',
  //           PatientId: 126152,
  //           PatientMedicationId: 365095,
  //           PatientName: 'Sehrish Aqib  Javeed',
  //           ProviderName: 'Dr. Pir Haji  Shah',
  //           QtyInStock: 0,
  //           Quantity: 6,
  //           RemainingQTY: 0,
  //           RxNumber: 'RX-24-85944',
  //           TokenDate: null,
  //           UnitPrice: 2,
  //           UpdatedBy: 0,
  //           UpdatedOn: '0001-01-01T00:00:00',
  //         },
  //         {
  //           Alert: false,
  //           Date: '2024-06-01T00:00:00',
  //           DirectionToPatient:
  //             ' 1  TABLET  2 times a day  For 3 Days  Starting From 01-Jun-2024 ',
  //           DirectionToProivder: '',
  //           DrugName: 'Folic Acid 5mg Tab',
  //           EnteredBy: 0,
  //           EnteredByName: 'EnteredBy',
  //           EnteredOn: '2024-06-01T15:05:13.047',
  //           Id: 364981,
  //           Issued: false,
  //           MRNo: '01-02-0126152',
  //           MedicineId: 71,
  //           NoteId: 144111,
  //           OrderNumber: 'PH-24-85943',
  //           PatientId: 126152,
  //           PatientMedicationId: 365096,
  //           PatientName: 'Sehrish Aqib  Javeed',
  //           ProviderName: 'Dr. Pir Haji  Shah',
  //           QtyInStock: 0,
  //           Quantity: 6,
  //           RemainingQTY: 0,
  //           RxNumber: 'RX-24-85944',
  //           TokenDate: null,
  //           UnitPrice: 0.6,
  //           UpdatedBy: 0,
  //           UpdatedOn: '0001-01-01T00:00:00',
  //         },
  //         {
  //           Alert: false,
  //           Date: '2024-06-01T00:00:00',
  //           DirectionToPatient:
  //             ' 1  TABLET  2 times a day  For 3 Days  Starting From 01-Jun-2024 ',
  //           DirectionToProivder: '',
  //           DrugName: 'Ossein Mineral Complex + Vit-D Tab',
  //           EnteredBy: 0,
  //           EnteredByName: 'EnteredBy',
  //           EnteredOn: '2024-06-01T15:05:46.617',
  //           Id: 364982,
  //           Issued: false,
  //           MRNo: '01-02-0126152',
  //           MedicineId: 106,
  //           NoteId: 144111,
  //           OrderNumber: 'PH-24-85943',
  //           PatientId: 126152,
  //           PatientMedicationId: 365097,
  //           PatientName: 'Sehrish Aqib  Javeed',
  //           ProviderName: 'Dr. Pir Haji  Shah',
  //           QtyInStock: 0,
  //           Quantity: 6,
  //           RemainingQTY: 0,
  //           RxNumber: 'RX-24-85944',
  //           TokenDate: null,
  //           UnitPrice: 10,
  //           UpdatedBy: 0,
  //           UpdatedOn: '0001-01-01T00:00:00',
  //         },
  //         {
  //           Alert: false,
  //           Date: '2024-06-01T00:00:00',
  //           DirectionToPatient:
  //             ' 1  Sachet  once daily  For 3 Days  Starting From 01-Jun-2024 ',
  //           DirectionToProivder: '',
  //           DrugName: 'Calcium + Vitamin C_Sachet',
  //           EnteredBy: 0,
  //           EnteredByName: 'EnteredBy',
  //           EnteredOn: '2024-06-01T15:06:16.163',
  //           Id: 364985,
  //           Issued: false,
  //           MRNo: '01-02-0126152',
  //           MedicineId: 23,
  //           NoteId: 144111,
  //           OrderNumber: 'PH-24-85943',
  //           PatientId: 126152,
  //           PatientMedicationId: 365100,
  //           PatientName: 'Sehrish Aqib  Javeed',
  //           ProviderName: 'Dr. Pir Haji  Shah',
  //           QtyInStock: 0,
  //           Quantity: 3,
  //           RemainingQTY: 0,
  //           RxNumber: 'RX-24-85945',
  //           TokenDate: null,
  //           UnitPrice: 9.5,
  //           UpdatedBy: 0,
  //           UpdatedOn: '0001-01-01T00:00:00',
  //         },
  //         {
  //           Alert: false,
  //           Date: '2021-12-29T00:00:00',
  //           DirectionToPatient: 'ddd',
  //           DirectionToProivder: 'ddddddd',
  //           DrugName: 'Fusidic cream',
  //           EnteredBy: 0,
  //           EnteredByName: 'Ali',
  //           EnteredOn: '2024-06-02T11:46:02.580Z',
  //           Id: 72,
  //           Issued: true,
  //           MRNo: '01-01-000006',
  //           MedicineId: 255,
  //           NoteId: 0,
  //           OrderNumber: 'PH-21-000068',
  //           PatientId: 6,
  //           PatientMedicationId: 78,
  //           PatientName: 'Test-1 Test-1',
  //           ProviderName: 'Noureen anjum',
  //           QtyInStock: 0,
  //           Quantity: 1,
  //           RemainingQTY: 0,
  //           RxNumber: 'RX-000068',
  //           TokenDate: null,
  //           UnitPrice: 22.8,
  //           UpdatedBy: 0,
  //           UpdatedOn: '2024-06-02T11:46:02.582Z',
  //           comments: 'cmc',
  //           dosageForm: 'SYRUP',
  //           dose: 1,
  //           endDate: 'Mon Jun 03 2024',
  //           frequency: '1 – 2 times a day',
  //           route: 'Non – illicit',
  //           startDate: 'Sat Jun 01 2024',
  //         },
  //       ],
  //     };
  //     let item = patientStore.patientsForList.find(
  //       patient => patient.PatientId === receivedData.PatientId,
  //     );
  //     console.warn('first', item);
  //     if (item) {
  //     } else {
  //       let servicesList: any = [];
  //       // receivedData.Services.forEach(item => {
  //       //   if (typeof item === 'object') {
  //       //     servicesList.push(item);
  //       //   }
  //       // });
  //       receivedData.Medications = receivedData.medication;
  //       console.warn('receivedData.Medications', receivedData.Medications);

  //       patientStore.addNewPatient(receivedData);
  //     }
  //   } catch (e) {}
  // };

  // handle Web links
  React.useEffect(() => {
    if (route.params) {
      const homeValues = Object.values(Homes);
      const findSectionIndex = homeValues.findIndex(
        x => x.name.toLowerCase() === params.queryIndex,
      );
      let findItemIndex = 0;
      if (params.itemIndex) {
        try {
          findItemIndex =
            homeValues[findSectionIndex].data.findIndex(
              u => slugify(u.props.name) === params.itemIndex,
            ) + 1;
        } catch (err) {
          console.error(err);
        }
      }
      menuPressed(findSectionIndex, findItemIndex);
    }
  }, [route]);

  const getStocks = async () => {
    try {
      setIsLoading(true);
      await stockStore.fetchStocks();
      setIsLoading(false);
    } catch (e) {
      // ToastAndroid.show('Unable to fetch data', ToastAndroid.LONG);
      setIsLoading(false);
    }
  };

  const toggleDrawer = () => {
    if (!open) {
      setOpen(true);
      drawerRef.current?.openDrawer({speed: 2});
    } else {
      setOpen(false);
      drawerRef.current?.closeDrawer({speed: 2});
    }
  };

  const menuPressed = (sectionIndex: number, itemIndex) => {
    console.log('item.........in press button', itemIndex);
    console.log('item.........in press button', MENU[sectionIndex]);
    const item = MENU[sectionIndex];
    if (item.name == 'Signout') {
      logout();
      _props.navigation.navigate('Landing');
    } else if (item.name == "Today's Patients") {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Patient Status') {
      _props.navigation.navigate('PatientStatus');
    } else if (item.name == 'Medication Orders') {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Dispatch Medicine') {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Scan QR Code') {
      onShowQrCodeScanner();
      // _props.navigation.navigate('TodaysPatients');
    }
    if (open) toggleDrawer();
  };

  const onShowQrCodeScanner = async () => {
    let granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === 'granted') {
      setshowQrCodeScanner(true);
    } else {
      ToastAndroid.show(
        'Please grant permission to access camera',
        ToastAndroid.LONG,
      );
    }
  };

  const drawerMenuPressed = item => {
    console.log('item.drawer menu........in press button', item);
    // _props.navigation.navigate('Patient')
    if (item.name == 'Signout') {
      logout();
      _props.navigation.navigate('Landing');
    } else if (item.name == "Today's Patients") {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Patient Status') {
      _props.navigation.navigate('PatientStatus');
    } else if (item.name == 'Medication Orders') {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Dispatch Medicine') {
      _props.navigation.navigate('TodaysPatients');
    }
    if (open) toggleDrawer();
  };

  const onQrRead = (e: BarCodeReadEvent) => {
    let ip = e.data;
    global.ip = ip;
    userContext.startConnectionDiscovery();
    console.warn('qr data', e);
    setshowQrCodeScanner(false);
  };

  const onHideQrCodeScanner = async () => {
    setshowQrCodeScanner(false);
  };

  const listItemPressed = item => {
    console.log('item.........in press button', item);
    _props.navigation.navigate(item.key);
    toggleDrawer();
  };
  const scrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    listRef.current?.getScrollResponder()?.scrollToEnd();
    timeout.current = setTimeout(
      () =>
        listRef.current?.scrollToLocation({
          animated: true,
          itemIndex: info.index,
          sectionIndex: 0,
        }),
      50,
    );
  };

  useEffect(() => {
    return () => timeout.current && clearTimeout(timeout.current);
  }, []);

  const $drawerInsets = useSafeAreaInsetsStyle(['top']);
  const profilePress = () => {
    // console.log('Profile pressed.......')
  };

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={Platform.select({
        default: 326,
        web: Dimensions.get('window').width * 0.3,
      })}
      drawerType={'slide'}
      drawerPosition={isRTL ? 'right' : 'left'}
      overlayColor={open ? colors.palette.overlay20 : 'transparent'}
      onDrawerSlide={drawerProgress => {
        progress.value = open ? 1 - drawerProgress : drawerProgress;
      }}
      onDrawerStateChanged={(
        newState: DrawerState,
        drawerWillShow: boolean,
      ) => {
        if (newState === 'Settling') {
          progress.value = withTiming(drawerWillShow ? 1 : 0, {
            duration: 250,
          });
          setOpen(drawerWillShow);
        }
      }}
      renderNavigationView={() => (
        <View style={[$drawer, $drawerInsets]}>
          <View style={$logoContainer}>
            <Image source={logo} style={$logoImage} />
          </View>
          <FlatList<{name: string; useCases: string[]}>
            ref={menuRef}
            contentContainerStyle={$flatListContentContainer}
            // data={Object.values(Homes).map((d) => ({
            //   name: d.name,
            //   useCases: d.data.map((u) => u.props.name),
            // }))}
            data={MENU.map(d => ({
              name: d.name,
              useCases: d.data.map(u => u.props.name),
            }))}
            keyExtractor={item => item.name}
            renderItem={({item, index: sectionIndex}) => (
              <ShowroomListItem {...{item, sectionIndex, menuPressed}} />
            )}
          />
        </View>
      )}>
      <QrCodeScanner
        showQrCodeScanner={showQrCodeScanner}
        onHideQrCodeScanner={onHideQrCodeScanner}
        onSuccess={onQrRead}
      />
      <Header
        LeftActionComponent={
          <DrawerIconButton onPress={toggleDrawer} {...{open, progress}} />
        }
        isHome={true}
        RightActionComponent={<ProfileIconButton onPress={profilePress} />}
      />
      <Screen
        preset="fixed"
        //  safeAreaEdges={["top"]}
        contentContainerStyle={$screenContainer}>
        <Text
          style={{
            paddingHorizontal: '5%',
            color: userContext.clientSocket ? '#0CABF0' : 'black',
          }}>
          {userContext.clientSocket ? 'Connected' : 'Not Connected'}
        </Text>
        <TouchableOpacity onPress={() => userContext.resetConnection()}>
          <Text
            style={{
              paddingHorizontal: '5%',
              color: 'red',
              fontSize: 12,
              alignSelf: 'flex-end',
            }}>
            Reset Connection
          </Text>
        </TouchableOpacity>
        {/* <DrawerIconButton onPress={toggleDrawer} {...{ open, progress }} /> */}
        <FlatList<{name: string; useCases: string[]}>
          ref={menuRef}
          contentContainerStyle={$flatListContentContainer}
          // data={Object.values(Homes).map((d) => ({
          //   name: d.name,
          //   useCases: d.data.map((u) => u.props.name),
          // }))}
          numColumns={2}
          data={MENU.map(d => ({
            name: d.name,
            useCases: d.data.map(u => u.props.name),
          }))}
          keyExtractor={item => item.name}
          renderItem={({item, index: sectionIndex}) => (
            <>
              {item.name !== 'Scan QR Code' && (
                <MenuButtonListItem
                  {...{item, sectionIndex, menuPressed, drawerMenuPressed}}
                />
              )}
            </>
          )}
        />
        {/* <SectionList
            ref={listRef}
            contentContainerStyle={$sectionListContentContainer}
            stickySectionHeadersEnabled={false}
            sections={Object.values(Homes)}
            renderItem={({ item }) => item}
            renderSectionFooter={() => <View style={$homeUseCasesSpacer} />}
            ListHeaderComponent={
              <View style={$heading}>
                <Text preset="heading" tx="HomeScreen.jumpStart" />
              </View>
            }
            onScrollToIndexFailed={scrollToIndexFailed}
            renderSectionHeader={({ section }) => {
              return (
                <View>
                  <Text preset="heading" style={$homeItemName}>
                    {section.name}
                  </Text>
                  <Text style={$homeItemDescription}>{section.description}</Text>
                </View>
              )
            }}
          /> */}
      </Screen>
    </DrawerLayout>
  );
};

const $screenContainer: ViewStyle = {
  flex: 1,
};

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
};

const $sectionListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
};

const $heading: ViewStyle = {
  marginBottom: spacing.xxxl,
};

const $logoImage: ImageStyle = {
  height: 42,
  width: 177,
};

const $logoContainer: ViewStyle = {
  alignSelf: 'flex-start',
  justifyContent: 'center',
  height: 56,
  paddingHorizontal: spacing.lg,
};

const $menuContainer: ViewStyle = {
  paddingBottom: spacing.xs,
  paddingTop: spacing.lg,
};

const $menuButtonContainer: ViewStyle = {
  flex: 1,
  margin: spacing.md,
  borderRadius: 5,
  elevation: 8,
  backgroundColor: colors.background,
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.lg,
  width: '40%',
  minHeight: 150,
};

const $homeItemName: TextStyle = {
  fontSize: 24,
  marginBottom: spacing.md,
};

const $homeItemDescription: TextStyle = {
  marginBottom: spacing.xxl,
};

const $homeUseCasesSpacer: ViewStyle = {
  paddingBottom: spacing.xxl,
};

// @home remove-file
