// @ts-nocheck
const data = {
  a: 1,
  b: 2
}

let activeEffect
function effect(fn) {
  // activeEffect = fn
  // fn()
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  effectFn.deps = []
  effectFn()
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

const reactiveMap = new Map()

const obj = new Proxy(data, {
  get(targetObj, key) {
    let depMap = reactiveMap.get(targetObj)
    if (!depMap) {
      reactiveMap.set(targetObj, (depMap = new Map()))
    }
    let deps = depMap.get(key)
    if (!deps) {
      depMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)

    activeEffect.deps.push(deps)

    return targetObj[key]
  },
  set(targetObj, key, newVal) {
    targetObj[key] = newVal
    const depsMap = reactiveMap.get(targetObj)
    if (!depsMap) {
      return
    }
    const effects = depsMap.get(key)

    effects && effects.forEach(fn => fn())

    return true
  }
})

effect(() => {
  console.log('log', obj.a ? obj.b : 'nothing')
})
// obj.a = undefined;
// obj.b = 3; // 此时修改b属性值，不应该触发effect
console.log(reactiveMap)
