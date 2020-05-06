import Vue from './src/core/instance'

let app = new Vue({
    el: '#app',
    data: {
        message: 'this is message',
        info: {
            age: '20',
            name: '李白'
        }
    }
})
console.log(app)