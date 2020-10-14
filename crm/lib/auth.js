module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            console.log("isAuthenticated");
            return next();
        }
        console.log("not isAuthenticated");
        return res.redirect('/signin');
    }
};