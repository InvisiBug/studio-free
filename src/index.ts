import axios from "axios";
import { getFreeTimesSchedule, displayTimeline, getFreeTimes } from "./utils";
import { Gym, ActivitiesEntity } from "./types";

axios.get("https://businessgateway.puregym.com/api/bookings/v1/timetable/75/scheduled-class").then((resp) => {
  const { data }: { data: Gym } = resp;

  const numDays = 3;

  let busySchedule: Schedule[][] = [];
  let freeSchedule: Schedule[][] = [];

  interface Schedule {
    start: string;
    end: string;
    duration?: number;
  }

  const array = [
    { time: "00:00", today: " ", tomorrow: "x" },
    { time: "00:15", today: "X", tomorrow: "" },
  ];

  // const string = "Times \t Today \t Tomorrow\n";
  // console.log(string);

  //* Create an array of times the studio is in use over the next 3 days
  Array.from({ length: 3 }).forEach((element: any, dayIndex: number) => {
    let todaysSchedule = new Array<Schedule>();

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
    busySchedule.push(todaysSchedule);
  });

  //* Create an array of times the studio is free over the next 3 days
  Array.from({ length: 3 }).forEach((element: any, dayIndex: number) => {
    let dailySchedule = new Array<any>();

    freeSchedule.push(getFreeTimes(busySchedule[dayIndex]));
  });

  // console.log(freeSchedule);

  // let finalSchedule = new Array((24 * 60) / 15).fill(" ");
  let finalSchedule = new Array<any>();

  // console.log(finalSchedule);

  Array.from({ length: 3 }).forEach((element: any, dayIndex: number) => {
    let dailySchedule = new Array<any>();

    // freeSchedule.push(getFreeTimes(busySchedule[dayIndex]));
    finalSchedule.push(displayTimeline(busySchedule[dayIndex]));
  });

  // console.log(finalSchedule);

  // let timelineStr = finalSchedule
  //   .map((mark, quarter, index) => {
  //     // console.log(mark);
  //     let hour = Math.floor(quarter / 4);
  //     let minute = (quarter % 4) * 15;
  //     let timeStr = String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
  //     return `${timeStr}: ${mark}`;
  //   })
  //   .join("\n");

  console.log(`Time: \t\tToday\t\tTomorrow\t\tNextDay`);
  Array.from({ length: 24 * 4 }).forEach((element: any, dayIndex: number) => {
    let hour = Math.floor(dayIndex / 4);
    let minute = (dayIndex % 4) * 15;
    let timeStr = String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");

    console.log(`${timeStr}: \t\t${finalSchedule[0][dayIndex]}\t\t${finalSchedule[1][dayIndex]}\t\t${finalSchedule[2][dayIndex]}`);
    // console.log("-------------------------");
  });

  // console.log(timelineStr);

  // console.log(finalSchedule[0]);

  // console.log("Studio is in use during the following hours today:");
  // today.forEach((element) => {
  //   console.log(`${element.start} - ${element.end} `);
  // });
  // console.log("\n");

  // let freeTimesToday = getFreeTimes(schedule[0]);
  // console.log("Studio is free during the following hours today:");
  // freeTimesToday.forEach((element) => {
  //   console.log(`${element.start} - ${element.end}`);
  // });

  // console.log("\n");

  // // Usage
  // displayTimeline(schedule[0]);

  // let freeTimesToday = getFreeTimesSchedule(today);
  // console.log("Studio is free during the following hours today:");
  // freeTimesToday.forEach((element) => {
  //   console.log(`${element.start} - ${element.end}`);
  // });
});
