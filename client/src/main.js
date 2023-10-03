import { createApp } from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";
import router from "./router";
import ganttastic from '@infectoone/vue-ganttastic'
import GanttScheduleTimelineCalendar from 'vue-gantt-schedule-timeline-calendar';

const app = createApp(App);

app.use(router);
app.use(ganttastic);
app.use(GanttScheduleTimelineCalendar);

app.mount("#app");
