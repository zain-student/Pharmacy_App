import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Stock, StockModel } from "./Stock"
import { api } from "app/services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const StockStoreModel = types
  .model("StockStore")
  .props({
    stocks: types.array(StockModel),
    selectedStock: types.array(types.reference(StockModel)),
    favorites: types.array(types.reference(StockModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
//     async fetchStocks() {
//       // const response = await api.getStocks()
//       const apiStart = Date.now();
// const response = await api.getStocks();
// console.warn('📡 API getStocks time:', Date.now() - apiStart, 'ms');

//       if (response.kind === "ok") {
//         store.setProp("stocks", response.stocks)
//         console.log('response stocks.....', response.stocks)
//         console.log('response store.....', store)
//         console.log('response stores stocks.....', store.stocks)
//       } else {
//         console.tron.error(`Error fetching stocks: ${JSON.stringify(response)}`, [])
//       }
//     },
async fetchStocks(force = false) {
  // ✅ Skip API call if already loaded unless forced
  if (!force && store.stocks.length > 0) {
    console.log('✅ Using cached stocks');
    return;
  }

  const apiStart = Date.now();
  const response = await api.getStocks();
  console.warn('📡 API getStocks time:', Date.now() - apiStart, 'ms');

  if (response.kind === 'ok') {
    store.setProp('stocks', response.stocks);
    console.log('✅ Fetched stocks:', response.stocks.length);
  } else {
    console.tron.error(`❌ Error fetching stocks: ${JSON.stringify(response)}`, []);
  }
},

    selectStock( stock: Stock){
      store.selectedStock.push(stock)
    },
    deselectStock(stock: Stock) {
      store.selectedStock.remove(stock)
    },
    addFavorite(stock: Stock) {
      store.favorites.push(stock)
    },
    removeFavorite(stock: Stock) {
      store.favorites.remove(stock)
    },
  }))
  .views((store) => ({
    get stocksForList() {
      // return store.favoritesOnly ? store.favorites : store.stocks
      console.log('Store Stocks...... in View', store)
      return store.stocks
    },
    // get selectedStock(){
    //   console.log('selected Stock in view...', store.stocks)
    //   return store.selectedStock
    // },
    hasFavorite(stock: Stock) {
      return store.favorites.includes(stock)
    },
    stockSelected(stock: Stock) {
      return store.selectedStock.includes(stock)
    },
    getSelectedStock() {
      return store.selectedStock.length > 0 ? store.selectedStock[0] : null
    },
  }))
  .actions((store) => ({
    toggleFavorite(stock: Stock) {
      if (store.hasFavorite(stock)) {
        store.removeFavorite(stock)
      } else {
        store.addFavorite(stock)
      }
    },
    toggleStock(stock: Stock) {
      if (!store.stockSelected(stock))
        store.selectedStock[0] = stock
    },
  }))

export interface StockStore extends Instance<typeof StockStoreModel> {}
export interface StockStoreSnapshot extends SnapshotOut<typeof StockStoreModel> {}

// @demo remove-file
