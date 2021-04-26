import Vue from "vue";
import App from "./App.vue";
import "@/assets/css/tailwind.css"; // Importamos tailwind.css
// Importamos grafica
import Chartkick from "vue-chartkick";
import Chart from "chart.js";
// Importamos la animacion de carga
import { VueSpinners } from "@saeris/vue-spinners";

import router from "@/router"; // Importamos Router
import { dollarFilter, porcentFilter } from "@/filters";

Vue.use(Chartkick.use(Chart));
Vue.use(VueSpinners);

Vue.filter("dollar", dollarFilter);
//Llamamos a la funcion de Vue filter y le doy el nombre del filtro(dollar) para decirle que se va ajecutar la funcion dollarFilter, cada vez que llame a ese filtro
Vue.filter("porcent", porcentFilter);
Vue.config.productionTip = false;

new Vue({
  router: router, // Le decimos a Vue que use router
  render: (h) => h(App),
}).$mount("#app");
