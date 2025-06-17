import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {Order, OrderModel} from './Order';
import {api} from 'app/services/api';
import {withSetPropAction} from './helpers/withSetPropAction';
import {ToastAndroid} from 'react-native';

export const OrderStoreModel = types
  .model('OrderStore')
  .props({
    orders: types.array(OrderModel),
    selectedOrder: types.array(types.reference(OrderModel)),
    favorites: types.array(types.reference(OrderModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetchOrders(patientId: number) {
      // console.log('Token in use:', authStore.token);
console.warn('🔍 patientId type:', typeof patientId, '| value:', patientId);
console.warn('🔍 Number(patientId):', Number(patientId));
ToastAndroid.show(`Type: ${typeof patientId}, Value: ${patientId}`, ToastAndroid.LONG);
ToastAndroid.show(`Number(patientId): ${Number(patientId)}`, ToastAndroid.LONG);

      const response = await api.getOrders(Number(patientId));
      // if (response.kind === "ok") {
      console.warn('response');
      if (response.kind === 'ok') {
        store.setProp('orders', response.orders);
        console.log('response orders.....', response.orders);
        console.log('response store.....', store);
        console.log('response stores orders.....', store.orders);
      } else if (response.kind === 'unauthorized') {
        console.log('-=-=-=-=-=-=-=-=data', response);
        ToastAndroid.show('Authorization Failed! Please Login again', ToastAndroid.SHORT);
      } else {
        console.log('-=-=-=-=-=-=-=-=data', response);
        console.tron.error(
          `Error fetching orders: ${JSON.stringify(response)}`,
          [],
        );
      }
    },
    selectOrder(order: Order) {
      store.selectedOrder.push(order);
    },
    deselectOrder(order: Order) {
      store.selectedOrder.remove(order);
    },
    addFavorite(order: Order) {
      store.favorites.push(order);
    },
    removeFavorite(order: Order) {
      store.favorites.remove(order);
    },
  }))
  .views(store => ({
    get ordersForList() {
      // return store.favoritesOnly ? store.favorites : store.orders
      console.log('Store Orders...... in View', store);
      ToastAndroid.show('Store Orders...... in View',ToastAndroid.SHORT)
      return store.orders;
    },
    // get selectedOrder(){
    //   console.log('selected Order in view...', store.orders)
    //   return store.selectedOrder
    // },
    hasFavorite(order: Order) {
      return store.favorites.includes(order);
    },
    orderSelected(order: Order) {
      return store.selectedOrder.includes(order);
    },
    getSelectedOrder() {
      return store.selectedOrder.length > 0 ? store.selectedOrder[0] : null;
    },
  }))
  .actions(store => ({
    toggleFavorite(order: Order) {
      if (store.hasFavorite(order)) {
        store.removeFavorite(order);
      } else {
        store.addFavorite(order);
      }
    },
    toggleOrder(order: Order) {
      if (!store.orderSelected(order)) store.selectedOrder[0] = order;
    },
  }));

export interface OrderStore extends Instance<typeof OrderStoreModel> {}
export interface OrderStoreSnapshot
  extends SnapshotOut<typeof OrderStoreModel> {}

// @demo remove-file
