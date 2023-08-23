<template>
  <div class="h-80">
    <p class="title__page">Activities Timeline</p>
    <div class="grid grid-cols-4 gap-4">
      <div class="col-span-1 container">
        <p class="align-text-bottom">นาย ก</p>
        <span class="align-text-bottom">ข้อมูลส่วนบุคคล</span>
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
              label="My row 1"
              :bars="scrollingRowConfig"
              @click="handleScrollingBarClick"
            />

            <g-gantt-row
              v-for="activity in transformedData"
              :key="activity.ganttBarConfig.id"
              :label="activity.ganttBarConfig.label"
              :bars="[activity]"
            />
            <!-- <g-gantt-row
              v-for="bar in row2BarList"
              :key="bar.ganttBarConfig.id"
              :label="bar.ganttBarConfig.label"
              :bars="[bar]"
            /> -->
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

    <button @click="callParentFunction()">ส่งข้อมูลไป</button>
  </div>
</template>

<script>
import { onMounted, ref, defineEmits } from "vue";

export default {
  props: {
    setData: String,
  },
  name: "TimeLinePage",
  components: {},
  setup(props) {
    console.log("first", props.setData);
    // const buttonClick = () => {
    //   emit("setData", "Hi");
    // };
    
    const transformedData = ref([]);

    const handleRowScroll = (event) => {
      const barElement = event.target;
      const barWidth = 100; // กำหนดความกว้างของแถบใน pixel
      const scrollLeft = barElement.scrollLeft;
      const visibleBars = Math.floor(scrollLeft / barWidth);

      // ค้นหาแถบที่มีค่า scrollLeft อยู่ในช่วงที่เหมาะสมและแสดงผลข้อมูล
      if (visibleBars >= 0 && visibleBars < transformedData.value.length) {
        const visibleBar = transformedData.value[visibleBars];
        console.log("Visible Bar Data:", visibleBar);
      }
    };

    const handleScrollingBarClick = () => {
      transformedData.value.forEach((activity) => {
        console.log("Activity:", activity);
      });
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

      addRow();
      deleteRow();
      callParentFunction();
    });

    const emits = defineEmits(["updateData"]);
    console.log("emit", emits);

    const callParentFunction = () => {
      console.log('first')
      emits.updateData("kimmmytest");
    };

    const row1BarList = ref([
      {
        myBeginDate: "2021-07-12 13:00",
        myEndDate: "2021-07-14 19:00",
        ganttBarConfig: {
          id: "unique-id-1",
          label: "Lorem ipsum dolor",
          // immobile: true,
          style: {
            // arbitrary CSS styling for your bar
            background: "#e09b69",
            borderRadius: "20px",
            color: "black",
          },
        },
        location: {
          latitude: 13.7563,
          longitude: 100.5018,
        },
      },
    ]);

    const barList = ref([
      {
        entity_name: "person_name",
        entity_id: "P0001",
        entity_type: "person",
        activities: [
          {
            activity_name: "ต่อบัตรประชาชน",
            activity_address: "ต.สามพราน อ.เมือง จ.นครปฐม",
            activity_latlon: "100.00, 99.00",
            activity_start_datetime: "2021-07-12 13:00",
            activity_end_datetime: "2021-07-14 15:00",
            background: "#e09b69",
            borderRadius: "20px",
            color: "white",
          },
          {
            activity_name: "ทำใบขับขี่",
            activity_address: "ต.สามพราน อ.เมือง จ.นครปฐม",
            activity_latlon: "100.00, 96.00",
            activity_start_datetime: "2021-07-12 13:00",
            activity_end_datetime: "2021-07-13 19:00",
            background: "#e09b69",
            borderRadius: "20px",
            color: "white",
          },
        ],
      },
    ]);

    const scrollingRowConfig = ref([
      {
        myBeginDate: "2021-07-11 00:00",
        myEndDate: "2021-07-11 18:00",
        ganttBarConfig: {
          id: "scrolling-row",
          label: "Scrolling Row",
          style: {
            background: "rgb(222, 59, 38)",
            width: "200px",
            borderRadius: "10px",
            color: "white",
          },
        },
      },
    ]);

    // add row del row
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
      row1BarList,
      row2BarList,
      barList,
      addRow,
      deleteRow,
      handleRowScroll,
      transformedData,
      scrollingRowConfig,
      handleScrollingBarClick,
      props,
      emits,
      callParentFunction,
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
  width: 700px !important;
  border: 1px solid #eaeaea;
  box-sizing: border-box;
  background: #fff;
  padding-bottom: 34px;
}
.g-gantt-row {
  height: 45px !important;
  border: 1px solid #eaeaea;
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
  margin-bottom: 1rem;
  font-weight: 500;
  line-height: 1.2;
}
.text {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
