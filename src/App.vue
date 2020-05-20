<template>
  <div id="app">
    <Navigation />
    <CurrencyTable />
    <!-- <ForexTable v-if="loaded" :forexData="data" /> -->
  </div>
</template>

<script>
import Navigation from "./components/Navigation";
//import ForexTable from "./components/ForexTable";
import CurrencyTable from "./components/CurrencyTable";
import SupportedPairs from "./assets/supported_pairs";
import axios from "axios";

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export default {
  name: "App",
  components: {
    Navigation,
    CurrencyTable
    //ForexTable,

  },
  data() {
    return {
      loaded: false,
      data: null
    };
  },

  created() {
    let supported_pairs = SupportedPairs.supportedPairs.join(",");
    this.loaded = false;
    if (navigator.onLine) {
      axios
        .get(
          `${CORS_PROXY}https://www.freeforexapi.com/api/live?pairs=${supported_pairs}`
        )
        .then(response => {          
          this.data = Object.entries(response.data.rates);  
          localStorage.setItem("forexData", response.data);
          this.loaded = true;
        })
        .catch(error => console.log(error));
    } else {
      this.data = [1, 2, 3, 4, 5];
      this.loaded = true;
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
