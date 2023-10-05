<template>
  <div class="h-96 bg-white px-8 py-8">
    <p class="title__page">Activities Timeline</p>
    <div class="grid grid-cols-4 gap-4">
      <div class="col-span-1 container">
        <div v-if="clickedBarScrollData">
          <pre>{{ clickedBarScrollData }}</pre>
        </div>
      </div>

      <div class="col-span-3">
        <div class="g-gantt-chart-container">
          <g-gantt-chart
            chart-start="2021-07-11 12:00"
            chart-end="2021-07-20 12:00"
            precision="day"
            bar-start="myBeginDate"
            bar-end="myEndDate"
            width="100%"
            :grid="grid"
          >
            <g-gantt-row
              v-for="activity in transformedData"
              :key="activity.ganttBarConfig.id"
              :label="activity.ganttBarConfig.label"
              :bars="[activity]"
              @click="handleRowScroll(activity)"
            />
          </g-gantt-chart>
        </div>

        <!-- Button Add Delete -->
        <div class="relative flex items-center justify-start mt-5">
          <div class="relative p-3">
            <div
              @click="addRow"
              class="pointer-events-auto rounded-md bg-green-700 px-6 py-4 text-white hover:bg-green-500 font-semibold"
            >
              addRow
            </div>
          </div>
          <div class="relative p-3">
            <div
              @click="deleteRow"
              class="pointer-events-auto rounded-md bg-green-700 px-6 py-4 text-white hover:bg-green-500 font-semibold"
            >
              deleteRow
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  props: {
    setData: String,
    updateData: Function,
    updateDataMap: Function,
  },
  name: "TimeLinePage",
  setup(props) {
    const transformedData = ref([]);
    const locationData = ref([]);

    const clickedBarScrollData = ref(null);

    // callSendData to Home
    const callParentFunction = () => {
      const newData = locationData.value;
      props.updateData(newData);
    };

    const handleRowScroll = (event) => {
      const barElement = event;
      console.log("barElement :>> ", barElement);
    };

    onMounted(() => {
      barList.value.forEach((entity) => {
        entity.activities.forEach((activity) => {
          transformedData.value.push({
            myBeginDate: activity.activity_start_datetime,
            myEndDate: activity.activity_end_datetime,
            ganttBarConfig: {
              id: entity.entity_id + "-" + activity.activity_name,
              label: activity.activity_name,
              style: {
                background: activity.background,
                borderRadius: activity.borderRadius,
                color: activity.color,
              },
            },
            location: {
              latitude: parseFloat(
                activity.activity_latlon.split(",")[0].trim()
              ),
              longitude: parseFloat(
                activity.activity_latlon.split(",")[1].trim()
              ),
            },
          });
        });
      });

      barList.value.forEach((entity) => {
        entity.activities.forEach((activity) => {
          locationData.value.push({
            latitude: parseFloat(activity.activity_latlon.split(",")[0].trim()),
            longitude: parseFloat(
              activity.activity_latlon.split(",")[1].trim()
            ),
          });
        });
      });

      callParentFunction();
      addRow();
      deleteRow();
    });

    const barList = ref([
      {
        entity_name: "person_name",
        entity_id: "P0001",
        entity_type: "person",
        activities: [
          {
            activity_name: "ต่อบัตรประชาชน",
            activity_address: "ต.สามพราน อ.เมือง จ.นครปฐม",
            activity_latlon: "13.7563, 100.5018",
            activity_start_datetime: "2021-07-12 13:00",
            activity_end_datetime: "2021-07-14 15:00",
            background: "rgb(242, 132, 15)",
            borderRadius: "10px",
            color: "white",
          },
          {
            activity_name: "ทำใบขับขี่",
            activity_address: "ต.สามพราน อ.เมือง จ.นครปฐม",
            activity_latlon: "13.8550, 100.5018",
            activity_start_datetime: "2021-07-14 13:00",
            activity_end_datetime: "2021-07-16 19:00",
            background: "rgb(222, 59, 38)",
            borderRadius: "10px",
            color: "white",
          },
          {
            activity_name: "ผ่านด่าน",
            activity_address: "ต.สามพราน อ.เมือง จ.นครปฐม",
            activity_latlon: "13.9550, 105.5018",
            activity_start_datetime: "2021-07-18 13:00",
            activity_end_datetime: "2021-07-19 19:00",
            background: "rgb(94, 255, 173)",
            borderRadius: "10px",
            color: "white",
          },
          {
            activity_name: "สมัครงาน",
            activity_address: "ต.สามพราน อ.เมือง จ.นครปฐม",
            activity_latlon: "13.9550, 105.5018",
            activity_start_datetime: "2021-07-19 13:00",
            activity_end_datetime: "2021-07-20 19:00",
            background: "rgb(242, 132, 15)",
            borderRadius: "10px",
            color: "white",
          },
        ],
      },
    ]);

    const barScroll = ref([
      {
        myBeginDate: "2021-07-11 10:00",
        myEndDate: "2021-07-12 09:00",
        ganttBarConfig: {
          id: "scrolling-row",
          label: "Scroll",
          style: {
            background: "rgb(46, 116, 163)",
            borderRadius: "10px",
            color: "white",
          },
        },
        location: {
          latitude: "13.955",
          longitude: "105.5018",
        },
      },
    ]);

    const row2BarList = ref([]);
    const addRow = () => {
      row2BarList.value.push({
        myBeginDate: "2021-07-12 14:00",
        myEndDate: "2021-07-13 18:00",
        ganttBarConfig: {
          id: "unique-id-" + (row2BarList.value.length + 1),
          label: "New Bar " + (row2BarList.value.length + 1),
          style: {
            // arbitrary CSS styling for your bar
            background: "#e09b69",
            borderRadius: "20px",
            color: "white",
          },
        },
      });
    };

    const deleteRow = () => {
      row2BarList.value.pop();
    };

    return {
      row2BarList,
      barList,
      addRow,
      deleteRow,
      transformedData,
      barScroll,
      locationData,
      handleRowScroll,
      callParentFunction,
      clickedBarScrollData,
    };
  },
};
</script>

<style scoped>
.g-gantt-chart-container {
  width: 100% !important;
  display: flex;
  flex-direction: column;
}
.g-gantt-chart {
  box-sizing: border-box;
  background: #fff;
  /* padding-bottom: 34px; */
}
.g-gantt-row {
  height: 45px !important;
  border: 2px solid #eaeaea;
}
.g-gantt-timeaxi-empty-space {
  min-width: 200px;
  min-height: 100%;
  background: #e0e0e0;
  z-index: 5;
  left: 0;
  position: sticky;
}
.title__page {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
}
</style>
