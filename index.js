const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => {
    res.send('Get All Mobiles')
})
app.get('/:id', (req, res) => {
    res.send('Get a Mobile by ID')
})
app.post('/', (req, res) => {
    res.send('Create Mobile')
})
app.put('/:id', (req, res) => {
    res.send('Update Mobile Data by ID')
})
app.delete('/:id', (req, res) => {
    res.send('Delete Mobile Data by ID')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})