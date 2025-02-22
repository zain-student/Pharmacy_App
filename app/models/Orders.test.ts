import { OrderModel } from "./Order"

const data = {
  "PatientId": 0,
  "PatientOrderId": 0,
  "OrdersInformationId": 0,
  "Date": "2023-10-16T00:00:00",
  "Time": "6:48 PM",
  "Readings": null,
  "Unit": null,
  "Name": null,
  "Description": null,
  "PharmacyName": "Zahid Deen",
  "EnteredOn": "0001-01-01T00:00:00",
  "NursingNoteId": 0
}
const Order = OrderModel.create(data)

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

