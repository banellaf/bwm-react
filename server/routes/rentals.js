const express = require('express');
const router = express.Router();

const UserCtrl = require('../controllers/user');
const Rental = require('../models/rental');
const User = require('../models/user');
const {normalizeErrors} = require('../helpers/mongoose');


router.get('/:id', function(req, res) {
    const rentalId = req.params.id;

    Rental.findById(rentalId)
    .populate('user', 'username -_id')
    .populate('bookings', 'startAt endAt -_id')
    .exec(function(err, foundRental){
        if (err){
            return res.status(422).send({errors: normalizeErrors(err.errors)}); 
        }

        res.json(foundRental);
    });
});

router.post('', UserCtrl.authMiddleware, function(req, res){
    const { title, city, street, category, image, shared, bedrooms, description, dailyRate} = req.body;
    const user = res.locals.user;

    const rental = new Rental({ title, city, street, category, image, shared, bedrooms, description, dailyRate} );
    rental.user = user;

    Rental.create(rental, function(err, newRental){
        if (err){
            return res.status(422).send({errors: normalizeErrors(err.errors)}); 
        }

        User.update({_id: user.id}, { $push : {rentals : newRental}}, function(){});
        
        return res.json(newRental);
    })
})

router.get('', function(req, res){
    const city = req.query.city;
    const query = city ? {city:city.toLowerCase()} : {};
debugger;
    Rental.find(query)
    .select('-bookings')
    .exec( function(err, foundRentals){
            if (err){
                return res.status(422).send({errors: normalizeErrors(err.errors)}); 
            }
            if (city && foundRentals.length === 0){
                return res.status(422).send ({errors: [{title : 'No Rental found', detail:`There are no rentals for city : ${city}`}]});
            }
            console.log(foundRentals);
            return res.json(foundRentals);
    });
});

router.get('/secret', UserCtrl.authMiddleware,function(req, res){
    res.json({"secret":true});
})

router.get('', function(req, res) {
    Rental.find({})
        .select('-bookings')
        .exec( function(err, foundRentals){
                res.json(foundRentals);
              });
});

module.exports = router;