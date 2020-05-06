import { def } from "./def"

export default class Observer{
    constructor(obj) {
        this.value = obj
        this.dep = new Dep()
        def(obj, '__ob__', this)
        if (isObject(obj)) {
            this.walk(obj)
        }
    }
    walk(obj) {
        const keys = Object.keys(obj)
        keys.forEach(key => {
            defineReactive(obj, key, obj[key])
        })
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
    return Object.prototype.toString.call(val) === '[object Object]'
}