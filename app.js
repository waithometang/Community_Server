const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');

const app = express()
    // require('./db/mongodb')
    //CROS
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});


const port = 3000

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({
        extended: true
    })) // for parsing application/x-www-form-urlencoded
app.use(bodyParser.raw())


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use('/', require('./routes/upload'))
app.use('/login', require('./routes/login'))
app.use('/posts', require('./routes/article'))
app.use('/topic', require('./routes/topic'))
app.use('/private', require('./routes/private'))
app.use(express.static(path.join(__dirname, 'public')))