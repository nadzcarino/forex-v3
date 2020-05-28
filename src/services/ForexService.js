import axios from "axios";

const BASE_URL = "https://api.exchangeratesapi.io/latest?base=";
export default class ForexService {
  getData(code) {
    return axios.get(BASE_URL + code);
  }
}
