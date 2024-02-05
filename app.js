const express = require('express')
// const path = require('path')

const app = express();

app.use(express.static(__dirname + '/static'))

app.get('/', (req, res) => {
    res.sendFile('inedx.html')
})

app.get('*', (req,res) => {
    res.redirect('/')
})

let host = 3000;
app.listen(host)

console.log(`Server is open at: http://127.0.0.1:${host}`)