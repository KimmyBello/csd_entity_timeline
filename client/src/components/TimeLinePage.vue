<template>
  <div class="h-96 bg-white px-8 py-8">
    <p class="title__page">Activities Timeline</p>
    <div class="grid grid-cols-4 gap-4">
      <div class="col-span-1 container"></div>

      <div class="col-span-3">
        <div class="g-gantt-chart-container">
          <div class="gstc">
            <div class="gstc-wrapper" ref="gstcElement"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GSTC from "gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js";
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js";
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js";
import { Plugin as ItemResizing } from "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js";
import { Plugin as ItemMovement } from "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js";
import { Plugin as Bookmarks } from "gantt-schedule-timeline-calendar/dist/plugins/time-bookmarks.esm.min.js";
import "gantt-schedule-timeline-calendar/dist/style.css";
import { ref, onMounted, onBeforeUnmount } from "vue";
// import { ref, onMounted } from "vue";

const itemsFromDB = ref([
  {
    entities: [
      {
        entity_name: "วีรศักดิ์  ทะชัย",
        entity_id: "3570300029314",
        entity_type: "person",
        activities: [
          {
            activity_name: "ทำบัตรประชาชน",
            activity_date: "2021-01-11",
            activity_place: "คลองหลวง ปทุมธานี",
            lat: 14.065999984741211,
            lng: 100.60700225830078,
          },
          {
            activity_name: "regist_house",
            activity_date: "2021-01-11",
            activity_place: " ",
            lat: null,
            lng: null,
          },
          {
            activity_name: "สมัครงาน",
            activity_date: "2021-01-12",
            activity_place: "โค้ดดิ้ง ฮับ (สามเสนนอก ห้วยขวาง กรุงเทพมหานคร)",
            lat: 13.795999526977539,
            lng: 100.5790023803711,
          },
          {
            activity_name: "สมัครงาน",
            activity_date: "2023-01-12",
            activity_place: "โค้ดดิ้ง ฮับ (สามเสนนอก ห้วยขวาง กรุงเทพมหานคร)",
            lat: 13.795999526977539,
            lng: 100.5790023803711,
          },
        ],
      },
    ],
  },
]);

// สร้างฟังก์ชันเพื่อแปลงข้อมูล Item
function convertItemsFromDB(itemsFromDB) {
  const convertedItems = [];
  let itemId = 1; // กำหนด ID เริ่มต้น
  itemsFromDB.value.forEach((entity) => {
    entity.entities.forEach((entityInfo) => {
      entityInfo.activities.forEach((activity) => {
        const convertedItem = {
          id: itemId.toString(),
          label: activity.activity_name,
          rowId: itemId.toString(),
          time: {
            start: GSTC.api
              .date(activity.activity_date)
              .startOf("day")
              .valueOf(),
            end: GSTC.api.date(activity.activity_date).endOf("day").valueOf(),
          },
        };
        convertedItems.push(convertedItem);
        itemId++; // เพิ่มค่า ID สำหรับรายการถัดไป
      });
    });
  });
  return convertedItems;
}
const convertedItems = convertItemsFromDB(itemsFromDB);
console.log("item", convertedItems);

// สร้างฟังก์ชันเพื่อแปลงข้อมูล Column
function convertColumnFromDB(itemsFromDB) {
  const convertedColumns = [];
  for (const item of itemsFromDB.value) {
    // สร้างข้อมูลแต่ละรายการจาก itemsFromDB
    const convertedColumn = {
      id: item.entities[0].entity_id, // ใช้ entity_id เป็น id
      label: item.entities[0].entity_name, // ใช้ entity_name เป็น label
      data: ({ row }) => GSTC.api.sourceID(row.id), // show original id (not internal GSTCID)
      sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)), // sort by id converted to number
      width: 80,
      header: {
        content: "ID",
      },
    };
    convertedColumns.push(convertedColumn);
  }

  return convertedColumns;
}
const convertedColumn = convertColumnFromDB(itemsFromDB);
console.log(convertedColumn);

