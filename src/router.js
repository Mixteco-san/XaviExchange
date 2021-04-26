import Vue from "vue";
// Importamos la instancia de Vue
import VueRouter from "vue-router";
// Importamos la instancia de Router

import Home from "@/views/Home";
// Importamos componente Home agregando su dirección
import About from "@/views/About";
import Error from "@/views/Error";

import CoinDetail from "@/views/CoinDetail";

Vue.use(VueRouter);
// Le decimos a Vue que use utilice el Router
// .use: Es una funcion de vue que nos permite instalar plugins o utilidades que tiene la libreria
// Asi se agregan funcionalidades

export default new VueRouter({
  // Exportamos una nueva instancia de Router
  mode: "history",
  // mode: Utiliza el modo history de html

  // Creamos un array de rutas, donde cada ruta es representada por un objeto
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    // Los routes son el nombre e las URL a las cuales te vas a reedirigir cuando clickees sobre la página
    {
      path: "/about",
      name: "about",
      component: About,
    },
    {
      path: "*",
      // * Lo usamos para una URL que no existe
      name: "Error",
      component: Error,
    },
    {
      path: "/coin/:id",
      // Se crea ina ruta dinamica con :id
      //:id Para hacer referencia a un parametro dinamico
      // Los : indican que es un parametro
      name: "coin-detail",
      component: CoinDetail,
    },
  ],
});
