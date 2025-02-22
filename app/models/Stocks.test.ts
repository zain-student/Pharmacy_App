import { StockModel } from "./Stock"

const data = {
  "MedicineId": 1,
  "MedicineName": "Acetylsalicylic Acid_75mg_Tab",
  "CurruntStock": 0,
  "MedicineTypeName": "TAB",
  "Brand": "Ascard",
  "MedicineUnitName": "        75 mg",
  "DosageFormMedicineUnitName": "        75 mg",
  "BachNumber": "AR067G",
  "MfgDate": null,
  "ExpiryDate": "2025-09-01T00:00:00",
  "UnitPrice": 0.0,
  "EnteredOn": "0001-01-01T00:00:00",
  "AvailableQTY": 233,
  "Code": null
}
const site = StockModel.create(data)

// test("publish date format", () => {
//   expect(episode.datePublished.textLabel).toBe("Jan 20, 2022")
//   expect(episode.datePublished.accessibilityLabel).toBe(
//     'demoPodcastListScreen.accessibility.publishLabel {"date":"Jan 20, 2022"}',
//   )
// })

// test("duration format", () => {
//   expect(episode.duration.textLabel).toBe("42:58")
//   expect(episode.duration.accessibilityLabel).toBe(
//     'demoPodcastListScreen.accessibility.durationLabel {"hours":0,"minutes":42,"seconds":58}',
//   )
// })

