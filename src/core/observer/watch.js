export class Watcher{
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm;
        this.getter = parsepath(expOrFn)
        this.cb = cb
        this.depIds = new Set()
        this.deps = []
        this.value = this.get()
    }
    get() {
        window.target = this
        let value = this.getter.call(this.vm, this.vm)
        window.target = undefined
        return value
    }
    update() {
        let oldValue = this.value
        this.value = this.get()
        this.cb.call(this.vm, this.value, oldValue)
    }
    addDep(dep) {
        const id = dep.id
        if (!this.depIds.has(id)) {
            this.depIds.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
}

const bailRE = /[^\w.$]/;
function parsepath(path) {
    if (bailRE.test(path)) {
        return
    }
    const segments = path.split('.')
    return function(obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) {return}
            obj = obj[segments[i]]
        }
        return obj
    }
}