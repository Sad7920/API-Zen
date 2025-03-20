import { Fragment } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { codeToHast } from 'shiki'

export async function highlight(code, lang) {
    if (typeof code !== 'string') {
        code = JSON.stringify(code);
    }

    const dark = await codeToHast(code, {
        lang,
        theme: 'dracula',
    });
    const light = await codeToHast(code, {
        lang,
        theme: 'github-light',
    });

    return {
        dark: toJsxRuntime(dark, {
            Fragment,
            jsx,
            jsxs,
        }),
        light: toJsxRuntime(light, {
            Fragment,
            jsx,
            jsxs,
        })
    };
}

