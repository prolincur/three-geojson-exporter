/*! Copyright (c) 2021-23 Prolincur Technologies LLP.
All Rights Reserved.

Please check the provided LICENSE file for licensing details.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
 */
import * as f from "three";
class v {
  constructor() {
    this.transformCallback = (p) => [p.x, p.y], this.projection = "EPSG:9999", this.precision = 8;
  }
  setProjection(p) {
    return this.projection = projection, this;
  }
  setPrecision(p) {
    return this.precision = precision, this;
  }
  setTransformCallback(p) {
    return typeof p == "function" && (this.transformCallback = p), this;
  }
  parse(p) {
    if (!p)
      return null;
    const l = this, x = (t) => {
      const [e, o] = l.transformCallback(t);
      return [parseFloat(e.toFixed(l.precision)), parseFloat(o.toFixed(l.precision))];
    }, u = (t, e, o) => {
      const r = [], n = e.itemSize;
      for (let s = 0; s < n; s += 1)
        r.push(e.array[t * n + s]);
      const i = new f.Vector3(...r).applyMatrix4(o);
      return x(i);
    }, c = (t, e = !1, o = !1) => {
      const r = {};
      if (t.material) {
        const n = `#${t.material.color.getHexString()}`;
        e && (r.stroke = n), o && (r.fill = n), typeof t.material.opacity < "u" && (e && (r["stroke-opacity"] = t.material.opacity), o && (r["fill-opacity"] = t.material.opacity));
      }
      return r;
    }, d = (t) => {
      if (!(t instanceof f.Points))
        return [];
      t.updateMatrix();
      const e = t.geometry && t.geometry.attributes ? t.geometry.attributes.position : void 0;
      if (!e)
        return [];
      const o = t.matrixWorld.clone(), r = [];
      for (let n = 0; n < e.count; n += 1)
        r.push({
          type: "Feature",
          properties: c(t, !0),
          geometry: {
            type: "Point",
            coordinates: u(n, e, o)
          }
        });
      return r;
    }, F = (t) => {
      var i, s;
      t == null || t.updateMatrix();
      const e = (s = (i = t == null ? void 0 : t.geometry) == null ? void 0 : i.attributes) == null ? void 0 : s.position, o = c(t, !0);
      if (!e || e.count === 0)
        return [];
      const r = t.matrixWorld.clone(), n = [];
      for (let a = 0; a < e.count; a += 1) {
        const m = u(a, e, r);
        n.push(m);
      }
      return n.length === 0 ? (console.warn("No coordinates extracted from Line"), []) : [
        {
          type: "Feature",
          properties: o,
          geometry: {
            type: "LineString",
            coordinates: n
          }
        }
      ];
    }, P = (t) => {
      var i, s;
      t == null || t.updateMatrix();
      const e = (s = (i = t == null ? void 0 : t.geometry) == null ? void 0 : i.attributes) == null ? void 0 : s.position, o = c(t, !0);
      if (!e || e.count === 0)
        return [];
      const r = t.matrixWorld.clone(), n = [];
      for (let a = 0; a < e.count; a += 2) {
        const m = u(a, e, r), C = u(a + 1, e, r);
        n.push({
          type: "Feature",
          properties: o,
          geometry: {
            type: "LineString",
            coordinates: [m, C]
          }
        });
      }
      return n;
    }, S = (t) => {
      var n, i;
      t == null || t.updateMatrix();
      const e = (i = (n = t == null ? void 0 : t.geometry) == null ? void 0 : n.attributes) == null ? void 0 : i.position;
      if (!e)
        return [];
      const o = t.matrixWorld.clone(), r = [];
      for (let s = 0; s < e.count; s += 1) {
        const a = u(s, e, o);
        r.push(a);
      }
      return r.length > 2 && r.push(r[0]), [
        {
          type: "Feature",
          properties: c(t, !0, !0),
          geometry: {
            type: "Polygon",
            coordinates: [r]
          }
        }
      ];
    }, g = (t) => {
      if (!t)
        return null;
      const e = [], o = (r) => {
        var i;
        if (!r)
          return;
        let n = [];
        r.type === "Points" ? n = d(r) : r.type === "Line" ? n = F(r) : r.type === "LineSegments" ? n = P(r) : r.type === "Mesh" ? n = S(r) : r instanceof f.Scene || r instanceof f.Group || r instanceof f.Object3D ? (r == null || r.updateMatrix(), (i = r == null ? void 0 : r.children) == null || i.forEach((s) => {
          const a = g(s);
          a && n.push(...a);
        })) : console.warn("Skipping unsupported type"), e.push(...n || []);
      };
      return t.traverse(o), e;
    }, y = g(p);
    return y != null && y.length ? {
      type: "FeatureCollection",
      features: y,
      crs: {
        type: "name",
        properties: {
          name: l.projection
        }
      }
    } : null;
  }
}
export {
  v as GeoJsonExporter
};
