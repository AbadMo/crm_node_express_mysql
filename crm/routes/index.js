const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log("llegando para index");
    res.render('index');
});

module.exports = router;