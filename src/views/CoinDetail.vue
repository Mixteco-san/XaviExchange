<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <grid-loader :loading="isLoading" :color="'#68d391'" :size="50" />
    </div>

    <template v-if="!isLoading">
      <!-- Se muestra el contenido cuando se cumple la condicion -->
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <!-- La URL en SRC nos trae la imagen desde la API -->

          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">
              {{ asset.symbol }}
            </small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span> {{ asset.rank }} </span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span> {{ asset.priceUsd | dollar }} </span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span> {{ min | dollar }} </span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span> {{ max | dollar }} </span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span> {{ avg | dollar }} </span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span> {{ asset.changePercent24Hr | porcent }} </span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  @click="toggleConverter">
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input v-model="convertValue"
                     id="convertValue"
                     type="number"
                     :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
                     class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal" />
            </label>
          </div>

          <span class="text-xl">
            {{ convertResult }} {{ fromUsd ? ` ${asset.symbol}` : ` USD` }}
          </span>
        </div>
      </div>

      <line-chart
        class="my-10"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      >
        <!-- Ver documentacion para Vue2 como usar las directivas
             Cambiamos color, usamos el precio maximo y minimo segun el historial que ocupamos en computed()  
             En data importamos la informacion que necesitamos renderizar
             .map mapeamos los elementos como prevencion para que la informacion lleguen correctamente sin error indeseados
             Mapeamos cada uno de los elementos y los pasamos a un arrary  
             Se devuleve un array por cada elemento del historial. tomamos su fecha y su precio convertido a flotante redondeado a 2 decimales.
             Se usa para mostrar la grafica correctamente -->
      </line-chart>

      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>

      <table class="w-full">
        <tr
          v-for="m in markets"
          :key="`${m.exchangeId}-${m.priceUsd}`"
          class="border-b"
        >
          <!-- m in markets es para mostrar los registros de los mercados 
          :key pasamos una composicioon entre el nombre del Exchange y el valor del Echange
          Hay diferentes Exchanges pero puede venir el mismo Echange con su ID pero con una moneda diferente pro eso lo escribimos así-->
          <td>
            <b>
              {{ m.exchangeId }}
            </b>
          </td>

          <td>
            {{ m.priceUsd | dollar }}
          </td>

          <td>
            {{ m.baseSymbol }} / {{ m.quoteSymbol }}
            <!-- Simbolo de la moneda principal y el simbolo de la moneda de cambio -->
          </td>

          <td>
            <!-- Hacemos que se muestre la URL en vez del boton -->
            <px-button
              v-if="!m.url"
              @custom-click="getWebSite(m)"
              :is-loading="m.isLoading || false"
            >
              <!-- Le pasamos "m" a la funcion, que representa el Exchange dentro del array de Markets
              El boton solo se va a mostrar si el Market NO tiene URL -->
              <slot>Obtener Link</slot>
            </px-button>

            <a v-else class="hover:underline text-green-600" target="_blanck">
              <!-- Si el Market tiene URl es mostrar est el valor de m.url o la URL completa -->
              {{ m.url }}
            </a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<!--           ------------ SCRIPTS -----------            -->

<script>
import api from "@/api";
import { GridLoader } from "@saeris/vue-spinners";
import PxButton from "@/components/PxButton";

export default {
  name: "CoinDetail",

  data() {
    return {
      asset: {},
      history: [],
      isLoading: false,
      markets: [],
      fromUsd: true,
      convertValue: null
    };
  },

  components: { GridLoader, PxButton },

  //Calculando los precios que se muestran en detalle
  computed: {
    convertResult() {
      if( !this.convertValue) {
        return 0
      }
      // Si no es vacio va a checar que estamos convertiendo
      const result = this.fromUsd ? this.convertValue / this.asset.priceUsd :
      this.convertValue * this.asset.priceUsd
      // Si this.fromUsd es true vamos a hacer convertValue entre priceUsd
      // si no, vamos a multiplicar sus valores

      return result.toFixed(4)  
    },

    //Precio mas bajo
    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
        // ... Tomamos el array de history mapeado, obtiene cada precio en dolares para que Math.min() obtenga el valor minimo
      );
    },

    //Precio mas alto
    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
        // h representa como en for-each, cada elemento de ese array
      );
    },

    //Promedio
    avg() {
      return Math.abs(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
        // parseFloat: Convierte un argumento de tipo cadena y devuelve un número de punto flotante.
        // parseFloat se usa como prevencion  para convertir sus valores en flotantes
      );
    },
  },

  //Desde aquí llamamos a las funciones
  created() {
    this.getCoin();
  },

  // Se crea las funciones las cuales van a encargarse de obtener la informacion de la API
  methods: {
    //Llamamos a la API para recibier el exchange y que funcione button
    getWebSite(exchange) {
      // Hacemos funcionar el loader de los botones
      this.$set(exchange, "isLoading", true);

      // Solicitamos la URl a la API
      return (
        api
          .getExchange(exchange.exchangeId)
          .then((res) => {
            // Le pasamos dentro del objeto echange solamente el exchangeId
            // exchange.url = res.exchangeUrl;
            // Cuando se resulva y nos de la respuesta, vamos a asignarle el valor de la URL al excvhange local
            // Eliminamos esta funcion para agregarla con solucion de Reactivdad
            this.$set(exchange, "url", res.exchangeUrl);
            // Solucion de Reactividad
          })
          // Apagamos el loader
          .finally(() => {
            this.$set(exchange, "isLoading", false);
          })
      );
    },

    // Ponemos getCoin como un funcion aislada para que pueda ser invodada tanto po watch, como por created
    getCoin() {
      // Accedemos al parametro id
      const id = this.$route.params.id;
      //Agregamos el loading
      this.isLoading = true;

      //Promesa que permite ejecutar diferentes promises de manera simulatanea atraves de un array y manejar la respuesta cuando todas las promesas allan terminado
      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id),
      ])
        .then(([asset, history, markets]) => {
          // Se mapea el array
          this.asset = asset;
          // Obtenemos los detalles de la criptomonedas para mostrarlos
          this.history = history;
          // Obtenemos el historial de la criptomoneda
          this.markets = markets;
        })
        .finally(() => (this.isLoading = false));
      //Apagamos el loading
    },

    // Convertimos el valor de fromUsd al contrario
    toggleConverter() {
      this.fromUsd = !this.fromUsd
    }
  },

  //  Escuchamos los cambios sobre los 3 links de criptomonedas principales
  watch: {
    $route() {
      this.getCoin()
      //getCoin nos dirije a los detalles de cada moneda
    }
  }
};
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>