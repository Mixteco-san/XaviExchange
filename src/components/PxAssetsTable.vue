<template>
  <table class="container">
    <thead>
      <tr class="bg-gray-100 border-b-2 border-gray-400">
        <th></th>
        
        <th :class="{ up: this.sortOrder == 1, down: this.sortOrder == -1 }">
        <!-- Se aplica la clase up cuando sortOrder sea igual a 1 y down cuando sea -1 -->
          <span @click="changeSortOrder" class="underline cursor-pointer">
            <!-- Agregamos un evento cuando se clickee el ranking -->
            Ranking
          </span>
        </th>

        <th>Nombre</th>
        <th>Precio</th>
        <th>Cap. de Mercado</th>
        <th>Variación 24hs</th>
        
        <td class="hidden sm:block">
          <input
            class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
            id="filter"
            placeholder="Buscar..."
            type="text"
            v-model="filter"
          />
          <!-- Hacemos que tenga coincidencias en el simbolo o el nombre, ver la funcion computed -->
        </td>
      </tr>
    </thead>
    <!-- Los datos tbody nos los traemos de la API -->
    <tbody>
      <tr
        v-for="a in filteredAssets"
        v-bind:key="a.id"
        class="border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100"
      >
        <td>
          <img
            class="w-6 h-6"
            :src="`https://static.coincap.io/assets/icons/${a.symbol.toLowerCase()}@2x.png`"
            :alt="a.name"
          />
          <!-- :src, :key, :alt, es lo mismo que haber puesto v-bind:src, v-bind:key, v-bind:alt -->
        </td>

        <td>
          <b>#{{ a.rank }}</b>
        </td>

        <td>
          <router-link
            class="hover:underline text-green-700"
            :to="{ name: 'coin-detail', params: { id: a.id } }"
          >
            <!-- Nos linkeamos por un objeto -->
            {{ a.name }}
          </router-link>

          <small class="ml-1 text-gray-500">
            {{ a.symbol }}
          </small>
        </td>

        <td>
          {{ a.priceUsd | dollar }}
          <!-- | dollar: es para aplicar el filtro -->
          <!-- Los filtros dejan los valores originales sin modificarlos pero en la pantalla se muestra otra cosa -->
        </td>

        <td>
          {{ a.marketCapUsd | dollar }}
        </td>

        <td
          :class="
            a.changePercent24Hr.includes('-')
              ? 'text-red-600'
              : 'text-green-600'
          "
        >
          {{ a.changePercent24Hr | porcent }}
        </td>

        <td class="hidden sm:block">
          <px-button @custom-click="goToCoin(a.id)">
            <!-- Usamos el boton que creamos -->
            <span>Detalle</span>
          </px-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import PxButton from "@/components/PxButton";

export default {
  name: "PxAssetsTable",

  components: { PxButton },

  data() {
    return {
      filter: '',
      sortOrder: 1
    }
  },

  props: {
    assets: {
      type: Array,
      default: () => [], //default es un metodo para crear una array por medio de una funcion es obligatorio para crear arrays así
    },
  },

  methods: {
    //Recive la moneda
    goToCoin(id) {
      this.$router.push({ name: "coin-detail", params: { id } });
      // Accedemos a la instancia del router para navegar dentro de él
      // Con push() empujamos una nueva ruta
    },

    changeSortOrder() {
      this.sortOrder = this.sortOrder == 1 ? -1 : 1
    }
  },

  // Para hacer funcionar la barra de busqueda y el ranking
  computed: {
    // Vamos a filtrar los Assets siempre que filter tenga un valor
    filteredAssets() {
      
      // if( !this.filter ) {
      //   return this.assets
      // } La eliminamos porque esta en funcion de sortOrder y no es necesaria proque de esto se encarga el filtro y sortOrder
      // Si filter no contiene nada, devuelve assets

      const altOrder = this.sortOrder == 1 ? -1 : 1
      //altOrder es lo contrario a sortOrder
      // Si sortOrder es igual a 1, conviertelo en menos uno, si no, asiganle 1 y pasalo a altOrder

      return this.assets.filter(
        a => 
          a.symbol.toLowerCase().includes( this.filter.toLowerCase() ) ||
          a.name.toLowerCase().includes( this.filter.toLowerCase() )
        // Usamos la version nativa de los arrays para decir:
        // Si alguno de los elementos dentro de assets coincide en su propiedad symbol 
        // con lo que esta dentro de la propiedad filter, devuelve todos esos elementos 
        // Hacemos lo mismo para assetes con propiedad name 
        // ToLowerCase: Para evitar descoincidencias dentro del upercase o lowercase       
      )

      // Para hacer funcionar el ranking
      .sort( (a, b) => {
        // .sort es una funciona nativa prdena los elementos de un array y devuelve el arreglo ordenado
        if( parseInt(a.rank) > parseInt(b.rank) ) {
          return this.sortOrder
        }
        // Si el elemento a es mayor que b devuelve 1
        // Usamos parseInt para asegurar que rank nos llega un entero en vez de un string
        
        return altOrder
      } )
    }
  },
};
</script>

<style scoped>
.up::before {
  content: "🔺";
}

.down::before {
  content: "🔻";
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
