const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const  userSchema = new Schema({
    username : { 
        type : String, 
        min:[4, 'Too short, min is 4 chars'], 
        max:[32,'Too long, max is 32 chars']
    },
    email : {
        type : String, 
        min:[4, 'Too short, min is 4 chars'], 
        max:[32,'Too long, max is 32 chars'],
        unique:true,
        lowercase:true,
        required:'Email is required',
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password : {
         type: String,
         min:[4, 'Too short, min is 4 chars'], 
         max:[32,'Too long, max is 32 chars'],
         required:'Password is required'
    },
    rentals:[{type: Schema.Types.ObjectId, ref:'Rental'}],
    bookings:[{type: Schema.Types.ObjectId, ref:'Booking'}]
});

userSchema.methods.hasSamePassword = function (requestedPassword){
    return bcrypt.compareSync(requestedPassword, this.password);
}

userSchema.pre('save', function(next) {
    const user = this;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);