import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore" // @demo remove-current-line
import { EpisodeStoreModel } from "./EpisodeStore" // @demo remove-current-line
import { SiteStoreModel } from "./SiteStore" 
import { UserStoreModel } from "./UserStore"
import { PatientStoreModel } from "./PatientStore"
import { OrderStoreModel } from "./OrderStore"
import { StockStoreModel } from "./StockStore"


/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}), // @demo remove-current-line
  episodeStore: types.optional(EpisodeStoreModel, {}), // @demo remove-current-line
  siteStore: types.optional(SiteStoreModel, {}), 
  userStore: types.optional(UserStoreModel, {}),
  patientStore: types.optional(PatientStoreModel, {}),
  orderStore: types.optional(OrderStoreModel, {}),
  stockStore: types.optional(StockStoreModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
