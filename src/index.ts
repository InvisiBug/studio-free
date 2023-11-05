import axios from "axios";

axios.get("https://businessgateway.puregym.com/api/bookings/v1/timetable/75/scheduled-class").then((resp) => {
  const { data } = resp;

  // let studioInUseArray: [{ time: string; duration: number }] = [];
  let studioInUseArray: any[] = [];
  let studioInUseToday: any[] = [];

  let freeTimes: any[] = [];

  //* need to limit the response to the current day period

  data.activities.forEach((element: any, index: number) => {
    if (element.studio === "Studio") {
      // const now2 = new Date();
      const now2 = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      const date2 = new Date(Date.parse(element.startDateTime.dateTime));

      if (now2.setHours(0, 0, 0, 0) == date2.setHours(0, 0, 0, 0)) {
        //* This event is today
        // Date equals today's date
        console.log("today");
        console.log(now2.setHours(0, 0, 0, 0), date2.setHours(0, 0, 0, 0));

        const now = new Date().getTime();
        const timeInUse = Date.parse(element.startDateTime.dateTime);

        let Difference_In_Days = (timeInUse - now) / (1000 * 3600 * 24);

        // if (Difference_In_Days <= 1) {
        const startHours = new Date(element.startDateTime.dateTime).getHours();
        const startMinutes = String(new Date(element.startDateTime.dateTime).getMinutes()).padStart(2, "0");

        const endHours = new Date(Date.parse(element.startDateTime.dateTime) + element.duration * 60000).getHours();
        const endMinutes = String(new Date(Date.parse(element.startDateTime.dateTime) + element.duration * 60000).getMinutes()).padStart(2, "0");

        studioInUseToday.push({
          start: `${startHours}:${startMinutes}`,
          end: `${endHours}:${endMinutes}`,
          duration: element.duration,
        });
        // }
      }
    }
  });

  console.log(studioInUseToday);

  console.log("Studio is in use during the following hours today:");
  studioInUseToday.forEach((element) => {
    console.log(`${element.start} - ${element.end} `);
  });

  let freeTimesToday = getFreeTimes(studioInUseToday);
  console.log("Studio is free during the following hours today:");
  freeTimesToday.forEach((element) => {
    console.log(`${element.start} - ${element.end}`);
  });
});

function getFreeTimes(inUseTimes: { start: string; end: string }[]): { start: string; end: string }[] {
  // Sort the in-use times
  inUseTimes.sort((a, b) => a.start.localeCompare(b.start));

  let freeTimes: { start: string; end: string }[] = [];
  let freeTimeEnd = "00:00";

  for (let inUseTime of inUseTimes) {
    if (freeTimeEnd !== inUseTime.start) {
      freeTimes.push({ start: freeTimeEnd, end: inUseTime.start });
    }
    freeTimeEnd = inUseTime.end;
  }

  if (freeTimeEnd !== "23:59") {
    freeTimes.push({ start: freeTimeEnd, end: "23:59" });
  }

  return freeTimes;
}

function timeBetweenDates(date1: Date, date2: Date): string {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  const diffInSecs = Math.floor(diffInMs / 1000);
  const days = Math.floor(diffInSecs / 86400);
  const hours = Math.floor(diffInSecs / 3600) % 24;
  const minutes = Math.floor(diffInSecs / 60) % 60;
  const seconds = diffInSecs % 60;
  return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}
