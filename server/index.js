const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/dev');
const FakeDb = require('./fake-db');

const rentalRoutes = require('./routes/rentals')
const userRoutes = require('./routes/users');

mongoose.connect(config.DB_URI).then(() => {
    const fakeDb = new FakeDb();
    //fakeDb.seedDb();
});

const app = express();
app.use(bodyParser.json());

app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes);

/*app.get('/rentals/:id', function(req, res) {
    const id = req.params.id;
    Rental.findById(id,function(err, foundRental){
        res.json(foundRental);
    });
    res.json({'success': true});
})*/

const PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
    console.log('Server started');
});

