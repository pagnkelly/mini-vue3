import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null
export const App = {
  name: 'APP',
  render() {
    window.self = this
    return h('div', {
      id: 'root',
      class: ['red', 'hard'],
      onClick: () => {
        console.log('click')
      },
      onMousedown: () => {
        console.log('onMousedown')
      }
    },
    [h('div', {}, 'hi, ' + this.msg), h(Foo, { count: 1 })]
    // 'hi, ' + this.msg
    // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mini-vue')]
    )
  },
  setup() {
    return {
      msg: 'mini-vue3-haha'
    }
  }
}