/*
 * Copyright (c) 2020-23 Prolincur Technologies LLP.
 * All Rights Reserved.
 */

import React from 'react'
import * as THREE from 'three'

const Heart2d = React.forwardRef((props, ref) => {
  const [edges, setEdges] = React.useState(null)

  React.useEffect(() => {
    if (edges) return

    const x = 0,
      y = 0

    const heartShape = new THREE.Shape()

    heartShape.moveTo(x + 5, y + 5)
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7)
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19)
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7)
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y)
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5)

    const geometry = new THREE.ShapeGeometry(heartShape)
    setEdges(new THREE.EdgesGeometry(geometry))
  }, [edges])

  if (!edges) return null
  return (
    <lineSegments ref={ref} args={[edges]}>
      <lineBasicMaterial color={0x00ff00} attach="material" />
    </lineSegments>
  )
})

export { Heart2d }
