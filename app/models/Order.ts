import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"
// import { types } from "@babel/core"

interface Enclosure {
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
  Alert: boolean,
  Dispatched: boolean,
  DispatchedQuantity: number
}

/**
 * This represents an episode of React Native Radio.
 */
export const OrderModel = types
  .model("Order")
  .props({
      Id: types.identifierNumber,
      PatientMedicationId: types.number,
      MedicineId: types.number,
      PatientId: types.number,
      OrderNumber: types.string,
      RxNumber: types.string,
      DrugName: types.string,
      RemainingQTY: types.number,
      Date: types.string,
      ProviderName: types.string,
      DirectionToProivder: types.string,
      DirectionToPatient: types.string,
      Quantity: types.number,
      NoteId: types.number,
      Issued: types.boolean,
      UnitPrice: types.number,
      PatientName: types.string,
      MRNo: types.string,
      TokenDate: types.maybeNull(types.string),
      EnteredBy: types.number,
      EnteredByName: types.string,
      EnteredOn: types.string,
      UpdatedBy: types.number,
      UpdatedOn: types.string,
      QtyInStock: types.number,
      Alert: types.boolean,
      Dispatched: types.maybeNull(types.boolean),
      DispatchedQuantity: types.maybeNull(types.number)
  })
  .actions(withSetPropAction)
  .views((Order) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in OrderModel', Order)
      const defaultValue = { title: Order.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Order extends Instance<typeof OrderModel> {}
export interface OrderSnapshotOut extends SnapshotOut<typeof OrderModel> {}
export interface OrderSnapshotIn extends SnapshotIn<typeof OrderModel> {}

// @demo remove-file
