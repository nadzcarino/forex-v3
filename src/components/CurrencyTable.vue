<template>
  <div>
    <img :src="`https://www.countryflags.io/${base.substr(0, 2)}/flat/64.png`" />
    <h1>{{base}}</h1>
    
    <select v-model="base" @change="getCurrencyExchange">
      <option
        :value="currency.code"
        v-for="(currency, index) in baseCurrency"
        :key="index"
      >{{ currency.name }}</option>
    </select>
    <input type="number" v-model="amount" />

    <table class="table table-bordered table-sm table-dark table-hover">
      <thead>
        <tr>
          <th>Country</th>
          <th>Code</th>
          <th>Currency</th>
          <th>Exchange Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(datum, index) in data" :key="index">
          <td>
            <img :src="`${datum.flag}`" alt />
          </td>
          <td>{{ datum.code }}</td>
          <td>{{ datum.currency }}</td>
          <td>{{ (datum.rate * amount).toFixed(3) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import BaseCurrency from "../assets/base_currency";
export default {
  name: "CurrencyTable",
  data() {
    return {
      baseCurrency: BaseCurrency.base_currency,
      amount: 1,
      base: "PHP",
      date: "",
      data: ""
    };
  },
  created() {
    this.getCurrencyExchange();
  },

  methods: {
    getCurrencyExchange() {
      this.data = [];
      axios
        .get(`https://api.exchangeratesapi.io/latest?base=${this.base}`)
        .then(response => {
          let currency_rates = Object.entries(response.data.rates);
          console.log(currency_rates.length);
          currency_rates.forEach(rate => {
            let obj = {};
            obj.code = rate[0];
            obj.rate = rate[1];
            obj.flag = this.getCountryFlag(obj.code.substr(0, 2));
            obj.currency = this.getCurrency(obj.code.substr(0, 3));
            this.data.push(obj);
          });
        })
        .catch(error => console.log(error));
    },
    getCountryFlag(code) {
      return `https://www.countryflags.io/${code}/flat/32.png`;
    },
    getCurrency(code) {
      let currency = "---";
      this.baseCurrency.forEach(base => {
        if (base.code === code) {
          currency = base.name;
        }
      });

      return currency;
    }
  }
};
</script>