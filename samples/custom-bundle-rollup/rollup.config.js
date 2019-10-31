// rollup.config.js
import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import commonJS from "rollup-plugin-commonjs";

export default {
  input: './index.ts',
  output: {
    name: "pnpjs",
    format: "umd",
    globals: "pnp",
    file: 'dist/pnpjs-bundle.js',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    resolve(),
    commonJS({
      extensions: [".js", ".ts"],
      include: "node_modules/**"
    })    
  ]
}
