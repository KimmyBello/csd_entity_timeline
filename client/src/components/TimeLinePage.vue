<template>
  <div class="h-80">
    <p class="title__page">Activities Timeline</p>
    <div class="grid grid-cols-4 gap-4">
      <div class="col-span-1 container">
        <!-- <p class="align-text-bottom">นาย ก</p>
        <span class="align-text-bottom">ข้อมูลส่วนบุคคล</span> -->
      </div>

      <div class="col-span-3">
        <g-gantt-chart
          chart-start="2021-07-12 12:00"
          chart-end="2021-07-14 12:00"
          precision="hour"
          bar-start="myBeginDate"
          bar-end="myEndDate"
        >
          <g-gantt-row
            label="My row 1"
            :bars="row1BarList"
            @click="handleRowScroll"
          />
          <g-gantt-row
            v-for="bar in row2BarList"
            :key="bar.ganttBarConfig.id"
            :label="bar.ganttBarConfig.label"
            :bars="[bar]"
          >
            <p>ตำแหน่ง X: {{ bar.myBeginDate }}</p>
            <p>ตำแหน่ง Y: {{ bar.ganttBarConfig.label }}</p>
            <g-gantt-timeline>
              :start="bar.myBeginDate" :end="bar.myEndDate"
              :label="bar.ganttBarConfig.label"
              <template #tab-content>
                <div class="tab-content">
                  <p>X: {{ bar.myBeginDate }}</p>
                  <p>Y: {{ bar.ganttBarConfig.label }}</p>
                </div>
              </template>
            </g-gantt-timeline>
          </g-gantt-row>
        </g-gantt-chart>

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

    <!-- <button @click="handleRowScroll()">ส่งข้อมูลไป</button> -->
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  name: "TimeLinePage",
  components: {},
  setup() {
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

    const handleRowScroll = (event) => {
      const barElement = event.target;
      const barWidth = 100; // กำหนดความกว้างของแถบใน pixel
      const scrollLeft = barElement.scrollLeft;
      const visibleBars = Math.floor(scrollLeft / barWidth);

      // ค้นหาแถบที่มีค่า scrollLeft อยู่ในช่วงที่เหมาะสมและแสดงผลข้อมูล
      if (visibleBars >= 0 && visibleBars < row1BarList.value.length) {
        const visibleBar = row1BarList.value[visibleBars];
        console.log("Visible Bar Data:", visibleBar);
      }
    };
    // const handleRowScroll = (event) => {
    //   const barElement = event.target;
    //   const scrollLeft = barElement.scrollLeft;

    //   console.log("Scroll Left:", scrollLeft);
    //   // ค้นหาแถบที่มีค่า scrollLeft อยู่ในช่วงที่เหมาะสมและแสดงผล label
    // };

    onMounted(() => {
      addRow();
      deleteRow();
    });
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
            color: "black",
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
      addRow,
      deleteRow,
      handleRowScroll,
    };
  },
};
</script>

<style scoped>
#ganttastic-wrapper {
  height: 35vh;
  overflow-y: auto;
}
.title__page {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
  line-height: 1.2;
}
.g-gantt-chart {
  /* width: 660px !important; */
  height: 232px !important;
}
.container {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  height: 330px;
}

.text {
  margin-right: 10px; /* ระยะห่างด้านขวา */
  margin-bottom: 10px; /* ระยะห่างด้านล่าง */
}
</style>