// helper functions
function generateItems() {
  const items = {};

  // เรียกใช้ค่า convertedItems ที่คุณสร้างขึ้น
  const convertedItems = convertItemsFromDB(itemsFromDB);

  // เริ่มต้นตัวแปร rowId และ i ที่ 0
  let rowId = 0;
  let i = 0;

  // วนลูปผ่าน convertedItems
  for (const convertedItem of convertedItems) {
    // สร้าง id ในรูปแบบ GSTCID
    const id = GSTC.api.GSTCID(convertedItem.id);

    // กำหนดข้อมูลให้กับ items จาก convertedItem
    items[id] = {
      id,
      label: convertedItem.label,
      rowId: GSTC.api.GSTCID(rowId.toString()), // ใช้ rowId แบบ GSTCID
      time: {
        start: convertedItem.time.start,
        end: convertedItem.time.end,
      },
    };

    // เพิ่ม rowId และ i ในรายการถัดไป
    rowId++;
    i++;

    // หยุดการวนลูปหาก i เกิน 100
    if (i >= 100) {
      break;
    }
  }

  return items;
}
function generateRows() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Rows }
   */
  const rows = {};
  for (let i = 0; i < 100; i++) {
    const id = GSTC.api.GSTCID(i.toString());
    rows[id] = {
      id,
      label: `Row ${i}`,
    };
  }
  return rows;
}

// function generateRows() {
//   /**
//    * @type { import("gantt-schedule-timeline-calendar").Rows }
//    */
//   const rows = {};
//   const convertedColumns = convertColumnFromDB(itemsFromDB);
//   let i = 0;

//   console.log('convertedColumnsx', convertedColumns)

//   for (const convertedColumn of convertedColumns) {
//     const id = GSTC.api.GSTCID(convertedColumn.id);

//     rows[id] = {
//       id,
//       label: convertedColumn.label,
//     };

//     i++;
//   }
//   return rows;
// }

// main component
export default {
  name: "GSTC",
  setup() {
    const state = ref(null);
    const gstc = ref(null);
    const gstcElement = ref(null);

    onMounted(() => {
      /**
       * @type { import("gantt-schedule-timeline-calendar").Config }
       */
      const config = {
        licenseKey:
          "====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====",
        plugins: [
          TimelinePointer(),
          Selection(),
          ItemResizing(),
          ItemMovement(),
          Bookmarks(),
        ],
        list: {
          columns: {
            data: {
              // [GSTC.api.GSTCID("id")]: {
              //   id: GSTC.api.GSTCID("id"),
              //   width: 60,
              //   data: ({ row }) => GSTC.api.sourceID(row.id),
              //   header: {
              //     content: "ID",
              //   },
              // },
              [GSTC.api.GSTCID("label")]: {
                id: GSTC.api.GSTCID("label"),
                width: 200,
                data: "label",
                header: {
                  content: "Label",
                },
              },
            },
          },
          rows: generateRows(),
        },
        chart: {
          items: generateItems(),
        },
      };

      // state = GSTC.api.stateFromConfig(config);
      state.value = GSTC.api.stateFromConfig(config);

      gstc.value = GSTC({
        element: gstcElement.value,
        state: state.value,
      });
    });

    onBeforeUnmount(() => {
      if (gstc.value) gstc.value.destroy();
    });

    function updateFirstRow() {
      state.value.update(`config.list.rows.${GSTC.api.GSTCID("0")}`, (row) => {
        row.label = "Changed dynamically";
        return row;
      });
    }

    // log data from click row
    const onItemClick = (ev) => {
      const itemElement = ev.target.closest(
        ".gstc__chart-timeline-items-row-item-label"
      );
      console.log("itemElement", itemElement);
      const itemId = itemElement;
      console.log("itemId :>> ", itemId);
      const item = GSTC.api.getItem(itemId);
      console.log("Item click from template", item);
    };

    function changeZoomLevel() {
      state.value.update("config.chart.time.zoom", 21);
    }

    return {
      gstcElement,
      updateFirstRow,
      changeZoomLevel,
      onItemClick,
      state,
      gstc,
      itemsFromDB,
      convertItemsFromDB,
      convertColumnFromDB,
      // rowsFromDB,
      itemsFromDB,
      // columnsFromDB,
      // fromArray,
      // GSTCID
    };
  },
};
</script>

<style scoped>
.gstc {
  height: 250px !important;
}
.gstc-component {
  margin: 0;
  padding: 0;
}
.toolbox {
  padding: 10px;
}
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
