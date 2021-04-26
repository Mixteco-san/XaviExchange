<template>
  <button
    class="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-2 border border-green-500 hover:border-transparent rounded"
    @click="buttonClick"
  >
    <!--El @ es lo mismo que esto v-on:click="buttonClick" -->

    <beat-loader
      :loading="isLoading"
      :color="'#68d391'"
      :size="8"
    ></beat-loader>
    <!-- El loader se muestra cuando  isLoading sea true-->
    <slot v-if="!isLoading"></slot>
    <!-- El slot se muestra cuando isLoading es false -->
  </button>
</template>

<script>
import { BeatLoader } from "@saeris/vue-spinners";

export default {
  name: "PxButton",

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    // Agregamos valores predeterminados de isLoading
    // Ir a la tabla de mejores ofertas de cambio en CoinDetail ahí hacemos que funcione el boton
  },

  comments: { BeatLoader },

  methods: {
    buttonClick() {
      this.$emit("custom-click");
      //$emit: emitimos un evento al pucharlo
      //El padre podrá manejar el evento interno de este boton
    },
  },
};
</script>
