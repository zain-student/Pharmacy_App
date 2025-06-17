/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from 'apisauce';
import Config from '../../config';
import {ToastAndroid} from 'react-native';
import {GeneralApiProblem, getGeneralApiProblem} from './apiProblem'; // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse, // @demo remove-current-line
  SiteApiFeedResponse,
  UserApiFeedResponse,
  OrderApiFeedResponse,
  StockApiFeedResponse,
} from './api.types';
import type {EpisodeSnapshotIn} from '../../models/Episode'; // @demo remove-current-line
import type {SiteSnapshotIn} from 'app/models/Site';
import type {UserSnapshotIn} from 'app/models/User';
import type {LoginSnapshotIn} from 'app/models/Login';
import type {OrderSnapshotIn} from 'app/models/Order';
import type {StockSnapshotIn} from 'app/models/Stock';
import { AuthenticationStoreModel } from 'app/models/AuthenticationStore';

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
};

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance;
  config: ApiConfig;

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    });
  }
// setToken(token: string) {
//   this.apisauce.setHeader('Authorization', `Bearer ${token}`);
//   console.log('🔐 Auth header set to:', token); // Optional debug
// }

  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<
    {kind: 'ok'; episodes: EpisodeSnapshotIn[]} | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    );

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data;

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] = rawData.items.map(raw => ({
        ...raw,
      }));

      return {kind: 'ok', episodes};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  /**
   * Gets a list of all available sites.
   */
  async getSites(): Promise<
    {kind: 'ok'; sites: SiteSnapshotIn[]} | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<SiteApiFeedResponse> = await this.apisauce.get(
      `api/genral/GetAllSites`,
    );
    console.log('Site Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data.data[0];
      console.log('Site Api Raw Data....', rawData);

      // This is where we transform the data into the shape we expect for our MST model.

      const sites: SiteSnapshotIn[] = rawData.map(raw => ({
        ...raw,
      }));

      console.log('Site Api Response....2', sites);

      return {kind: 'ok', sites};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  /**
   * Gets a list of receptionist users.
   */
  async getUsers(): Promise<
    {kind: 'ok'; users: UserSnapshotIn[]} | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<UserApiFeedResponse> = await this.apisauce.get(
      `api/Auth/GetAllUsers?UserType=Pharmacy`,
    );
    console.log('User Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data.data[0];
      console.log('User Api Raw Data....', rawData);

      // This is where we transform the data into the shape we expect for our MST model.

      const users: UserSnapshotIn[] = rawData.map(raw => ({
        ...raw,
      }));

      console.log('User Api Response....2', users);

      return {kind: 'ok', users};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  /**
   * Login user from server.
   */
  async loginUser(
    UserName: string,
    UserPassword: string,
  ): Promise<
    {kind: 'ok'; login: LoginSnapshotIn[]; token: string} | GeneralApiProblem
  > {
    // make the api call
    console.log('Login Api Response....', UserName + ', ' + UserPassword);

    const response: ApiResponse<UserApiFeedResponse> = await this.apisauce.post(
      `api/Auth/LoginUser`,
      {
        UserName: UserName,
        UserPassword: UserPassword,
      },
    );
    console.log('Login Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data;
      console.log('Login Api Raw Data....', rawData);

      // This is where we transform the data into the shape we expect for our MST model.

      // const login: LoginSnapshotIn[] = response.data
      const login: LoginSnapshotIn[] = rawData.data.map(raw => ({
        ...raw,
      }));

      console.log('Login Api Response....2', login);

      return {kind: 'ok', login, token: rawData.token};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  /**
   * Gets a list of patient orders.
   */
  async getOrders(patientId): Promise<{kind: 'ok'; orders: OrderSnapshotIn[]} | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<OrderApiFeedResponse> = await this.apisauce.get(
      `api/Patient/GetAllPatientOrdersByPatientId?PatientId=` + patientId,
    );
    console.log('Order Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      // ToastAndroid.show(response.data && response.data.Message ? response.data.Message : 'Server Error', ToastAndroid.SHORT)
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      // const rawData = response.data.data[0];
      const rawData = response?.data?.data?.[0] ?? [];

      console.log('Order Api Raw Data....', rawData);

      // This is where we transform the data into the shape we expect for our MST model.

      const orders: OrderSnapshotIn[] = rawData.map(raw => ({
        ...raw,
      }));

      console.log('Order Api Response....2', orders);

      return {kind: 'ok', orders};
    } catch (e) {
      console.warn('err', e);
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  /**
   * Gets a list Vital Stocks.
   */
  async getStocks(): Promise<
    {kind: 'ok'; stocks: StockSnapshotIn[]} | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<StockApiFeedResponse> = await this.apisauce.get(
      `api/Patient/GetMedicineCurrentStock?StoreId=1`,
    );
    console.log('Stock Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data.data[0];
      console.log('Stock Api Raw Data....', rawData);
console.log('Stock length:', rawData.length);

      // This is where we transform the data into the shape we expect for our MST model.

      const stocks: StockSnapshotIn[] = rawData.map(raw => ({
        ...raw,
      }));

      console.log('Vital Api Response....2', stocks);

      return {kind: 'ok', stocks};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  // @demo remove-block-end
}

// Singleton instance of the API for convenience
export const api = new Api();
