import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import type { Component } from 'vue'
import './custom.css'

// Every .vue file in components/ is registered globally under its file name,
// so a new component needs no edit here.
const modules = import.meta.glob<{ default: Component }>('./components/*.vue', { eager: true })

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    for (const [path, mod] of Object.entries(modules)) {
      app.component(path.split('/').pop()!.replace(/\.vue$/, ''), mod.default)
    }
  },
} satisfies Theme
