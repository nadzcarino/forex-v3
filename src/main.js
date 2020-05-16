import Vue from "vue";
import App from "./App.vue";

import "primevue/resources/themes/nova-light/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

//components
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import AutoComplete from "primevue/autocomplete";

Vue.config.productionTip = false;

Vue.component("Dropdown", Dropdown);
Vue.component("InputNumber", InputNumber);
Vue.component("Button", Button);
Vue.component("DataTable", DataTable);
Vue.component("Column", Column);
Vue.component("AutoComplete", AutoComplete);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
