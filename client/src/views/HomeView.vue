<template>
  <div class="h-screen relative">
    <div class="mx-10 my-10">
      <div class="grid grid-rows-3 grid-flow-col gap-4">
        <div class="col-span-2 pb-5">
          <div class="box-content h-96 bg-white drop-shadow-md px-8 py-8">
            <TimeLinePage :updateData="updateData" :updateDataMap="updateDataMap" :setData="setData"/>
          </div>
        </div>

        <div class="col-span-2">
          <div class="box-content h-96 bg-white drop-shadow-md px-8 py-8">
            <MapPage :updatedDataProp="setData" :updateDataMapProp="setDataMap" />
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
    });
    
    const setData = ref([]);
    const setDataMap = ref([]);

    const updateData = (newData) => {
      setData.value = newData;
    };
    const updateDataMap = (newData) => {
      setDataMap.value = newData;
      console.log('first', setDataMap.value)
    };

    return {
      setData,
      updateData,
      setDataMap,
      updateDataMap,
    };
  },
};
</script>
