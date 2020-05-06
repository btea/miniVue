import { queryElement } from '../util/queryElement'
import Observer from '../observer'

export function mixininit(Vue) {
    Vue.prototype._init = function(obj) {
        let data = obj.data
        let el = queryElement(obj.el)
        this.data = data
        this.el = this.$root = el
        new Observer(data)
        this.listenElement(this.el)
    }
    
}