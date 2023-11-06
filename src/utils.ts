export function getFreeTimes(inUseTimes: { start: string; end: string }[]): { start: string; end: string }[] {
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

export function getFreeTimesSchedule(schedule: { start: string; end: string; duration: number }[]): { start: string; end: string }[] {
  // Sort the schedule by start time
  schedule.sort((a, b) => a.start.localeCompare(b.start));

  let freeTimes: { start: string; end: string }[] = [];
  let freeTimeEnd = "00:00";

  for (let i = 0; i < schedule.length; i++) {
    let current = schedule[i];
    let next = schedule[i + 1];

    if (next && current.end !== next.start) {
      freeTimes.push({ start: current.end, end: next.start });
    } else if (!next && current.end !== "23:59") {
      freeTimes.push({ start: current.end, end: "23:59" });
    }

    freeTimeEnd = current.end;
  }

  return freeTimes;
}

export function displayTimeline(studioInUseToday: { start: string; end: string }[]) {
  // Initialize the timeline
  let timeline = new Array((24 * 60) / 15).fill(" ");

  // Mark the times in the timeline
  for (let timeSlot of studioInUseToday) {
    let start = (parseInt(timeSlot.start.split(":")[0]) * 60 + parseInt(timeSlot.start.split(":")[1])) / 15;
    let end = (parseInt(timeSlot.end.split(":")[0]) * 60 + parseInt(timeSlot.end.split(":")[1])) / 15;

    for (let i = start; i < end; i++) {
      timeline[i] = "X";
    }
  }

  // Convert the timeline to a string
  let timelineStr = timeline
    .map((mark, quarter) => {
      let hour = Math.floor(quarter / 4);
      let minute = (quarter % 4) * 15;
      let timeStr = String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
      return `${timeStr}: ${mark}`;
    })
    .join("\n");

  // Display the timeline
  console.log(timelineStr);
}

export function timeBetweenDates(date1: Date, date2: Date): string {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  const diffInSecs = Math.floor(diffInMs / 1000);
  const days = Math.floor(diffInSecs / 86400);
  const hours = Math.floor(diffInSecs / 3600) % 24;
  const minutes = Math.floor(diffInSecs / 60) % 60;
  const seconds = diffInSecs % 60;
  return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}
