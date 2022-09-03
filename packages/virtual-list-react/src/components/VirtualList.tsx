import React, {
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react'
import * as hp from 'helper-js'

export type Props<ITEM> = {
  items: ITEM[]
  disabled?: boolean
  horizontal?: boolean
  itemKey?: (item: ITEM, index: number) => number | string
  itemSize?: (item: ITEM, index: number) => number | null | undefined
  table?: boolean
  prepend?: ReactNode
  append?: ReactNode
  node?: (item: ITEM, index: number, key: string) => ReactNode
} & typeof defaultProps

export const defaultProps = {
  firstRender: 10,
  buffer: 100,
}

export function VirtualList<ITEM>(
  props: Props<ITEM> & React.HTMLProps<HTMLElement>,
) {
  const [start, setstart] = useState(0)
  const [end0, setend0] = useState(props.firstRender - 1)
  const end = hp.notGreaterThan(end0, (props.items?.length || 1) - 1)
  const [avgSize, setavgSize] = useState(10)
  const [runtimeSizes, setruntimeSizes] = useState<number[]>(
    new Array(props.items.length),
  )
  const [sizes, setsizes] = useState<number[]>(new Array(props.items.length))
  useEffect(() => {
    setsizes(
      props.items.map(
        (item, i) => runtimeSizes[i] || props.itemSize?.(item, i) || avgSize,
      ),
    )
  }, [runtimeSizes, props.itemSize, avgSize])
  const [positions, setpositions] = useState(new Array(props.items.length))
  useEffect(() => {
    const p: number[] = []
    sizes.reduce((a, b) => {
      p.push(a)
      return a + b
    }, 0)
    setpositions(p)
  }, [sizes])
  const startSize = useMemo(() => positions[start], [positions, start])
  const totalSize = useMemo(
    () =>
      positions.length > 0 ? hp.arrayLast(positions) + hp.arrayLast(sizes) : 0,
    [positions, sizes],
  )
  const endSize = useMemo(() => totalSize - positions[end] - sizes[end], [
    totalSize,
    positions,
    sizes,
    end,
  ])
  const listStyle = useMemo(
    () => (!props.disabled ? { overflow: 'auto' } : {}),
    [props.disabled],
  )
  const listInnerStyle = useMemo(() => {
    const r: Record<string, string> = {
      display: 'flex',
    }
    if (!props.disabled) {
      if (!props.horizontal) {
        Object.assign(r, {
          marginTop: startSize + 'px',
          marginBottom: endSize + 'px',
        })
      } else {
        Object.assign(r, {
          marginLeft: startSize + 'px',
          // marginRight: endSize + 'px',
          width: totalSize - endSize - startSize + 'px',
        })
      }
    }
    r.flexDirection = !props.horizontal ? 'column' : 'row'
    if (props.table) {
      // @ts-ignore
      delete r.display
      delete r.flexDirection
    }
    return r
  }, [
    props.disabled,
    props.horizontal,
    startSize,
    endSize,
    totalSize,
    props.table,
  ])
  const visibleItemsInfo = useMemo(() => {
    if (!props.items || props.disabled) {
      return
    }
    const r: { item: typeof props.items[0]; index: number }[] = []

    for (let index = start; index <= end; index++) {
      const item = props.items[index]
      if (!item) {
        break
      }
      r.push({ item, index })
    }
    return r
  }, [props.items, props.disabled, start, end])
  const listElRef = useRef<HTMLDivElement>(null)
  const listInnerRef = useRef<HTMLElement>(null)
  let prevScroll: number
  function onscroll() {
    const listEl = listElRef.current!
    if (!listEl) {
      return
    }
    const currentScroll = getScroll(listEl)
    if (
      prevScroll != null &&
      props.buffer - Math.abs(currentScroll - prevScroll) >= 10
    ) {
      return
    }
    prevScroll = currentScroll

    update()
  }
  // functions
  const updateStatus = useMemo(
    () => ({ executing: false, waiting: false, id: 0 }),
    [],
  )
  const update = async function () {
    let id = ++updateStatus.id
    if (!hp.isWindowDefined()) {
      return
    }
    if (props.disabled) {
      return
    }

    updateStatus.executing = true
    const listEl = listElRef.current!
    const listInner = listInnerRef.current!
    if (!listEl || !listInner) {
      return
    }

    if (positions?.[0] == null) {
      return
    }

    let avgSizeNew = getAvgSize()
    if (Math.abs(avgSize - avgSizeNew) > 10) {
      setavgSize(avgSizeNew)
    }
    setstart(getStart())
    setend0(getEnd())

    // updateRuntimeSize
    await nextTick()
    if (id !== updateStatus.id) {
      return
    }
    let updated
    let vi0 = 0
    const runtimeSizesTemp: Record<number, number> = {}
    const children = !props.table
      ? listInner.children
      : listInner.querySelector('tbody')!.children
    for (let i = 0; i < children.length; i++) {
      const el = children[i]
      const cssPosition = hp.css(el, 'position')
      if (hp.hasClass(el, 'vt-ignore')) {
        continue
      }
      if (cssPosition && ['absolute', 'fixed'].includes(cssPosition)) {
        continue
      }
      const size =
        hp.css(el, 'display') !== 'none' ? getOuterSize(el as HTMLElement) : 0
      const vi = el.getAttribute('vt-index')
      const index = vi ? parseInt(vi) : start + vi0
      runtimeSizesTemp[index] = (runtimeSizesTemp[index] || 0) + size
      vi0++
    }
    for (const indexS of Object.keys(runtimeSizesTemp)) {
      const index = parseInt(indexS)
      if (runtimeSizes[index] !== runtimeSizesTemp[index]) {
        runtimeSizes[index] = runtimeSizesTemp[index]
        updated = true
      }
    }
    if (updated) {
      setruntimeSizes([...runtimeSizes])
    }

    // functions
    function getStart() {
      const startPosition =
        getScroll(listEl) - getPaddingStart(listEl) - props.buffer

      const r = hp.binarySearch(positions, (mid) => mid - startPosition, {
        returnNearestIfNoHit: true,
      })!
      return r.index
    }
    function getEnd() {
      const endPosition =
        getScroll(listEl) -
        getPaddingStart(listEl) +
        getClientSize(listEl) +
        props.buffer

      const r = hp.binarySearch(positions, (mid) => mid - endPosition, {
        returnNearestIfNoHit: true,
      })!
      return r.index
    }
    function getAvgSize() {
      const maxSampleCount = 10
      const sizeArr: number[] = []
      const children = !props.table
        ? listInner.children
        : listInner.querySelector('tbody')!.children
      for (let index = 0; index < children.length; index++) {
        const el = children[index]
        const style = getComputedStyle(el)
        if (['absolute', 'fixed'].includes(style.position)) {
          continue
        }
        const outerSize = getOuterSize(el as HTMLElement)
        sizeArr.push(outerSize)
        if (sizeArr.length >= maxSampleCount) {
          break
        }
      }
      if (sizeArr.length === 0) {
        return 0
      }
      return sizeArr.reduce((a, b) => a + b, 0) / sizeArr.length
    }
  }
  function getClientSize(el: HTMLElement) {
    const style = getComputedStyle(el)
    let r = parseFloat(!props.horizontal ? style.height : style.width)
    if (style.boxSizing === 'border-box') {
      if (!props.horizontal) {
        r =
          r -
          parseFloat(style.borderTopWidth) -
          parseFloat(style.borderBottomWidth)
      } else {
        r =
          r -
          parseFloat(style.borderLeftWidth) -
          parseFloat(style.borderRightWidth)
      }
    }
    return r
  }
  function getOuterSize(el: HTMLElement) {
    let r = getClientSize(el)
    const style = getComputedStyle(el)
    if (!props.horizontal) {
      r +=
        parseFloat(style.borderTopWidth) +
        parseFloat(style.borderBottomWidth) +
        parseFloat(style.marginTop) +
        parseFloat(style.marginBottom)
    } else {
      r +=
        parseFloat(style.borderLeftWidth) +
        parseFloat(style.borderRightWidth) +
        parseFloat(style.marginLeft) +
        parseFloat(style.marginRight)
    }
    r = Number.isNaN(r) ? 0 : r
    return r
  }
  function getScroll(el: HTMLElement) {
    return !props.horizontal ? el.scrollTop : el.scrollLeft
  }
  function getPaddingStart(el: HTMLElement) {
    const style = getComputedStyle(el)
    return !props.horizontal
      ? parseFloat(style.paddingTop)
      : parseFloat(style.paddingLeft)
  }
  // function getPaddingEnd(el: HTMLElement) {
  //   const style = getComputedStyle(el);
  //   return !props.horizontal
  //     ? parseFloat(style.paddingBottom)
  //     : parseFloat(style.paddingRight);
  // }

  function createResizeObserver() {
    const listEl = listElRef.current!
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (hp.hasClass(entry.target, 'vtlist')) {
          update()
          break
        }
      }
    })
    resizeObserver.observe(listEl)
  }

  // watch
  useEffect(() => {
    update()
  }, [positions])
  // mounted
  useEffect(() => {
    update()
    try {
      createResizeObserver()
    } catch (error) {
      // ResizeObserver fallback
      update()
    }
  }, [])
  // render
  const listInnerRender = (slot: ReactNode) =>
    !props.table ? (
      // @ts-ignore
      <div className="vtlist-inner" ref={listInnerRef} style={listInnerStyle}>
        {props.prepend}
        {slot}
        {props.horizontal && (
          <div
            className="vt-ignore"
            style={{ width: endSize + 'px', flexShrink: 0 }}
          ></div>
        )}
        {props.append}
      </div>
    ) : (
      // @ts-ignore
      <table className="vtlist-inner" ref={listInnerRef} style={listInnerStyle}>
        {props.prepend}
        <tbody>{slot}</tbody>
        {props.append}
      </table>
    )

  return (
    <div
      className={`vtlist ${props.className || ''}`}
      ref={listElRef}
      style={{ ...listStyle, ...props.style }}
      onScroll={() => onscroll()}
    >
      {listInnerRender(
        (props.disabled ? props.items : visibleItemsInfo)?.map((t, i) => {
          let item: ITEM, index: number
          if (props.disabled) {
            item = t as ITEM
            index = i
          } else {
            // @ts-ignore
            item = t.item
            // @ts-ignore
            index = t.index
          }
          const key = (props.itemKey ? props.itemKey(item, index) : index) + ''
          return (
            <React.Fragment key={key}>
              {props.node?.(item, index, key)}
            </React.Fragment>
          )
        }),
      )}
    </div>
  )
}
VirtualList.defaultProps = defaultProps

function nextTick() {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  })
}
