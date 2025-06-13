import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {api} from '../services/api';
import {Patient, PatientModel} from './Patient';
import {Service, ServiceModel} from './Service';
import {withSetPropAction} from './helpers/withSetPropAction';
import moment from 'moment';
import { ToastAndroid } from 'react-native';
import {mmkvStorage} from '../navigators/AppNavigator';
const PATIENTS = [
  {
    PatientId: 100032,
    FirstName: 'Akbari Naz',
    LastName: 'Zahid',
    MRNNo: '01-01-0100032',
    DOB: '10/1/1985 12:00:00 AM',
    CNIC: '41406-9577288-8',
    CellPhoneNumber: '03133751890',
    Gender: 'Female',
    SiteName: 'Gharo',
    MartialStatus: 'Married',
    SpouseName: 'Zahid',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Eid Ghah Mohallah',
    EnteredOn: '2023-10-16T16:37:45.11',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'Consultation',
        Charges: '40',
      },
    ],
    Status: 'Pharmacy',

    CheckInTime: moment('2023-04-10').toISOString(),
    VitalsTime: moment('2023-04-10').toISOString(),
    PrescriptionTime: moment('2023-04-10').toISOString(),
    PharmacyTime: null,
    CheckoutTime: null,

    CheckInSynced: false,
    Medications: [
      {
        Id: 214313,
        PatientMedicationId: 214332,
        MedicineId: 81,
        PatientId: 100032,
        OrderNumber: 'PH-23-47463',
        RxNumber: 'RX-23-47464',
        DrugName: 'Hydrocotisone 1%_Cream',
        RemainingQTY: 0,
        Date: '2023-10-16T00:00:00',
        ProviderName: 'Dr Nisar Ahmed',
        DirectionToProivder: '',
        DirectionToPatient:
          ' 1  CREAM  2 times a day  For 3 Days  Starting From 16-Oct-2023 ',
        Quantity: 1,
        NoteId: 93769,
        Issued: true,
        UnitPrice: 50.15,
        PatientName: 'Akbari Naz Zahid',
        MRNo: '01-01-0100032',
        TokenDate: null,
        EnteredBy: 0,
        EnteredByName: 'EnteredBy',
        EnteredOn: '2023-10-16T19:05:48.237',
        UpdatedBy: 0,
        UpdatedOn: '0001-01-01T00:00:00',
        QtyInStock: 0,
        Alert: false,
        Dispatched: false,
        DispatchedQuantity: 0,
      },
      {
        Id: 214314,
        PatientMedicationId: 214333,
        MedicineId: 85,
        PatientId: 100032,
        OrderNumber: 'PH-23-47463',
        RxNumber: 'RX-23-47464',
        DrugName: 'Iron_120ml_Syp',
        RemainingQTY: 0,
        Date: '2023-10-16T00:00:00',
        ProviderName: 'Dr Nisar Ahmed',
        DirectionToProivder: '',
        DirectionToPatient:
          ' 10ml  SYRUP  once daily  For 3 Days  Starting From 16-Oct-2023 ',
        Quantity: 1,
        NoteId: 93769,
        Issued: true,
        UnitPrice: 52.0,
        PatientName: 'Akbari Naz Zahid',
        MRNo: '01-01-0100032',
        TokenDate: null,
        EnteredBy: 0,
        EnteredByName: 'EnteredBy',
        EnteredOn: '2023-10-16T19:06:09.01',
        UpdatedBy: 0,
        UpdatedOn: '0001-01-01T00:00:00',
        QtyInStock: 0,
        Alert: false,
        Dispatched: false,
        DispatchedQuantity: 0,
      },
    ],
  },
  {
    PatientId: 100031,
    FirstName: 'Zahid',
    LastName: 'Shahid',
    MRNNo: '01-01-0100031',
    DOB: '1/1/1980 12:00:00 AM',
    CNIC: '41406-9577288-8',
    CellPhoneNumber: '03133751890',
    Gender: 'Male',
    SiteName: 'Gharo',
    MartialStatus: 'Married',
    SpouseName: 'Shahid',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Eid Ghah Mohallah',
    EnteredOn: '2023-10-16T16:35:43.607',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'Consultation',
        Charges: '40',
      },
    ],
    Status: 'Pharmacy',

    CheckInTime: moment('2023-04-10').toISOString(),
    VitalsTime: moment('2023-04-10').toISOString(),
    PrescriptionTime: moment('2023-04-10').toISOString(),
    PharmacyTime: null,
    CheckoutTime: null,

    CheckInSynced: false,
    Medications: [
      {
        Id: 214317,
        PatientMedicationId: 214336,
        MedicineId: 96,
        PatientId: 100031,
        OrderNumber: 'PH-23-47464',
        RxNumber: 'RX-23-47465',
        DrugName: 'Montelukast_10mg _Tab',
        RemainingQTY: 0,
        Date: '2023-10-16T00:00:00',
        ProviderName: 'Dr Nisar Ahmed',
        DirectionToProivder: '',
        DirectionToPatient:
          ' 1  TABLET  once daily  For 7 Days  Starting From 16-Oct-2023 ',
        Quantity: 7,
        NoteId: 93770,
        Issued: true,
        UnitPrice: 14.0,
        PatientName: 'Zahid Shahid',
        MRNo: '01-01-0100031',
        TokenDate: null,
        EnteredBy: 0,
        EnteredByName: 'EnteredBy',
        EnteredOn: '2023-10-16T19:09:33.483',
        UpdatedBy: 0,
        UpdatedOn: '0001-01-01T00:00:00',
        QtyInStock: 0,
        Alert: false,
        Dispatched: false,
        DispatchedQuantity: 0,
      },
      {
        Id: 214318,
        PatientMedicationId: 214337,
        MedicineId: 122,
        PatientId: 100031,
        OrderNumber: 'PH-23-47464',
        RxNumber: 'RX-23-47465',
        DrugName: 'Salbutamol-Syrup',
        RemainingQTY: 0,
        Date: '2023-10-16T00:00:00',
        ProviderName: 'Dr Nisar Ahmed',
        DirectionToProivder: '',
        DirectionToPatient:
          ' 5ml  SYRUP  3 times a day  For 3 Days  Starting From 16-Oct-2023 ',
        Quantity: 1,
        NoteId: 93770,
        Issued: true,
        UnitPrice: 28.0,
        PatientName: 'Zahid Shahid',
        MRNo: '01-01-0100031',
        TokenDate: null,
        EnteredBy: 0,
        EnteredByName: 'EnteredBy',
        EnteredOn: '2023-10-16T19:09:54.183',
        UpdatedBy: 0,
        UpdatedOn: '0001-01-01T00:00:00',
        QtyInStock: 0,
        Alert: false,
        Dispatched: false,
        DispatchedQuantity: 0,
      },
    ],
  },
];

