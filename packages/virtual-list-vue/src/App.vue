<script lang="ts">
import vList from "./components/VirtualList.vue";
import { reactive, defineComponent, onMounted } from "vue";

export default defineComponent({
  components: { "v-list": vList },
  data() {
    return {
      items: new Array(1000).fill(1).map((v, i) => ({
        text: "Item " + i,
        lineHeight: 20 + (i % 20) + "px",
        width: 100 + (i % 30) + "px",
      })),
    };
  },
  mounted() {},
});
</script>

<template>
  <div>
    <!-- horizontal -->
    <h1>horizontal</h1>
    <v-list
      ref="list"
      :items="items"
      :first-render="10"
      style="width: 1000px"
      horizontal
    >
      <template #default="{ item, index }">
        <h2 style="border: 1px solid #ccc" :style="{ width: item.width }">
          ITEM: {{ index }} - {{ item["text"] }}
        </h2>
      </template>
    </v-list>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px">
      <div>
        <!-- vertical -->
        <h1>vertical</h1>
        <v-list
          ref="list"
          :items="items"
          :first-render="10"
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
        </v-list>
      </div>
      <div>
        <h1>vertical with key</h1>
        <v-list
          ref="list"
          :items="items"
          :first-render="10"
          style="height: 600px"
          itemKey="index"
        >
          <template #default="{ item, index }">
            <h2
              style="border: 1px solid #ccc"
              :style="{ lineHeight: item.lineHeight }"
            >
              ITEM: {{ index }} - {{ item["text"] }}
              <input />
            </h2>
          </template>
        </v-list>
      </div>
      <div>
        <h1>table</h1>
        <v-list
          ref="list"
          :items="items"
          :first-render="10"
          style="height: 600px"
          table
          class="list-table"
        >
          <template #prepend>
            <thead>
              <tr>
                <th>Text</th>
                <th>Index</th>
              </tr>
            </thead>
          </template>
          <template #default="{ item, index }">
            <tr>
              <td>{{ index }}</td>
              <td>ITEM: {{ index }} - {{ item["text"] }}</td>
            </tr>
          </template>
        </v-list>
      </div>
    </div>
  </div>
</template>

<style>
.list-table table,
.list-table td,
.list-table th {
  border: 1px solid #ccc;
}
.list-table table {
  border-collapse: collapse;
  width: 100%;
}
</style>
