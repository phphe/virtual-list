<template>
  <table v-if="table">
    <slot name="prepend"></slot>
    <tbody>
      <slot></slot>
    </tbody>
    <slot name="append"></slot>
  </table>
  <div v-else>
    <slot name="prepend"></slot>
    <slot></slot>
    <slot name="append"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  props: {
    table: Boolean,
  },
});
</script>
