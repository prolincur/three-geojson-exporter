/*
 * Copyright (c) 2020-23 Prolincur Technologies LLP.
 * All Rights Reserved.
 */

import React from 'react'
import 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { GeoJsonExporter } from 'three-geojson-exporter'
import { Heart2d } from './heart2d'

function App() {
  const heartRef = React.useRef(null)
  const [str, setStr] = React.useState('')
  const convertNow = React.useCallback(() => {
    const object = heartRef.current
    if (!object) return

    const exporter = new GeoJsonExporter()
    const geojson = exporter.parse(object)
    const str = JSON.stringify(geojson, null, 2)
    setStr(str)
  }, [])

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ height: '50vh', background: 'black' }}>
        <Canvas>
          <OrthographicCamera makeDefault position={[0, 0, 5]} />
          <ambientLight />
          <OrbitControls enableRotate={false} />
          <Heart2d ref={heartRef} />
        </Canvas>
      </div>
      <div style={{ height: '50vh' }}>
        <button onClick={convertNow}>Convert Now</button>
        <textarea rows={20} cols={80} value={str} readOnly />
      </div>
    </div>
  )
}

export default App
