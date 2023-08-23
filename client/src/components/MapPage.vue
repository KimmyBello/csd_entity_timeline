<template>
  <div class="h-80">
    <p class="title__page">Activities Map</p>
    <!-- <p>ข้อมูลที่รับมาจากลูก A: {{ receivedRow1BarList }}</p> -->
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
    <div id="mapid" class="h-full z-[1]"></div>
  </div>
</template>

<script>
import leaflet from "leaflet";
import { onMounted, ref } from "vue";
import GeoErrorModal from "../components/GeoErrorModal.vue";
import MapFeatures from "../components/MapFeatures.vue";

export default {
  props: {
    locations: Array,
  },
  name: "MapPage",
  components: { GeoErrorModal, MapFeatures },
  // setup() {
  //   let map;
  //   onMounted(() => {
  //     // สร้าง Layer แผนที่
  //     console.log("row1BarList", this.message);
  //     map = leaflet
  //       .map("mapid", {
  //         zoomControl: false,
  //       })
  //       .setView([28.538336, -81.379234], 10);

  //     // add tile layers
  //     leaflet
  //       .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //         attribution: "© OpenStreetMap contributors",
  //       })
  //       .addTo(map);
  //   });

  //   // แสดง Marker จากข้อมูลใน row1BarList
  //   // this.row1BarList.value.forEach((bar) => {
  //   //   const { latitude, longitude } = bar.location;
  //   //   leaflet.marker([latitude, longitude])
  //   //     .addTo(map)
  //   //     .bindPopup(bar.ganttBarConfig.label); // แสดง Label บน Marker
  //   // });

  //   return {};
  // },
  setup() {
    // const callParentFunction = () => {
    //   props.locations(); // เรียกใช้งานฟังก์ชั่นจากคอมโพเนนต์แม่
    // };

    let map;
    onMounted(() => {
      // init map
      map = leaflet
        .map("mapid", {
          zoomControl: false,
        })
        .setView([51.505, -0.09], 13);

      // add tile layers
      leaflet
        .tileLayer(
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: "© OpenStreetMap",
          }
        )
        .addTo(map);

      map.on("moveend", () => {
        closeSearchResults();
      });

      // get users location
      getGeolocation();
    });

    const coords = ref(null);
    const fetchCoords = ref(null);
    const geoMarker = ref(null);
    const geoError = ref(null);
    const geoErrorMsg = ref(null);

    // const receivedRow1BarList = inject("row1BarListForChildB", ref([]));

    const getGeolocation = () => {
      // if function is called, only run if we dont have coords
      if (!coords.value) {
        // check to see if we have coods in session sotrage
        if (sessionStorage.getItem("coords")) {
          coords.value = JSON.parse(sessionStorage.getItem("coords"));
          plotGeoLocation(coords.value);
          return;
        }

        // else get coords from geolocation API
        fetchCoords.value = true;
        navigator.geolocation.getCurrentPosition(setCoords, getLocError);
        return;
      }

      // otherwise, remove location
      coords.value = null;
      sessionStorage.removeItem("coords");
      map.removeLayer(geoMarker.value);
    };

    const setCoords = (pos) => {
      // stop fetching
      fetchCoords.value = null;

      // set coords in session storage
      const setSessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

      // set ref coords value
      coords.value = setSessionCoords;

      plotGeoLocation(coords.value);
    };

    const getLocError = (error) => {
      // stop fetching coords
      fetchCoords.value = null;
      geoError.value = true;
      geoErrorMsg.value = error.message;
    };

    const plotGeoLocation = (coords) => {
      // create custom marker
      const customMarker = leaflet.icon({
        iconUrl: require("../assets/map-marker-red.svg"),
        iconSize: [35, 35],
      });

      // create new marker with coords and custom marker
      geoMarker.value = leaflet
        .marker([coords.lat, coords.lng], { icon: customMarker })
        .addTo(map);

      // set map view to current location
      map.setView([coords.lat, coords.lng], 10);
    };

    const resultMarker = ref(null);
    const plotResult = (coords) => {
      // If there is already a marker, remove it. Only allow 1
      if (resultMarker.value) {
        map.removeLayer(resultMarker.value);
      }
      const customMarker = leaflet.icon({
        iconUrl: require("../assets/map-marker-blue.svg"),
        iconSize: [35, 35], // size of the icon
      });
      resultMarker.value = leaflet
        .marker([coords.coordinates[1], coords.coordinates[0]], {
          icon: customMarker,
        })
        .addTo(map);
      map.setView([coords.coordinates[1], coords.coordinates[0]], 13);
    };

    const removeResult = () => {
      map.removeLayer(resultMarker.value);
    };

    const closeGeoError = () => {
      geoErrorMsg.value = null;
      geoError.value = null;
    };

    const searchResults = ref(null);
    const toggleSearchResults = () => {
      searchResults.value = !searchResults.value;
    };
    const closeSearchResults = () => {
      searchResults.value = null;
    };

    return {
      geoError,
      closeGeoError,
      geoErrorMsg,
      fetchCoords,
      coords,
      getGeolocation,
      plotResult,
      searchResults,
      toggleSearchResults,
      closeSearchResults,
      removeResult,
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
