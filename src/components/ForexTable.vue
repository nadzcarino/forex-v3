<template>
  <div>
    <div class="p-field p-col-12 p-md-12" v-if="!loaded">
      <p>Please wait while fetching data ......</p>
      <ProgressSpinner />
    </div>
    <div class="p-fluid p-grid" v-if="loaded">
      <DataTable :value="filteredData" :paginator="true" :rows="5" selectionMode="single">
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
                :disable="offline"
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
                @change="filterData"
              ></Dropdown>
            </div>
            <div>
              <label for>Amount</label>
              <InputNumber v-model="amount" :value="amount" showButtons />
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
    </div>
  </div>
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
      offline: Boolean,
      loaded: false
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
            this.loaded = true;
          })
          .catch(error => console.log(error));
      } else {
        alert(
          "You are either offline or connection to API is limited. We will display the offline data instead."
        );
        this.forexData = this.filteredData = JSON.parse(
          localStorage.getItem("forexData")
        );
        this.loaded = true;
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
        obj.rate = arr[1];
        data.push(obj);
      });
      return data;
    },
    filterData() {
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