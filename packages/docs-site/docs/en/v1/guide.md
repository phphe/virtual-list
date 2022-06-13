# Guide

## Install

### npm

```sh
# Vue3
npm i --save @virtual-list/vue
# Vue2
npm i --save @virtual-list/vue @vue/composition-api
```

### CDN

- Vue3: [example](https://github.com/phphe/virtual-list/blob/main/examples/iife/vue3.html)
- Vue2: [example](https://github.com/phphe/virtual-list/blob/main/examples/iife/vue2.html)

## Import

```ts
// vue3
import VirtualList from '@virtual-list/vue'
// vue2
import VirtualList from '@virtual-list/vue/vue2'
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

Affected by the global CSS of this site, the style of the example is slightly different from the actual style.

### Horizontal

<!-- code & demo -->

```vue
<template>
  <v-list :items="items" horizontal>
    <template #default="{ item, index }">
      <div style="border: 1px solid #ccc" :style="{ width: item.width }">
        ITEM: {{ index }} - {{ item['text'] }}
      </div>
    </template>
  </v-list>
</template>
<script>
  import VirtualList from '@virtual-list/vue'

  export default {
    components: { 'v-list': VirtualList },
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

<!-- code & demo -->

```vue
<template>
  <v-list :items="items" style="height: 600px">
    <template #default="{ item, index }">
      <div
        style="border: 1px solid #ccc"
        :style="{ lineHeight: item.lineHeight }"
      >
        ITEM: {{ index }} - {{ item['text'] }}
      </div>
    </template>
  </v-list>
</template>
<script>
  import VirtualList from '@virtual-list/vue'

  export default {
    components: { 'v-list': VirtualList },
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

<!-- code & demo -->

```vue
<template>
  <v-list :items="items" table class="list-table" style="height: 600px">
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
  import VirtualList from '@virtual-list/vue'

  export default {
    components: { 'v-list': VirtualList },
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
