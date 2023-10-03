<template>
  <div class="h-80">
    <p class="title__page">Activities Map</p>
    <GeoErrorModal
      v-if="geoError"
      :geoErrorMsg="geoErrorMsg"
      @closeGeoError="closeGeoError"
    />
    <MapFeatures
      :fetchCoords="fetchCoords"
      :coords="coords"
      @toggleSearchResults="toggleSearchResults"
      @getGeolocation="getGeolocation"
      @plotResult="plotResult"
      @removeResult="removeResult"
      :searchResults="searchResults"
      class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2]"
    />
    <div id="map" class="h-full z-[1]"></div>
    <!-- <p>ข้อมูลที่รับมาจากลูก A: {{ updatedDataProp }}</p> -->
  </div>
</template>

<script>
import leaflet from "leaflet";
import { onMounted, toRefs, ref, watchEffect } from "vue";
import GeoErrorModal from "../components/GeoErrorModal.vue";
import MapFeatures from "../components/MapFeatures.vue";

export default {
  props: {
    updatedDataProp: Array,
    // updateDataMapProp: Array,
    // updatedDataProp: {
    //   type: Array,
    //   required: true,
    // },
  },
  name: "MapPage",
  components: { GeoErrorModal, MapFeatures },
  setup(props) {
    const { updatedDataProp } = toRefs(props);
    const markers = ref([]);
    onMounted(() => {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        const leafletMap = leaflet
          .map(mapElement)
          .setView([13.7563, 100.5018], 10);

        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          })
          .addTo(leafletMap);

        // watchEffect(() => {
        //   updatedDataProp.value.forEach((location) => {
        //     const { latitude, longitude } = location;
        //     leaflet
        //       .marker([latitude, longitude])
        //       .addTo(leafletMap)
        //       .bindPopup("<b>Hello world!</b><br>I am a popup.")
        //       .openPopup();
        //   });
        // });


        // สร้าง marker เมื่อค่าเริ่มต้นถูกนำเข้า
        // updatedDataProp.value.forEach((location) => {
        //   const { latitude, longitude } = location;
        //   const marker = createMarker(latitude, longitude);
        //   markers.push(marker);
        //   marker.addTo(leafletMap);
        // });

        // ตรวจสอบการเปลี่ยนแปลงใน updatedDataProp
        watchEffect(() => {
          updatedDataProp.value.forEach((location) => {
            // console.log("index :>> ", location);
            const { latitude, longitude } = location;
            leaflet
              .marker([latitude, longitude])
              .addTo(leafletMap)
              .bindPopup("<b>Hello world!</b><br>I am a popup.")
              .openPopup();

            // เปรียบเทียบค่าระหว่าง updatedDataProp กับ updateDataMapProp
            // if (
            //   JSON.stringify(location) ===
            //   JSON.stringify(updateDataMapProp.value[index])
            // ) {
            //   // ถ้าค่าเท่ากันให้ใช้สีเดิม
            //   markers[index].setStyle({ color: "blue" });
            // } else {
            //   // ถ้าค่าไม่เท่ากันให้เปลี่ยนสีเป็นสีอื่น
            //   markers[index].setStyle({ color: "red" });
            // }
          });
        });

        // function createMarker(latitude, longitude) {
        //   return leaflet
        //     .marker([latitude, longitude])
        //     .addTo(leafletMap)
        //     .bindPopup("<b>Hello world!</b><br>I am a popup.")
        //     .openPopup();
        // }
      }
    });

    return {
      markers,
    };
  },
};
</script>

<style scoped>
.title__page {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
  line-height: 1.2;
}
</style>
