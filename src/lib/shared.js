import { Fragment } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { codeToHast } from 'shiki'

export async function highlight(code, lang) {
    if (typeof code !== 'string') {
        code = JSON.stringify(code);
    }

    const out = await codeToHast(code, {
        lang,
        theme: 'dracula',
    });

    return toJsxRuntime(out, {
        Fragment,
        jsx,
        jsxs,
    });
}

