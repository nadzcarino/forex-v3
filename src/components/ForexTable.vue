<template>
  <DataTable :value="filteredData" :paginator="filteredData" :rows="5" selectionMode="single">
    <template #header>
      <div class="header">
        <div>
          <label for>BASE</label>
          <Dropdown
            v-model="baseCode"
            :options="baseCurrency"
            optionLabel="name"
            :filter="true"
            style="width:200px"
            :disabled="offline"
          ></Dropdown>
        </div>
        <div>
          <label for>Target</label>
          <Dropdown
            v-model="targetCode"
            :options="forexData"
            optionLabel="currency"
            :filter="true"
            :showClear="true"
            placeholder="Select Target Currency"
            style="width:200px"
            @change="test"
          ></Dropdown>
        </div>
        <div>
          <label for>Amount</label>
          <InputNumber v-model="amount" :value="amount"/>
        </div>
      </div>
      <p v-if="offline">No internet connection</p>
    </template>
    <Column field="country" header="Country" :sortable="true">
      <template #body="slotProps">
        <img :src="slotProps.data.country" :alt="slotProps.data.country" width="48px" />
      </template>
    </Column>
    <Column field="code" header="Code" :sortable="true"></Column>
    <Column field="currency" header="Currency" :sortable="true"></Column>
    <Column field="rate" header="Base Exchange Rate" :sortable="true"></Column>
    <Column header="Exchange" :sortable="true">
      <template #body="slotProps">
        <p>{{ slotProps | exchangeRate(amount) }}</p>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import ForexService from "../services/ForexService";
import { base_currency } from "../assets/base_currency";

export default {
  data() {
    return {
      baseCode: null,
      targetCode: null,
      amount: 1,
      forexData: null,
      filteredData: null,
      baseCurrency: null,
      offline: Boolean
    };
  },
  forexService: null,

  created() {
    this.baseCode = { code: "PHP", name: "Philippine peso" };
    this.baseCurrency = base_currency;
    this.forexService = new ForexService();
  },
  mounted() {
    this.getForexData();
  },
  methods: {
    getForexData() {
      if (navigator.onLine) {
        this.offline = false;
        this.forexService
          .getData(this.baseCode.code)
          .then(response => {
            this.forexData = this.filteredData = this.createObject(response);
            localStorage.setItem("forexData", JSON.stringify(this.forexData));
          })
          .catch(error => console.log(error));
      } else {
        this.forexData = this.filteredData = JSON.parse(
          localStorage.getItem("forexData")
        );
      }
    },
    createObject(response) {
      let data = [];
      let array = Object.entries(response.data.rates);
      array.forEach(arr => {
        let obj = {};
        obj.country = `https://www.countryflags.io/${arr[0].substr(
          0,
          2
        )}/flat/32.png`;
        obj.code = arr[0];
        obj.currency = this.baseCurrency.filter(
          base => base.code === arr[0]
        )[0].name;
        obj.rate = arr[1] === 1 ? arr[1] : arr[1].toFixed(3);
        data.push(obj);
      });
      return data;
    },
    test() {
      if (this.targetCode) {
        this.filteredData = this.forexData.filter(
          base => base.code === this.targetCode.code
        );
      } else {
        this.filteredData = this.forexData;
      }
    }
  },
  watch: {
    baseCode() {
      this.getForexData();
    }
  },
  filters: {
    exchangeRate(slotProps, amount) {
      let rate = Number(slotProps.data.rate);
      return (rate * amount).toFixed(3);
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-around;
}
label {
  display: block;
  margin: 10px;
}
</style>