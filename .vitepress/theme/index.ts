import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomePage from './components/HomePage.vue'
import LastUpdatedNote from './components/LastUpdatedNote.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-footer-before': () => h(LastUpdatedNote)
    })
  },
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
  }
}
