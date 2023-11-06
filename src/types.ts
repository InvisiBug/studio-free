export interface Gym {
  activities: ActivitiesEntity[];
}

export interface ActivitiesEntity {
  id: string;
  name: string;
  startDateTime: StartDateTime;
  duration: number;
  description: string;
  bookedCount: number;
  classCapacity: number;
  waitingListCount: number;
  waitingListCapacity: number;
  instructorName: string;
  studio: string;
  classType: string;
  energyConsumptionKcal?: number | null;
  bookingStatus: string;
  bookingErrors?: (BookingErrorsEntity | null)[] | null;
  gymAccessSlot: GymAccessSlot;
}

export interface StartDateTime {
  dateTime: string;
  timeZone: string;
}

export interface BookingErrorsEntity {
  errorCode: string;
  message: string;
  extraErrorInfo?: ExtraErrorInfo | null;
}

export interface ExtraErrorInfo {
  numberOfDaysInAdvance: number;
}

export interface GymAccessSlot {
  isRequired: boolean;
  isBooked: boolean;
}
