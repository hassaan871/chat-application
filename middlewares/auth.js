const isLogin = (req, res, next) => {
    try {
        if(!req.session.user) return res.redirect('/');
        next();
    } catch (error) {
        console.error(error.message);
    }
}

const isLogout = (req, res, next) => {
    try {
        if(req.session.user) return res.redirect('/dashboard');
        next();
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}