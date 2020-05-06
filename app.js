import Vue from './src/core/instance'

let app = new Vue({
    el: '#app',
    data: {
        message: 'this is message',
        info: {
            age: '20',
            name: '李白'
        },
        list: [
            10, 20
        ]
    }
})
app.$watch('message', function(old, n) {
    console.log('old ' + old)
    console.log('new ' + n)
})
console.log(app)