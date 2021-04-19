const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//user model 
const User = require('../models/Users');


router.get('/login', (req, res) => {
    res.render('login')
});

router.get('/register', (req, res) => {
    res.render('register')
});

router.post('/register', (req, res) => {
    const { name, email, phone, profession, password, password2 } = req.body;
    let errors = [];

    // check required fields
    if(!name || !email || !phone || !profession || !password || !password2){
        errors.push({ msq: 'please fill in all fields' });
    }
    // check password match
    if(password !== password2){
        errors.push({ msg: 'Password should be at least 6 characters'});
    }

    //check password length
    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if(errors.length > 0){
        res.render('register', {
           errors,
           name,
           email,
           phone,
           profession,
           password,
           password2 
        })
    }else{
       User.findOne({ email: email })
            .then(user => {
                if(user){
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        phone,
                        profession,
                        password,
                        password2 
                     });
                }else{
                    const newUser = new User({
                        name,
                        email,
                        phone,
                        profession,
                        password,
                    });
                    
                    // hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //set password to hashed
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))
                }
            });
    }

})

// login handle 

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
     
});

// logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

// edit profile
router.get('/edit-profile', (req, res) => {
    res.render('edit_profile', {
        user: req.user
    })
    
})

module.exports = router;