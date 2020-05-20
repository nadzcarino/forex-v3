<template>
  <table class="table table-bordered table-sm table-dark table-hover">
    <thead>
      <tr>
        <th colspan="2">Countries</th>
        <th colspan="2">Currency</th>
        <th>Exchange Rate</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(datum, index) in data" :key="index">
        <td>
          <img :src="`${datum.baseFlag}`" />
        </td>
        <td>
          <img :src="`${datum.targetFlag}`" />
        </td>
        <td>{{ datum.base }}</td>
        <td>{{ datum.target }}</td>
        <td>{{datum.rate}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "ForexTable",
  props: ["forexData"],
  data() {
    return {
      data: null
    };
  },

  mounted() {
    this.data = [];
    this.forexData.forEach(datum => {
      let obj = {};
      obj.base = datum[0].substr(0, 3);
      obj.baseFlag = this.getCountryFlag(datum[0].substr(0, 2));
      obj.target = datum[0].substr(3, 3);
      obj.targetFlag = this.getCountryFlag(datum[0].substr(3, 2));
      obj.rate = datum[1].rate.toFixed(2);

      this.data.push(obj);
    });
  },
  methods: {
    getCountryFlag(code) {
      let baseUrl;
      if (navigator.onLine) {
        baseUrl = `https://www.countryflags.io/${code}/flat/32.png`;
      } else {
        baseUrl = "../assets/No_flag.svg.png";
      }

      return baseUrl;
    }
  }
};
</script>