export const PatientStoreModel = types
  .model('PatientStore')
  .props({
    patients: types.array(PatientModel),
    selectedPatient: types.array(types.reference(PatientModel)),
    patientQueue: types.array(types.reference(PatientModel)),
    // favorites: types.array(types.reference(PatientModel)),
    // favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions(store => ({
    // async
    fetchPatients(site) {
      store.setProp('patients', PATIENTS);
      // store.setProp("patientQueue", PATIENTS)

      // for (let i = 0; i < PATIENTS_SELECTED.length; i++){
      //   this.addPatientInQueue(PATIENTS_SELECTED[i])
      // }

      // const response = await api.getPatients(site)
      // if (response.kind === "ok") {
      //   store.setProp("patients", response.patients)
      //   console.log('response patients.....', response.patients)
      //   console.log('response store.....', store)
      //   console.log('response stores patients.....', store.patients)
      // } else {
      //   console.tron.error(`Error fetching patients: ${JSON.stringify(response)}`, [])
      // }
    },
    addDispatchedMedicines(
      dispatched: boolean,
      dispatchedQuantity: number,
      index: number,
      patientId: number,
      medicineId: number,
    ) {
      for (let i = 0; i < store.patients.length; i++) {
        if (store.patients[i].PatientId == patientId) {
          for (let a = 0; a < store.patients[i].Medications.length; a++) {
            if (store.patients[i].Medications[a].MedicineId == medicineId) {
              store.patients[i].Medications[a].Dispatched = dispatched;
              store.patients[i].Medications[a].DispatchedQuantity =
                dispatchedQuantity;
            }
          }
        }
      }
    },
    addPyarmacyTime(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].PharmacyTime = status;
    },
    addPatientInQueue(patient: Patient) {
      store.patientQueue.push(patient);
    },
    removePatientFromQueue(patient: Patient) {
      store.patientQueue.remove(patient);
    },
    selectPatient(patient: Patient) {
      store.selectedPatient[0] = patient;
    },
    deselectPatient(patient: Patient) {
      store.selectedPatient.remove(patient);
    },
    addFavorite(patient: Patient) {
      store.favorites.push(patient);
    },
    removeFavorite(patient: Patient) {
      store.favorites.remove(patient);
    },
    patientSelected(patient: Patient) {
      return store.selectedPatient.includes(patient);
    },
    getSelectedPatient() {
      return store.selectedPatient;
    },
    addSelectedPatientStatus(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].Status = status;
    },
    addServicesToSelectedPatient(services: Array<Service>) {
      console.log('selected Services list.......', services);
      for (let i = 0; i < services.length; i++) {
        if (store.selectedPatient.length > 0)
          console.log('selected Services list.......1', services[i]);
        console.log('selected Services list.......2', store.selectedPatient[0]);
        console.log(
          'selected Services list.......2',
          store.selectedPatient[0].Services,
        );

        // store.selectedPatient[0].Services = services
        if (!store.selectedPatient[0].Services.includes(services[i])) {
          store.selectedPatient[0].Services.push(services[i]);
          console.log(
            'selected Services list.......3',
            store.selectedPatient[0].Services,
          );
        }
      }
    },
    addCheckedInSynced(checkedInSynced: boolean) {
      if (store.selectedPatient[0])
        store.selectedPatient[0].CheckInSynced = checkedInSynced;
    },
    addNewPatient(patient: Patient) {
      console.log('patient in add new patient....', patient);
      store.patients.push(patient);
    },
    addCheckedOutSynced(index: number, CheckoutTime: any) {
      if (store.patients[index])
        store.patients[index].CheckoutTime = CheckoutTime;
    },
    addAddressToNewPatient(
      address: string,
      country: string,
      province: string,
      city: string,
      index: number,
    ) {
      store.patients[index].Address = address;
      store.patients[index].Country = country;
      store.patients[index].Province = province;
      store.patients[index].City = city;
    },
    selectNewPatient(index: number) {
      console.log('index in select New Patient....', index);
      console.log('index in select New Patient....', store.patients[index]);
      store.selectedPatient[0] = store.patients[index];
    },
    emptySelectedPatient() {
      store.selectedPatient.clear();
    },
    addVitals(vitals: any) {
      console.log('vitals inside mobx....', vitals);
      var array = [];
      array.push(vitals);
      console.log('new array in vitals mobx...', array);
      if (store.selectedPatient[0]) store.selectedPatient[0].Vitals = array;
    },
    addNursingNote(nursingNote: string) {
      if (store.selectedPatient[0])
        store.selectedPatient[0].NursingNote = nursingNote;
    },
    addVitalsTimeTime(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].VitalsTime = status;
    },
  }))
  .views(store => ({
    get patientsForList() {
      // return store.favoritesOnly ? store.favorites : store.patients
      return store.patients;
    },
    patientQueueForList() {
      return store.patientQueue;
    },
    hasFavorite(patient: Patient) {
      return store.favorites.includes(patient);
    },
    selectAPatient(patient: Patient) {
      console.log('patientSelected in store....', store.selectedPatient[0]);
      if (!store.patientSelected(patient)) store.selectPatient(patient);
    },
    latestIndex() {
      return store.patients.length;
    },
  }))
  .actions(store => ({
    toggleFavorite(patient: Patient) {
      if (store.hasFavorite(patient)) {
        store.removeFavorite(patient);
      } else {
        store.addFavorite(patient);
      }
    },
  }))
   .volatile(() => ({
    midnightResetTimer: null as ReturnType<typeof setTimeout> | null,
  }))
  .actions(store => ({

setupMidnightReset() {
  const now = new Date();
  const today = now.toDateString();
  console.log("1");
  
  const lastReset = mmkvStorage.getString('lastPatientReset');

  // if (lastReset !== today) {
  //   console.log('🔁 App opened after midnight — resetting now...');
  //   store.resetPatientsAtMidnight();
  // }
if (lastReset !== today) {
  console.log('🔁 App opened after midnight — resetting now...');
  setTimeout(() => {
    store.resetPatientsAtMidnight(); // ✅ Delayed reset avoids conflicts
  }, 1000); // Delay by 1s
}
const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
const msUntilMidnight = midnight.getTime() - now.getTime();

  // const msUntilMidnight = 30000; // 30 seconds for test
  const resetTime = new Date(Date.now() + msUntilMidnight);
  console.log('⏰ Scheduled patient reset at', resetTime.toLocaleTimeString());

  // ✅ Clear any previous timer
  if (store.midnightResetTimer)
     clearTimeout(store.midnightResetTimer);

  store.midnightResetTimer = setTimeout(() => {
    console.log("🚨 Timeout triggered");
    store.resetPatientsAtMidnight();
    store.setupMidnightReset();
  }, msUntilMidnight);
},


  resetPatientsAtMidnight() {
    console.log('⏱️ Midnight reached — resetting patient queue.');
    store.patientQueue.clear();
    store.selectedPatient.clear();
        // store.patients.clear?.();  // This will remove the patients that are from api 
    // ✅ Save the reset date
    mmkvStorage.set('lastPatientReset', new Date().toDateString());
    ToastAndroid.show('⏱️ Midnight reached — resetting patient queue.',ToastAndroid.LONG);
  }
}));


export interface PatientStore extends Instance<typeof PatientStoreModel> {}
export interface PatientStoreSnapshot
  extends SnapshotOut<typeof PatientStoreModel> {}

// @demo remove-file
