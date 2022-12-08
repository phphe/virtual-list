<template>
  <div
    class="vtlist"
    ref="listElRef"
    :style="listStyle"
    @scroll.passive="onscroll"
  >
    <VirtualListTable
      class="vtlist-inner"
      ref="listInnerRef"
      :style="listInnerStyle"
      :table="table"
    >
      <template #prepend>
        <slot name="prepend"></slot>
      </template>
      <template v-if="disabled">
        <template v-for="(item, index) in items" :key="getItemKey(item, index)">
          <slot :item="item" :index="index" />
        </template>
      </template>
      <template v-else>
        <template
          v-for="{ item, index } in visibleItemsInfo"
          :key="getItemKey(item, index)"
        >
          <slot :item="item" :index="index" />
        </template>
      </template>
      <template #append> <slot name="append"></slot> </template>
    </VirtualListTable>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  onMounted,
  nextTick,
  PropType,
  defineComponent,
  isVue2,
  isVue3,
  reactive,
  watch,
} from "vue-demi";
import * as hp from "helper-js";
import { Accumulate } from "helper-js";
import VirtualListTable from "./VirtualListTable.vue";

const cpt = defineComponent({
  components: { VirtualListTable },
  props: {
    items: Array as PropType<any[]>,
    disabled: Boolean,
    horizontal: Boolean,
    firstRender: { type: Number, default: 10 },
    buffer: { type: Number, default: 100 },
    itemKey: {
      type: [String, Function] as PropType<
        "index" | ((item: any, index: number) => any)
      >,
    },
    itemSize: {
      type: Function as PropType<
        (item: any, index: number) => number | null | undefined | void
      >,
    },
    table: Boolean,
  },
  setup(props) {
    const start = ref(0);
    const end = ref(props.firstRender - 1);
    const end2 = computed(() =>
      hp.notGreaterThan(end.value, (props.items?.length || 1) - 1)
    );
    const avgSize = ref(0);
    const startSize = computed(() => positions.value[start.value] ? getPosition(start.value) : 0);
    const totalSize = computed(() =>
      positions.value.length > 0
        ? getPosition(positions.value.length - 1) +
          hp.arrayLast(sizes.value).value
        : 0
    );
    const endSize = computed(
      () =>
      positions.value[end2.value] ? (
        totalSize.value -
        getPosition(end2.value) -
        sizes.value[end2.value].value) : 0
    );
    const listStyle = computed(() =>
      !props.disabled ? { overflow: "auto" } : {}
    );
    const listInnerStyle = computed(() => {
      const r = {
        display: "flex",
      };
      if (!props.disabled) {
        if (!props.horizontal) {
          Object.assign(r, {
            "margin-top": startSize.value + "px",
            "margin-bottom": endSize.value + "px",
          });
        } else {
          Object.assign(r, {
            "margin-left": startSize.value + "px",
            "margin-right": endSize.value + "px",
            width: totalSize.value - endSize.value - startSize.value + "px",
          });
        }
      }
      r["flex-direction"] = !props.horizontal ? "column" : "row";
      if (props.table) {
        // @ts-ignore
        delete r.display;
        delete r["flex-direction"];
      }
      return r;
    });

    const runtimeSizes = computed(() =>
      reactive<(number | null)[]>((props.items || []).map(() => null))
    );
    const sizes = computed(() =>
      (props.items || []).map((item, index) =>
        computed(() => {
          if (runtimeSizes[index] != null) {
            return runtimeSizes[index];
          }
          let r = props.itemSize?.(item, index);
          if (r == null) {
            r = avgSize.value;
          }
          return r;
        })
      )
    );
    // not reactive
    const positionsAccumulate = ref<Accumulate<typeof sizes.value[0]>>(); // for vue2 Only
    const resetPositionsAccumulate = () => {
      positionsAccumulate.value = new Accumulate(sizes.value);
      positionsAccumulate.value.getValue = (item) => item?.["value"];
    };
    resetPositionsAccumulate();
    const positions = computed(() =>
      (props.items || []).map((item, index) =>
        computed(() => {
          let r: number;
          if (index === 0) {
            r = 0;
          } else if (isVue3) {
            let prevPosition = positions.value![index - 1];
            let prevSize = sizes.value![index - 1];
            r = prevPosition.value + prevSize.value;
          } else {
            r = positionsAccumulate.value!.sum(index - 1);
          }
          return r;
        })
      )
    );
    watch(() => props.items, update);
    watch(() => positions.value, resetPositionsAccumulate);
    const visibleItemsInfo = computed(() => {
      if (!props.items || props.disabled) {
        return;
      }
      const r: { item: typeof props.items[0]; index: number }[] = [];

      for (let index = start.value; index <= end2.value; index++) {
        const item = props.items[index];
        if (!item) {
          break;
        }
        r.push({ item, index });
      }
      return r;
    });
    const listElRef = ref<HTMLElement>();
    const listInnerRef = ref();
    onMounted(async () => {
      update();
      try {
        createResizeObserver();
      } catch (error) {
        // ResizeObserver fallback
        await nextTick();
        update();
      }
    });

    let prevScroll: number;
    function onscroll() {
      const listEl = listElRef.value!;
      if (!listEl) {
        return;
      }
      const currentScroll = getScroll(listEl);
      if (
        prevScroll != null &&
        props.buffer - Math.abs(currentScroll - prevScroll) >= 10
      ) {
        return;
      }
      prevScroll = currentScroll;
      update();
    }

    let executing = false;
    let waiting = false;
    async function update() {
      if (executing) {
        waiting = true;
        return;
      }
      if (!props.items || props.disabled) {
        return;
      }
      executing = true;
      const listEl = listElRef.value!;
      const listInner: HTMLElement = listInnerRef.value?.$el;
      if (!listEl || !listInner) {
        return;
      }

      if (!avgSize.value) {
        avgSize.value = getAvgSize();
      }
      start.value = getStart();
      end.value = getEnd();

      await nextTick();

      // updateRuntimeSize
      let updated;
      let vi0 = 0;
      const runtimeSizesTemp: Record<number, number> = {};
      const children = !props.table
        ? listInner.children
        : listInner.querySelector("tbody")!.children;
      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        const cssPosition = hp.css(el, "position");
        if (cssPosition && ["absolute", "fixed"].includes(cssPosition)) {
          continue;
        }
        const size =
          hp.css(el, "display") !== "none" ? getOuterSize(<HTMLElement>el) : 0;
        const vi = el.getAttribute("vt-index");
        const index = vi ? parseInt(vi) : start.value + vi0;
        runtimeSizesTemp[index] = (runtimeSizesTemp[index] || 0) + size;
        vi0++;
      }
      for (const indexS of Object.keys(runtimeSizesTemp)) {
        const index = parseInt(indexS);
        if (runtimeSizes.value[index] !== runtimeSizesTemp[index]) {
          runtimeSizes.value[index] = runtimeSizesTemp[index];
          updated = true;
        }
      }
      if (updated) {
        isVue2 && resetPositionsAccumulate();
        await nextTick();
      }
      // call wating task if existing
      executing = false;
      if (waiting) {
        waiting = false;
        update();
      }

      // functions
      function getStart() {
        const startPosition =
          getScroll(listEl) - getPaddingStart(listEl) - props.buffer;
        const r = hp.binarySearch(
          positions.value,
          (mid) => mid.value - startPosition,
          { returnNearestIfNoHit: true }
        )!;
        return r.index;
      }
      function getEnd() {
        const endPosition =
          getScroll(listEl) -
          getPaddingStart(listEl) +
          getClientSize(listEl) +
          props.buffer;

        const r = hp.binarySearch(
          positions.value,
          (mid) => mid.value - endPosition,
          { returnNearestIfNoHit: true }
        )!;
        return r.index;
      }
      function getAvgSize() {
        const maxSampleCount = 10;
        const sizeArr: number[] = [];
        const children = !props.table
          ? listInner.children
          : listInner.querySelector("tbody")!.children;
        for (let index = 0; index < children.length; index++) {
          const el = <HTMLElement>children[index];
          const style = getComputedStyle(el);
          if (["absolute", "fixed"].includes(style.position)) {
            continue;
          }
          const outerSize = getOuterSize(el);
          sizeArr.push(outerSize);
          if (sizeArr.length >= maxSampleCount) {
            break;
          }
        }
        if (sizeArr.length === 0) {
          return 0;
        }
        return sizeArr.reduce((a, b) => a + b, 0) / sizeArr.length;
      }
    }
    function getClientSize(el: HTMLElement) {
      const style = getComputedStyle(el);
      let r = parseFloat(!props.horizontal ? style.height : style.width);
      if (style.boxSizing === "border-box") {
        if (!props.horizontal) {
          r =
            r -
            parseFloat(style.borderTopWidth) -
            parseFloat(style.borderBottomWidth);
        } else {
          r =
            r -
            parseFloat(style.borderLeftWidth) -
            parseFloat(style.borderRightWidth);
        }
      }
      return r;
    }
    function getOuterSize(el: HTMLElement) {
      let r = getClientSize(el);
      const style = getComputedStyle(el);
      if (!props.horizontal) {
        r +=
          parseFloat(style.borderTopWidth) +
          parseFloat(style.borderBottomWidth) +
          parseFloat(style.marginTop) +
          parseFloat(style.marginBottom);
      } else {
        r +=
          parseFloat(style.borderLeftWidth) +
          parseFloat(style.borderRightWidth) +
          parseFloat(style.marginLeft) +
          parseFloat(style.marginRight);
      }
      r = Number.isNaN(r) ? 0 : r;
      return r;
    }
    function getScroll(el: HTMLElement) {
      return !props.horizontal ? el.scrollTop : el.scrollLeft;
    }
    function getPaddingStart(el: HTMLElement) {
      const style = getComputedStyle(el);
      return !props.horizontal
        ? parseFloat(style.paddingTop)
        : parseFloat(style.paddingLeft);
    }
    // function getPaddingEnd(el: HTMLElement) {
    //   const style = getComputedStyle(el);
    //   return !props.horizontal
    //     ? parseFloat(style.paddingBottom)
    //     : parseFloat(style.paddingRight);
    // }
    function getPosition(index: number): number {
      return positions.value[index].value;
    }

    function createResizeObserver() {
      const listEl = listElRef.value!;
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (hp.hasClass(entry.target, "vtlist")) {
            update();
            break;
          }
        }
      });
      resizeObserver.observe(listEl);
    }

    function getItemKey(item: any, index: number) {
      if (props.itemKey) {
        if (typeof props.itemKey === "string" && props.itemKey === "index") {
          return index;
        } else if (typeof props.itemKey === "function") {
          return props.itemKey(item, index);
        }
      }
    }

    return {
      listElRef,
      listInnerRef,
      onscroll,
      listStyle,
      listInnerStyle,
      visibleItemsInfo,
      getItemKey,
      update,
    };
  },
});
export default cpt;
export type VtlistType = InstanceType<typeof cpt>;
</script>

<style></style>
