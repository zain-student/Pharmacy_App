import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { translate } from "../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  "MedicineId": number,
  "MedicineName": string,
  "CurruntStock": number,
  "MedicineTypeName": string,
  "Brand": string,
  "MedicineUnitName": string,
  "DosageFormMedicineUnitName": string,
  "BachNumber": string,
  "MfgDate": string,
  "ExpiryDate": string,
  "UnitPrice": number,
  "EnteredOn": string,
  "AvailableQTY": number,
  "Code": string
}
/**
 * This represents an episode of React Native Radio.
 */
export const StockModel = types
  .model("Stock")
  .props({
    MedicineId: types.identifierNumber,
    MedicineName: types.string,
    CurruntStock: types.number,
    MedicineTypeName: types.string,
    Brand: types.string,
    MedicineUnitName: types.string,
    DosageFormMedicineUnitName: types.string,
    BachNumber: types.string,
    MfgDate: types.maybeNull(types.string),
    ExpiryDate: types.string,
    UnitPrice: types.number,
    EnteredOn: types.string,
    AvailableQTY: types.number,
    Code: types.maybeNull(types.string)
  })
  .actions(withSetPropAction)
  .views((stock) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in StockModel', stock)
      const defaultValue = { title: stock.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Stock extends Instance<typeof StockModel> {}
export interface StockSnapshotOut extends SnapshotOut<typeof StockModel> {}
export interface StockSnapshotIn extends SnapshotIn<typeof StockModel> {}

// @demo remove-file
