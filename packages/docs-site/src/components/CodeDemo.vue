<template>
  <div class="relative code-demo">
    <div v-show="tab === 'demo'">
      <slot />
    </div>
    <pre
      v-show="tab === 'code'"
      class="language-vue"
    ><code>{{ code }}</code></pre>
    <div class="absolute right-2 -top-8">
      <VIconMDI
        :icon="mdiPreview"
        :size="22"
        :class="
          tab === 'demo'
            ? 'text-primary-500'
            : 'cursor-pointer hover:text-primary-400'
        "
        title="Demo"
        @click.native="tab = 'demo'"
      />
      <VIconMDI
        :icon="mdiCode"
        :size="22"
        :class="
          tab === 'code'
            ? 'text-primary-500'
            : 'cursor-pointer hover:text-primary-400'
        "
        title="Code"
        @click.native="tab = 'code'"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, PropType, defineComponent } from 'vue-demi'
  import { mdiCode, mdiPreview } from 'mdi-js/filled'

  export default defineComponent({
    props: {
      code: String,
    },
    data() {
      return {
        tab: 'demo',
        mdiCode,
        mdiPreview,
      }
    },
  })
</script>

<style lang="scss">
  .code-demo {
    > pre {
      margin-top: 0;
    }
  }
</style>
