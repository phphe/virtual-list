# 教程

## 安装

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

## 引入

```ts
// vue3
import VirtualList from '@virtual-list/vue'
// vue2
import VirtualList from '@virtual-list/vue/vue2'
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

受本站全局 css 影响, 例子的样式与实际样式有细微差别.

### 横向

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

### 纵向

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

### 表格

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
