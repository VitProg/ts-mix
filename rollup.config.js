import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy'

const config = [
    {
        input: './src/index.ts',
        output: [
            {
                file: './tmp/index.js',
                format: 'cjs',
            },
            {
                file: './tmp/index.umd.js',
                format: 'umd',
                name: 'ts-mix',
            },
        ],
        external: [
            ...Object.keys(pkg.dependencies || {})
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.prod.json',
            }),
            terser(),
        ]
    },
    {
        input: './tmp/index.d.ts',
        output: [
            {
                file: pkg.types,
                format: 'es',
            },
        ],
        plugins: [
            dts(),
            copy({
                targets: [
                    {
                        src: ['./tmp/index.js', './tmp/index.umd.js'],
                        dest: './dist/',
                    },
                ],
            }),
        ],
    },

];

export default config;
