import axios from "axios";
import { getFreeTimesSchedule, displayTimeline, getFreeTimes } from "./utils";
import { Gym, ActivitiesEntity } from "./types";

axios.get("https://businessgateway.puregym.com/api/bookings/v1/timetable/75/scheduled-class").then((resp) => {
  const { data } = resp;

  // let studioInUseArray: [{ time: string; duration: number }] = [];
  let studioInUseArray: any[] = [];
  let studioInUseToday: any[] = [];

  let freeTimes: any[] = [];
  const numDays = 3;

  let today: any[] = [];
  let tomorrow: any[] = [];

  let schedule: any[][] = [];

  //* need to limit the response to the current day period

  Array.from({ length: 3 }).forEach((element: any, dayIndex: number) => {
    let todaysSchedule = new Array();
    data.activities.forEach((element: ActivitiesEntity) => {
      if (element.studio === "Studio") {
        // const now = new Date();
        // const now = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

        const d = new Date();

        const now = new Date(d.setDate(d.getDate() + dayIndex));
        const date = new Date(Date.parse(element.startDateTime.dateTime));

        // Get only the events for the day
        if (now.setHours(0, 0, 0, 0) == date.setHours(0, 0, 0, 0)) {
          const startHours = String(new Date(element.startDateTime.dateTime).getHours()).padStart(2, "0");
          const startMinutes = String(new Date(element.startDateTime.dateTime).getMinutes()).padStart(2, "0");

          const endHours = String(new Date(Date.parse(element.startDateTime.dateTime) + element.duration * 60000).getHours()).padStart(2, "0");
          const endMinutes = String(new Date(Date.parse(element.startDateTime.dateTime) + element.duration * 60000).getMinutes()).padStart(2, "0");

          todaysSchedule.push({
            start: `${startHours}:${startMinutes}`,
            end: `${endHours}:${endMinutes}`,
            duration: element.duration,
          });
        }
      }
    });
    schedule.push(todaysSchedule);
  });

  console.table(schedule);

  // console.log("Studio is in use during the following hours today:");
  // today.forEach((element) => {
  //   console.log(`${element.start} - ${element.end} `);
  // });
  // console.log("\n");

  let freeTimesToday = getFreeTimes(schedule[0]);
  console.log("Studio is free during the following hours today:");
  freeTimesToday.forEach((element) => {
    console.log(`${element.start} - ${element.end}`);
  });

  // console.log("\n");

  // // Usage
  displayTimeline(schedule[0]);

  // let freeTimesToday = getFreeTimesSchedule(today);
  // console.log("Studio is free during the following hours today:");
  // freeTimesToday.forEach((element) => {
  //   console.log(`${element.start} - ${element.end}`);
  // });
});
