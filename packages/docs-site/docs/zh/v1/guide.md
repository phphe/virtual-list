# 教程

## 安装

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

## 引入

```ts
// vue3
import VirtualList from '@virtual-list/vue3'
// vue2
import VirtualList from '@virtual-list/vue2'
```

## props

### items

- 类型: `Array as PropType<any[]>`

- 要显示的数组数据.

### disabled

- 类型: Boolean
- 禁用. 禁用时, 列表项将全部渲染.

### horizontal

- 类型: Boolean
- 横向显示.

### firstRender

- 类型: Number. 默认: 10
- 初始渲染条数. 用于 ssr

### buffer

- 类型: Number. 默认: 100
- 缓冲距离. 超出滚动盒的可显示距离.

### itemKey

- 类型: `[String, Function] as PropType< "index" | ((item: any, index: number) => any) >`
- 设置每项的 key. 默认没有 key. 可以是`index`, 代表用数组 index 作 key. 也可以是一个返回 key 的方法.

### table

- 类型: Boolean
- 表格模式.

### itemSize

- 类型: `Function as PropType< (item: any, index: number) => number | null | undefined | void >`
- 返回每项的高度或宽度(横向显示时). 不推荐使用, 因为会自动获取实时尺寸.

## 例子

### 横向

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

### 纵向

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

### 表格

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
