import { h, provide, inject } from '../../lib/guide-mini-vue.esm.js'

const Provider = {
  name: "Provider",
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(ProviderTwo)]);
  },
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
    return {}
  }
}

const ProviderTwo = {
  name: "ProviderTwo",
  render() {
    return h('div', {}, [h('p', {}, 'ProviderTwo' + this.foo), h(Consumer)]);
  },
  setup() {

    provide('foo', 'fooTwo')
    const foo = inject('foo')
    return {
      foo
    }
  }
}

const Consumer = {
  name: "Consumer",
  render() {
    console.log(this.foo, 'ddd')
    return h('div', {}, `Consumer: ${this.foo} --> ${this.bar} -> ${this.baz} > ${this.bad}`);
  },
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    const baz = inject('baz', 'defaultValue')
    const bad = inject('bad', () => 'bad')
    return {
      foo,
      bar,
      baz,
      bad
    }
  }
}

export default {
  name: "App",
  setup() {
  },
  render() {
    return h("div", {}, [h("p", {}, "apiInject"), h(Provider)]);
  },
};