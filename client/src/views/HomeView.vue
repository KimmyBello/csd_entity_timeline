<template>
  <div class="h-screen relative">
    <div class="mx-10 my-10">
      <div class="grid grid-rows-3 grid-flow-col gap-4">
        <div class="col-span-2 pb-5">
          <div class="box-content h-96 bg-white drop-shadow-md px-8 py-8">
            <TimeLinePage />
          </div>
        </div>

        <div class="col-span-2">
          <div class="box-content h-96 bg-white drop-shadow-md px-8 py-8">
            <MapPage />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import MapPage from "../components/MapPage.vue";
import TimeLinePage from "../components/TimeLinePage.vue";

export default {
  name: "HomeView",
  components: { MapPage, TimeLinePage },
  setup() {
    onMounted(() => {
      doSomethingInParent();
      // console.log("object :>> ", doSomethingInParent);
      // console.log("row :>> ", row1BarList);
    });

    const doSomethingInParent = () => {
      console.log("Function executed in parent component");
    };

    const row1BarList = ref([
      {
        myBeginDate: "2021-07-13 13:00",
        myEndDate: "2021-07-14 19:00",
        ganttBarConfig: {
          id: "unique-id-1",
          label: "Lorem ipsum dolor",
        },
        location: {
          latitude: 13.7563,
          longitude: 100.5018,
        },
      },
    ]);

    // const getLocations = () => {
    //   return row1BarList.value.map((row) => row.location);
    // };

    return {
      row1BarList,
      doSomethingInParent,
      // getLocations,
    };
  },
};
</script>
