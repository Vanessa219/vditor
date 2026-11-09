# Graphviz runtime

`viz.js` is the unmodified `dist/viz-global.js` from `@viz-js/viz` 3.31.0 (Graphviz 16.1.0, Expat 2.8.5). Vditor loads it inside a dedicated Worker and requests SVG output. The upstream build does not enable or link zlib.

- Package: https://www.npmjs.com/package/@viz-js/viz/v/3.31.0
- Upstream source: https://github.com/mdaines/viz-js/tree/c8ce050d28eb0dc1ed1629ea32ab7f3dc117db0f
- Build: https://github.com/mdaines/viz-js/blob/c8ce050d28eb0dc1ed1629ea32ab7f3dc117db0f/packages/viz/backend/Dockerfile
- Package SHA-512 integrity: `sha512-r7zlQdRvcwvIpjHGgs+KNWHeE/P5/Dq7k8ZAKaMCbZqomxCBJV78gVuQYaHzFVca+kB0mX0fMW9UFevCOBG50A==`

To update, verify the package integrity and upstream build dependencies, copy the official global bundle unchanged, preserve the license files, and run the Graphviz browser regressions. The WebAssembly module is embedded in the bundle; it does not require a separate `.wasm` request.
