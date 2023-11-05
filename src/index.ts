import axios from "axios";

axios.get("https://businessgateway.puregym.com/api/bookings/v1/timetable/75/scheduled-class").then((resp) => {
  const { data } = resp;

  // let studioInUseArray: [{ time: string; duration: number }] = [];
  let studioInUseArray: any[] = [];
  let studioInUseToday: any[] = [];

  data.activities.forEach((element: any, index: number) => {
    if (element.studio === "Studio") {
      const now = new Date().getTime();
      const timeInUse = Date.parse(element.startDateTime.dateTime);

      let Difference_In_Days = (timeInUse - now) / (1000 * 3600 * 24);

      if (Difference_In_Days <= 1) {
        const startHours = new Date(element.startDateTime.dateTime).getHours();
        const startMinutes = String(new Date(element.startDateTime.dateTime).getMinutes()).padStart(2, "0");

        const endHours = new Date(Date.parse(element.startDateTime.dateTime) + element.duration * 60000).getHours();
        const endMinutes = String(new Date(Date.parse(element.startDateTime.dateTime) + element.duration * 60000).getMinutes()).padStart(2, "0");

        studioInUseToday.push({
          start: `${startHours}:${startMinutes}`,
          end: `${endHours}:${endMinutes}`,
          duration: element.duration,
          start2: timeBetweenDates(new Date(element.startDateTime.dateTime), new Date(Date.parse(element.startDateTime.dateTime) + element.duration * 60000)),
        });
      }
    }
  });

  console.log(studioInUseToday);
  console.log("Studio is in use during the following hours (within 24 hours):");
  studioInUseToday.forEach((element) => {
    console.log(`${element.start} - ${element.end} `);
  });
});

function timeBetweenDates(date1: Date, date2: Date): string {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  const diffInSecs = Math.floor(diffInMs / 1000);
  const days = Math.floor(diffInSecs / 86400);
  const hours = Math.floor(diffInSecs / 3600) % 24;
  const minutes = Math.floor(diffInSecs / 60) % 60;
  const seconds = diffInSecs % 60;
  return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}

// Usage
const date1 = new Date("2022-01-01");
const date2 = new Date("2022-01-02");
console.log(timeBetweenDates(date1, date2));
