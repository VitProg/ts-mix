import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';

export function getRollupConfig(isProd = false) {
    let output = [
        {
            file: './tmp/index.js',
            format: 'cjs',
        },
        {
            file: './tmp/index.umd.js',
            format: 'umd',
            name: 'ts-mix',
        },
    ];

    if (!isProd) {
        output = output.map(o => ({
            ...o,
            sourcemap: 'inline',
        }));
    }

    const config = [
        {
            input: './src/index.ts',
            output,
            external: [
                ...Object.keys(pkg.dependencies || {}),
            ],
            plugins: [
                typescript({
                    tsconfig: isProd ? './tsconfig.prod.json' : './tsconfig.json',
                }),
            ],
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

    if (isProd) {
        config[0].plugins.push(terser());
    }

    return config;
}
