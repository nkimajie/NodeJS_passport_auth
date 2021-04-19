const express =  require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user
    })
});


// module.exports = router.get('/login', (req, res) => res.send('ee no da work'));


module.exports = router;