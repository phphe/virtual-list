import { useMemo } from 'react'
import './App.css'
import { VirtualList, Props as VLProps0 } from './components/VirtualList'

function App() {
  const items = useMemo(
    () =>
      new Array(1000).fill(1).map((v, i) => ({
        text: 'Item ' + i,
        lineHeight: 20 + (i % 20) + 'px',
        width: 100 + (i % 30) + 'px',
      })),
    [],
  )

  type VLProps = VLProps0<typeof items[0]>
  const styles = {
    node: {
      border: '1px solid #ccc',
    },
  }
  const node: VLProps['node'] = (item, index, key) => (
    <h2 style={{ ...styles.node, lineHeight: item.lineHeight }}>
      ITEM: {index} - {item['text']}
    </h2>
  )
  return (
    <div>
      <h1>horizontal</h1>
      <VirtualList
        items={items}
        style={{ width: '1000px' }}
        horizontal
        node={node}
      ></VirtualList>
      <div>
        <h1>vertical</h1>
        <VirtualList
          items={items}
          node={node}
          style={{ height: '600px' }}
        ></VirtualList>
      </div>
      <div>
        <h1>table</h1>
        <VirtualList
          items={items}
          style={{ height: '600px' }}
          table
          className="list-table"
          prepend={
            <thead>
              <tr>
                <th>Text</th>
                <th>Index</th>
              </tr>
            </thead>
          }
          node={(item, index) => (
            <tr>
              <td>{index}</td>
              <td>
                ITEM: {index} - {item['text']}
              </td>
            </tr>
          )}
        ></VirtualList>
      </div>
    </div>
  )
}

export default App
