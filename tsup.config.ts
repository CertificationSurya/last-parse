import {defineConfig} from 'tsup'

export default defineConfig({
    format: ['cjs'],
    entry: ['./src/index.ts'],
    // dts: true,
    target: "es2020",
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    banner: {
        js: "#!/usr/bin/env node"
    }
})