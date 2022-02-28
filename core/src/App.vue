<script lang="ts">
import LazyList from "./components/LazyList.vue";
import { reactive, defineComponent, onMounted } from "vue";
import * as hp from "helper-js";

export default defineComponent({
  components: { LazyList },
  data() {
    return {
      items: new Array(1000).fill(1).map((v) => ({
        text: hp.randString(3),
        lineHeight: 20 + hp.randInt(1, 10) + "px",
        width: 100 + hp.randInt(1, 30) + "px",
      })),
      xx: 1,
    };
  },
  mounted() {},
});
</script>

<template>
  <div>
    <!-- horizontal -->
    <LazyList
      ref="lazyList"
      :items="items"
      :firstRender="xx"
      style="width: 1000px"
      horizontal
    >
      <template #default="{ item, index }">
        <h2 style="border: 1px solid #ccc" :style="{ width: item.width }">
          ITEM: {{ index }} - {{ item["text"] }}
        </h2>
      </template>
    </LazyList>
    <!-- vertical -->
    <LazyList
      ref="lazyList"
      :items="items"
      :firstRender="xx"
      style="height: 600px"
    >
      <template #default="{ item, index }">
        <h2
          style="border: 1px solid #ccc"
          :style="{ lineHeight: item.lineHeight }"
        >
          ITEM: {{ index }} - {{ item["text"] }}
        </h2>
      </template>
    </LazyList>
    <LazyList
      ref="lazyList"
      :items="items"
      :firstRender="xx"
      style="height: 600px"
    >
      <template #default="{ item, index }">
        <h2
          style="border: 1px solid #ccc"
          :style="{ lineHeight: item.lineHeight }"
        >
          ITEM: {{ index }} - {{ item["text"] }}
        </h2>
      </template>
    </LazyList>
  </div>
</template>

<style></style>
