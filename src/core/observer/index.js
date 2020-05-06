import { def } from "./def"
import { arrayMethods } from './arrayMethod'

const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
export default class Observer{
    constructor(value) {
        this.value = value
        this.dep = new Dep()
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            if (hasProto) {
                protoAugment(value, arrayMethods)
            } else {
                copyAugment(value, arrayMethods, arrayKeys)
            }
            this.observeArray(value)
        }else {
            this.walk(value)
        }
    }
    walk(obj) {
        const keys = Object.keys(obj)
        keys.forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
    /**
     * 侦测 Array中的每一项
    */
    observeArray(items) {
        for(let i = 0; i < items.length; i++) {
            observe(items[i])
        }
    }
}
let uid = 1
class Dep{
    constructor() {
        this.subs = []
        this.id = ++uid
    }
    addSub(sub) {
        this.subs.push(sub)
    }
    removeSub(sub) {
        remove(this.subs, sub)
    }
    depend() {
        if (window.target) {
            window.target.addDep(this)
            // this.addSub(window.target)
        }
    }
    notify() {
        for(let i = 0; i < this.subs.length; i++) {
            this.subs[i].update()
        }
    }
}

function remove(arr, item) {
    if (arr.length) {
        let index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(key, 1)
        }
    }
}

function defineReactive(data, key, val) {
    let dep = new Dep()
    let childOb = observe(val)
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
            dep.depend()
            if (childOb) {
                childOb.dep.depend()
            }
            return val
        },
        set(newVal) {
            // 可以进一步比较两个完全相同的对象是否相等
            if (val === newVal) {
                return
            }
            val = newVal
            dep.notify()
        }
    })
}

/***
 * 尝试为value创建一个Observer实例
 * 如果创建成功，直接返回创建的Observer实例
 * 如果value已经存在一个Observer实例，则直接返回它
*/
export function observe(value, asRootData) {
    if (!isObject(value)) {
        return
    }
    let ob
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    }else {
        ob = new Observer(value)
    }
    return ob
}

function hasOwn(obj, key) {
    return key in obj
}

function isObject(val) {
    return typeof val === 'object'  
}

function protoAugment(target, src, keys) {
    target.__proto__ = src
}

function copyAugment(target, src, keys) {
    for(let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        def(target, key, src[key])
    }
}

export function set(target, key, val) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }

    // 设置已经存在的属性值，存在说明已经被侦测，只需设置新值，触发响应就成
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }

    // 处理新增的属性
    const ob = target.__proto__
    // target不能是Vue.js实例或Vue.js实例的根数据对象]
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== 'production' && warn(
            'Avoid adding reactive properties to a Vue instance or its root $data' + 
            'at runtim - declare it upfront in the data option.'
        )
        return val
    }
    if (!ob) {
        target[key] = val
        return val
    }
    defineReactiver(obj.value, key, val)
    ob.dep.notify()
    return val
}

// delete
export function del(target, key) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, i)
        return
    }
    const ob = target.__ob__
    // target不能是Vue.js实例或Vue.js实例的根数据对象]
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== 'production' && warn(
            'Avoid deleting properties on a Vue instance or its root $data ' + 
            '- just set it to null'
        )
        return
    }
    
    // 如果key不是target 自身的属性，则终止程序继续执行
    if (!hasOwn(target, key)) {
        return
    }
    delete target[key]
    // 如果ob不存在，则直接终止程序
    if (!ob) {
        return
    }
    ob.dep.notify()
}

function hasOwn(obj, key) {
    return obj.hasOwnProperty(key)
}

function isValidArrayIndex(key) {
    // 数组下标值应该为正整数
    return typeof key === 'number' && /^\d+$/.test(key)
}