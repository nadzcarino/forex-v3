import axios from "axios";

export default class ForexService {
  getData(code) {
    return axios.get(`https://api.exchangeratesapi.io/latest?base=${code}`);
  }
}
