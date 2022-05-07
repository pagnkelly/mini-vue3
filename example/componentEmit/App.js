import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: "App",
  render() {
    return h('div', {}, [h('div', {}, 'App'), h(Foo, {
      onAdd(...args) {
        console.log('onAdd', ...args)
      },
      onAddFoo(...args) {
        console.log('onAddFoo', ...args)
      }
    })]);
  },
  setup() {
    return {}
  }
}