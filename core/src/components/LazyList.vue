<template>
  <div
    class="LazyList lazy-list"
    ref="listElRef"
    :style="listStyle"
    @scroll.passive="onscroll"
  >
    <div class="LazyListInner" ref="listInnerRef" :style="listInnerStyle">
      <template v-if="disabled">
        <template v-for="(item, index) in items" :key="index">
          <slot :item="item" :index="index" />
        </template>
      </template>
      <template v-else>
        <template v-for="{ item, index } in visibleItemsInfo" :key="index">
          <slot :item="item" :index="index" />
        </template>
      </template>
    </div>
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
} from "vue-demi";
import * as hp from "helper-js";

export default defineComponent({
  props: {
    items: Array,
    disabled: Boolean,
    horizontal: Boolean,
    firstRender: { type: Number, default: 10 },
    buffer: { type: Number, default: 100 },
    getItemSize: {
      type: Function as PropType<
        (item: any, index: number) => number | null | undefined | void
      >,
    },
  },
  setup(props) {
    const start = ref(0);
    const end = ref(props.firstRender - 1);
    const avgSize = ref(0);
    const startSize = computed(() =>
      itemsInfo.value ? itemsInfo.value[start.value].position.value : 0
    );
    const listStyle = computed(() =>
      !props.disabled ? { overflow: "auto" } : {}
    );
    const listInnerStyle = computed(() => {
      const r = {
        display: "flex",
      };
      if (!props.disabled) {
        r[!props.horizontal ? "margin-bottom" : "margin-right"] =
          totalSize.value + "px";
      }
      r["flex-direction"] = !props.horizontal ? "column" : "row";
      if (!props.disabled) {
        if (!props.horizontal) {
          r["transform"] = `translateY(${startSize.value}px)`;
          r["height"] = "0px";
        } else {
          r["transform"] = `translateX(${startSize.value}px)`;
          r["width"] = "0px";
        }
      }
      return r;
    });
    const totalSize = computed(() => {
      if (itemsInfo.value) {
        const lastItem = <typeof itemsInfo.value[0]>(
          hp.arrayLast(itemsInfo.value)
        );
        return lastItem.position.value + lastItem.size.value;
      } else {
        return 0;
      }
    });
    const totalWidth = computed(() =>
      props.disabled ? "" : props.horizontal ? totalSize.value + "px" : ""
    );
    const totalHeight = computed(() =>
      props.disabled ? "" : !props.horizontal ? totalSize.value + "px" : ""
    );

    const itemsInfo = computed(() =>
      props.items?.map((item, index) => {
        const runtimeSize = ref<number>();
        const size = computed(() => {
          if (runtimeSize.value != null) {
            return runtimeSize.value;
          }
          let r = props.getItemSize?.(item, index);
          if (r == null) {
            r = avgSize.value;
          }
          return r;
        });
        const position = computed((): number => {
          if (index === 0) {
            return 0;
          }
          let prev = itemsInfo.value![index - 1];
          return prev.position.value + prev.size.value;
        });
        return { runtimeSize, size, position };
      })
    );
    const visibleItemsInfo = computed(() => {
      if (!props.items) {
        return;
      }
      const r: { item: typeof props.items[0]; index: number }[] = [];
      for (let index = start.value; index <= end.value; index++) {
        const item = props.items[index];
        if (!item) {
          break;
        }
        r.push({ item, index });
      }
      return r;
    });
    const listElRef = ref<HTMLElement>();
    const listInnerRef = ref<HTMLElement>();
    onMounted(async () => {
      update();
    });

    let prevScroll: number;
    function onscroll() {
      const listEl = listElRef.value!;
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
      const listInner = listInnerRef.value!;
      if (!avgSize.value) {
        avgSize.value = getAvgSize();
      }
      start.value = getStart();
      end.value = getEnd();
      await nextTick();

      // updateRuntimeSize
      let updated;
      for (let i = 0; i < listInner.children.length; i++) {
        const el = listInner.children[i];
        const itemInfo = itemsInfo.value![start.value + i];
        const size = getOuterSize(<HTMLElement>el);
        if (itemInfo.runtimeSize.value !== size) {
          itemInfo.runtimeSize.value = size;
          updated = true;
        }
      }
      if (updated) {
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
        const infos = itemsInfo.value!;
        const startPosition =
          getScroll(listEl) - getPaddingStart(listEl) - props.buffer;
        const r = hp.binarySearch(
          infos,
          (mid, index) => mid.position.value - startPosition,
          { returnNearestIfNoHit: true }
        )!;
        return r.index;
      }
      function getEnd() {
        const infos = itemsInfo.value!;
        const endPosition =
          getScroll(listEl) -
          getPaddingStart(listEl) +
          getClientSize(listEl) +
          props.buffer;
        const r = hp.binarySearch(
          infos,
          (mid, index) => mid.position.value - endPosition,
          { returnNearestIfNoHit: true }
        )!;
        return r.index;
      }
      function getAvgSize() {
        const maxSampleCount = 10;
        const sizeArr: number[] = [];
        for (let index = 0; index < listInner.children.length; index++) {
          const el = <HTMLElement>listInner.children[index];
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

    return {
      listElRef,
      listInnerRef,
      onscroll,
      listStyle,
      listInnerStyle,
      visibleItemsInfo,
      totalHeight,
      totalWidth,
    };
  },
});
</script>

<style></style>
