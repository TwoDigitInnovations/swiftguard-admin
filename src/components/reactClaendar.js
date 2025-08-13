import Calendar from "react-awesome-calendar";

const events = [
  {
    id: 1,
    color: "#fd3153",
    from: "2022-07-07T18:00:00+00:00",
    to: "2022-07-07T19:00:00+00:00",
    title: "This is an event",
  },
  {
    id: 2,
    color: "#1ccb9e",
    from: "2022-07-07T13:00:00+00:00",
    to: "2022-07-07T14:00:00+00:00",
    title: "This is another event",
  },
  {
    id: 3,
    color: "#3694DF",
    from: "2022-09-05T13:00:00+00:00",
    to: "2022-09-05T20:00:00+00:00",
    title: "This is also another event",
  },
];

export function ReactCalendar() {
  return (
    <div className="p-5 bg-white">
      <Calendar events={events} />
    </div>
  );
}
