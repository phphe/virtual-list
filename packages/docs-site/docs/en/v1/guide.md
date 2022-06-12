# Guide

## Install

### npm

```sh
# Vue3
npm i --save @virtual-list/vue3
# Vue2
npm i --save @virtual-list/vue2
```

### CDN

```html
<!-- vue3 -->
<script src="https://unpkg.com/@virtual-list/vue3/dist/index.iife.js"></script>
<!-- vue2 -->
<script src="https://unpkg.com/@virtual-list/vue2/dist/index.iife.js"></script>

<script>
  var vlist = virtualListVue
</script>
```

## Import

```ts
// vue3
import VirtualList from '@virtual-list/vue3'
// vue2
import VirtualList from '@virtual-list/vue2'
```

## props

### items

- Type: `Array as PropType<any[]>`

- The array data to display.

### disabled

- Type: Boolean
- When disabled, all items are rendered like a normal html list.

### horizontal

- Type: Boolean
- Display horizontally.

### firstRender

- Type: Number. Default: 10
- Render count at start. For ssr.

### buffer

- Type: Number. Default: 100
- Visible area + buffer area = render area.

### itemKey

- Type: `[String, Function] as PropType< "index" | ((item: any, index: number) => any) >`
- Set the `key` for each item. No key by default. Can be string `index`, use index as key. Can be a function which return the key.

### table

- Type: Boolean
- Render as table.

### itemSize

- Type: `Function as PropType< (item: any, index: number) => number | null | undefined | void >`
- Return height/width of each item. Not recommended, beacause it can get runtime size automatically.

## Examples

### Horizontal

```vue
<template>
  <v-list :items="items" style="width: 1000px" horizontal>
    <template #default="{ item, index }">
      <h2 style="border: 1px solid #ccc" :style="{ width: item.width }">
        ITEM: {{ index }} - {{ item['text'] }}
      </h2>
    </template>
  </v-list>
</template>
<script>
  import VirtualList from '@virtual-list/vue3'

  export default {
    components: { 'v-list': vList },
    data() {
      return {
        items: new Array(1000).fill(1).map((v, i) => ({
          text: 'Item ' + i,
          lineHeight: 20 + (i % 20) + 'px',
          width: 100 + (i % 30) + 'px',
        })),
      }
    },
  }
</script>
```

<div class="grid md:grid-cols-2 gap-4">
<div>

### Vertical

```vue
<template>
  <v-list :items="items" style="height: 600px">
    <template #default="{ item, index }">
      <h2
        style="border: 1px solid #ccc"
        :style="{ lineHeight: item.lineHeight }"
      >
        ITEM: {{ index }} - {{ item['text'] }}
        <input />
      </h2>
    </template>
  </v-list>
</template>
<script>
  import VirtualList from '@virtual-list/vue3'

  export default {
    components: { 'v-list': vList },
    data() {
      return {
        items: new Array(1000).fill(1).map((v, i) => ({
          text: 'Item ' + i,
          lineHeight: 20 + (i % 20) + 'px',
          width: 100 + (i % 30) + 'px',
        })),
      }
    },
  }
</script>
```

</div>

<div>

### Table

```vue
<template>
  <v-list :items="items" table class="list-table">
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
        <td>ITEM: {{ index }} - {{ item['text'] }}</td>
      </tr>
    </template>
  </v-list>
</template>
<script>
  import VirtualList from '@virtual-list/vue3'

  export default {
    components: { 'v-list': vList },
    data() {
      return {
        items: new Array(1000).fill(1).map((v, i) => ({
          text: 'Item ' + i,
          lineHeight: 20 + (i % 20) + 'px',
          width: 100 + (i % 30) + 'px',
        })),
      }
    },
  }
</script>
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
```

</div>

</div>
