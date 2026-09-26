export interface ScheduleItem {
  day: string;
  timeRange: string;
  locationName: string;
  address: string;
  googleMapsLink: string;
}

export const scheduleData: ScheduleItem[] = [
  {
    day: "THURSDAY",
    timeRange: "18:00 - 02:00 (LATE NIGHT)",
    locationName: "D4 Industrial Arts Quarter",
    address: "1082 Vandal Way SE, District 4",
    googleMapsLink: "https://maps.google.com/?q=District+4+Arts+Quarter"
  },
  {
    day: "FRIDAY",
    timeRange: "18:00 - 03:00 (NIGHT ENGINE)",
    locationName: "Underground Warehouse Hub",
    address: "70 Wharf Street Bypass, Old Docks",
    googleMapsLink: "https://maps.google.com/?q=Old+Docks+Warehouse+Hub"
  },
  {
    day: "SATURDAY",
    timeRange: "16:00 - 04:00 (RAW PARTY RUN)",
    locationName: "The Concrete Soundsystem Plaza",
    address: "Central Beats Roundabout, Sector 9",
    googleMapsLink: "https://maps.google.com/?q=Sector+9+Soundsystem+Plaza"
  },
  {
    day: "SUNDAY",
    timeRange: "12:00 - 22:00 (RECOVERY FEAST)",
    locationName: "Street Culture Headquarters",
    address: "Alley 14, Main Industrial District",
    googleMapsLink: "https://maps.google.com/?q=Street+Culture+HQ"
  }
];
