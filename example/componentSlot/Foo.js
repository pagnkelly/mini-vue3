import { h, renderSlots } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  name: 'App',
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')
    console.log(foo, this.$slots)
    return h('div', {}, [renderSlots(this.$slots, 'header', 1), foo, renderSlots(this.$slots, 'footer', 2)])
  }
}