/*
 * Copyright (c) 2020-23 Prolincur Technologies LLP.
 * All Rights Reserved.
 */

import * as THREE from 'three'

class GeoJsonExporter {
  constructor() {
    this.transformCallback = (worldVec3) => [worldVec3.x, worldVec3.y]
    this.projection = 'EPSG:9999'
    this.precision = 8
  }

  setProjection(proj) {
    this.projection = projection
    return this
  }

  setPrecision(proj) {
    this.precision = precision
    return this
  }

  setTransformCallback(transform) {
    if (typeof transform === 'function') {
      this.transformCallback = transform
    }
    return this
  }

  parse(scene) {
    if (!scene) return null
    const scope = this

    const transformPoint = (worldVec3) => {
      const [lng, lat] = scope.transformCallback(worldVec3)
      return [parseFloat(lng.toFixed(scope.precision)), parseFloat(lat.toFixed(scope.precision))]
    }

    const getCoordinateAt = (i, positions, matrix) => {
      const coord = []
      const size = positions.itemSize
      for (let j = 0; j < size; j += 1) {
        coord.push(positions.array[i * size + j])
      }
      const vec = new THREE.Vector3(...coord).applyMatrix4(matrix)
      return transformPoint(vec)
    }

    const getProperties = (object, stroke = false, fill = false) => {
      const properties = {}
      if (object.material) {
        const colorHex = `#${object.material.color.getHexString()}`
        if (stroke) properties.stroke = colorHex
        if (fill) properties.fill = colorHex

        if (typeof object.material.opacity !== 'undefined') {
          if (stroke) properties['stroke-opacity'] = object.material.opacity
          if (fill) properties['fill-opacity'] = object.material.opacity
        }
      }

      return properties
    }

    const convertPoints = (object) => {
      if (!(object instanceof THREE.Points)) {
        return []
      }
      object.updateMatrix()

      const positions =
        object.geometry && object.geometry.attributes
          ? object.geometry.attributes.position
          : undefined

      if (!positions) {
        return []
      }

      const matrix = object.matrixWorld.clone()
      const features = []
      for (let i = 0; i < positions.count; i += 1) {
        features.push({
          type: 'Feature',
          properties: getProperties(object, true),
          geometry: {
            type: 'Point',
            coordinates: getCoordinateAt(i, positions, matrix),
          },
        })
      }
      return features
    }

    const convertLine = (object) => {
      object?.updateMatrix()

      const positions = object?.geometry?.attributes?.position
      const colorProperties = getProperties(object, true)
      if (!positions || positions.count === 0) {
        return []
      }
      const matrix = object.matrixWorld.clone()
      const coordinates = []
      for (let i = 0; i < positions.count; i += 1) {
        const coordinate = getCoordinateAt(i, positions, matrix)
        coordinates.push(coordinate)
      }
      if (coordinates.length === 0) {
        console.warn('No coordinates extracted from Line')
        return []
      }

      return [
        {
          type: 'Feature',
          properties: colorProperties,
          geometry: {
            type: 'LineString',
            coordinates,
          },
        },
      ]
    }

    const convertLineSegment = (object) => {
      object?.updateMatrix()
      const positions = object?.geometry?.attributes?.position
      const properties = getProperties(object, true)
      if (!positions || positions.count === 0) {
        return []
      }
      const matrix = object.matrixWorld.clone()
      const features = []
      for (let i = 0; i < positions.count; i += 2) {
        const start = getCoordinateAt(i, positions, matrix)
        const end = getCoordinateAt(i + 1, positions, matrix)
        features.push({
          type: 'Feature',
          properties,
          geometry: {
            type: 'LineString',
            coordinates: [start, end],
          },
        })
      }

      return features
    }

    const convertMesh = (object) => {
      object?.updateMatrix()
      const positions = object?.geometry?.attributes?.position
      if (!positions) return []
      const matrix = object.matrixWorld.clone()
      const polygonCoordinates = []
      for (let i = 0; i < positions.count; i += 1) {
        const coordinate = getCoordinateAt(i, positions, matrix)
        polygonCoordinates.push(coordinate)
      }

      if (polygonCoordinates.length > 2) {
        polygonCoordinates.push(polygonCoordinates[0])
      }

      return [
        {
          type: 'Feature',
          properties: getProperties(object, true, true),
          geometry: {
            type: 'Polygon',
            coordinates: [polygonCoordinates],
          },
        },
      ]
    }

    const convertObject3d = (object) => {
      if (!object) return null

      const features = []

      const func = (child) => {
        if (!child) return
        let childFeatures = []
        if (child.type === 'Points') {
          childFeatures = convertPoints(child)
        } else if (child.type === 'Line') {
          childFeatures = convertLine(child)
        } else if (child.type === 'LineSegments') {
          childFeatures = convertLineSegment(child)
        } else if (child.type === 'Mesh') {
          childFeatures = convertMesh(child)
        } else if (
          child instanceof THREE.Scene ||
          child instanceof THREE.Group ||
          child instanceof THREE.Object3D
        ) {
          child?.updateMatrix()
          child?.children?.forEach((grandChild) => {
            const grandChildFeatures = convertObject3d(grandChild)
            if (grandChildFeatures) {
              childFeatures.push(...grandChildFeatures)
            }
          })
        } else {
          console.warn('Skipping unsupported type')
        }
        features.push(...(childFeatures || []))
      }

      object.traverse(func)
      return features
    }

    const features = convertObject3d(scene)
    if (!features?.length) return null
    return {
      type: 'FeatureCollection',
      features,
      crs: {
        type: 'name',
        properties: {
          name: scope.projection,
        },
      },
    }
  }
}

export { GeoJsonExporter }
