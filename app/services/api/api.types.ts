/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: {
    link: string
    type: string
    length: number
    duration: number
    rating: { scheme: string; value: string }
  }
  categories: string[]
}

export interface ApiFeedResponse {
  status: string
  feed: {
    url: string
    title: string
    link: string
    author: string
    description: string
    image: string
  }
  items: EpisodeItem[]
}

export interface SiteApiFeedResponse {
  data: [SiteItem[]],
  code: number,
  message: string,
  token: string,
  Error: string,
  ErrorList: string
}

export interface SiteItem {
  SiteId: number
  SiteName: string
}

export interface UserApiFeedResponse {
  data: [UserItem[]],
  code: number,
  message: string,
  token: string,
  Error: string,
  ErrorList: string
}

export interface UserItem {
  UserId: number,
  UserName: string,
  UserPassword: string,
  FullName: string,
  RoleId: number
}

export interface OrderApiFeedResponse {
  data: [OrderItem[]],
  code: number,
  message: string,
  token: string,
  Error: string,
  ErrorList: string
}

export interface OrderItem {
  Id: number,
  PatientMedicationId: number,
  MedicineId: number,
  PatientId: number,
  OrderNumber: string,
  RxNumber: string,
  DrugName: string,
  RemainingQTY: number,
  Date: string,
  ProviderName: string,
  DirectionToProivder: string,
  DirectionToPatient: string,
  Quantity: number,
  NoteId: number,
  Issued: boolean,
  UnitPrice: number,
  PatientName: string,
  MRNo: string,
  TokenDate: string,
  EnteredBy: number,
  EnteredByName: string,
  EnteredOn: string,
  UpdatedBy: number,
  UpdatedOn: string,
  QtyInStock: number,
  Alert: boolean
}

export interface StockApiFeedResponse {
  data: [StockItem[]],
  code: number,
  message: string,
  token: string,
  Error: string,
  ErrorList: string
}

export interface StockItem {
  MedicineId: number,
  MedicineName: string,
  CurruntStock: 0,
  MedicineTypeName: string,
  Brand: string,
  MedicineUnitName: string,
  DosageFormMedicineUnitName: string,
  BachNumber: string,
  MfgDate: string,
  ExpiryDate: string,
  UnitPrice: number,
  EnteredOn: string,
  AvailableQTY: number,
  Code: string
}


/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
