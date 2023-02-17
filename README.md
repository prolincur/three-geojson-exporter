
# three-geojson-exporter

**three-geojson-exporter** is a cross platform [GeoJSON](https://www.rfc-editor.org/rfc/rfc7946.html) file exporter for THREE.js. It takes any 2d object of three.js and converts it into GeoJSON FeatureCollection object. This library works out of the box with cross platform react-native and react-three-fibre as well.

#### Install
```
yarn add three-geojson-exporter three
```
or
```
npm i three-geojson-exporter three
```

#### Usage

```javascript

import * as THREE from 'three'
import { GeoJsonExporter } from 'three-geojson-exporter'

const exporter = new GeoJsonExporter();
// exporter.setTransformCallback((worldVec3) => [worldVec3.x, worldVec3.y]);
// exporter.setProjection('EPSG:9999')
// exporter.setPrecision(6);

// const scene = new THREE.Scene();

const geojson = exporter.parse(scene);
// downloadFile

```

### Author

[Prolincur Technologies](https://prolincur.com)
