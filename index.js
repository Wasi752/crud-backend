const express = require('express')
const app = express()
const port = 3001
const fs = require('fs')
const { parse } = require('path')
const bodyParser = require('body-parser');
const cors = require("cors");
const { json } = require('express')
const { stringify } = require('querystring')
const { body, check, validationResult } = require('express-validator');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static("public"))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // <= Accept credentials (cookies) sent by the client
}));


app.get('/', (req, res) => {
    fs.readFile('mobileData', 'utf8', (err, data) => {
        const allData = JSON.parse(data)
        res.send(JSON.stringify(allData.mobileData));
    });
});

app.get('/:id', (req, res) => {
    res.send('Get a Mobile Data by ID')
})
app.post('/',
    check('price')
        .isLength({ min: 4 })
        .withMessage('price must be at least 4 digits')
        .matches(/^[0-9]*$/)
        .withMessage('must contain a number'),
    check('config')
        .isLength({ min: 20 })
        .withMessage('must be at least 20 chars long'),
    check('brandName')
        .isLength({ min: 4 })
        .withMessage('must be at least 4 chars long'),
    check('modelName')
        .isLength({ min: 5 })
        .withMessage('must be at least 5 chars long'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        fs.readFile('mobileData', 'utf8', (err, data) => {
            const allData = JSON.parse(data)
            const reqData = req.body;
            const rawImageString = reqData.image.replace(/^data:image\/jpeg;base64,/, "");
            const buffer = Buffer.from(rawImageString, "base64");
            reqData.id = allData.mobileData.length + 1;
            fs.writeFile(`public/mobilePicture/${reqData.id}.jpeg`, buffer, () => { });
            reqData.image = `${reqData.id}.jpeg`;
            allData.mobileData.push(reqData);
            fs.writeFile("mobileData", JSON.stringify(allData), () => { });
            res.send(JSON.stringify(reqData));
        });
    });
app.put('/:id', (req, res) => {
    fs.readFile("mobileData", 'utf8', (err, data) => {
        const allData = JSON.parse(data)
        const mobileInfoByID = allData.mobileData.find(x => x.id == req.params.id);
        mobileInfoByID.brandName = req.body.brandName;
        mobileInfoByID.modelName = req.body.modelName;
        mobileInfoByID.config = req.body.config;
        mobileInfoByID.price = req.body.price;
        mobileInfoByID.inStock = req.body.inStock;
        fs.writeFile("mobileData", JSON.stringify(allData), () => { })
        res.send(JSON.stringify(mobileInfoByID))
    })
})
app.delete('/:id', (req, res) => {
    fs.readFile("mobileData", 'utf8', (err, data) => {
        const allData = JSON.parse(data)
        const mobileInfoByID = allData.mobileData.find(x => x.id == req.params.id);
        mobileInfoByID.brandName = req.body.brandName;
        mobileInfoByID.modelName = req.body.modelName;
        mobileInfoByID.config = req.body.config;
        mobileInfoByID.price = req.body.price;
        mobileInfoByID.inStock = req.body.inStock;
        mobileInfoByID.image = req.body.image;
        mobileInfoByID.id = req.body.id;
        fs.writeFile("mobileData", JSON.stringify(allData), () => { })
        res.send(JSON.stringify(mobileInfoByID))
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})