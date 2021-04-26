<template>
  <div>
    <div class="flex justify-center">
      <grid-loader :loading="isLoading" :color="'#68d391'" :size="50" />
    </div>

    <px-assets-table v-if="!isLoading" v-bind:assets="assets" />
    <!-- v-if="!isLoading" La tabla se va a mostrar cuando el pacman-loader este apagado -->
  </div>
</template>

<script>
import api from "@/api";
import PxAssetsTable from "@/components/PxAssetsTable";
// import PxAssetsTable from '../components/PxAssetsTable.vue';
// Con @ haces referencia al mismo lugar, por lo que no tienes que poner ../
import { GridLoader } from "@saeris/vue-spinners";
// exportamos el GridLoader

export default {
  name: "Home",
  components: { PxAssetsTable, GridLoader },

  data() {
    return {
      isLoading: false,
      assets: [],
    };
  },

  created() {
    this.isLoading = true;

    api
      .getAssets()
      .then((assets) => (this.assets = assets))
      .finally(() => (this.isLoading = false));
    // Usar finally es que se va a ejecutar y apagar automaaticamente, con y sin errores
    // La otra ventaja es que así cargamos la informacion mientras se esta cargando la página
  },
};
</script>
