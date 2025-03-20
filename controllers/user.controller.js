const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const registerLoad = async (req, res) => {
    try {
        res.render('register', { message: null });
    } catch (error) {
        console.error(error.message);
    }
}

const register = async (req, res) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            image: 'images/' + req.file.filename,
            password: passwordHash
        });

        await user.save();

        res.render('register', { message: "Your registrations has been completed" });

    } catch (error) {
        console.error(error.message);
    }
}

const loadLogin = async (req, res) => {
    try {
        res.render('login', { message: null });
    } catch (error) {
        console.error(error.message);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });
        if (!userData) return res.render('login', { message: "Email and password is incorrect." });

        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) return res.render('login', { message: "Email and password is incorrect." });

        req.session.user = userData;
        return res.redirect('/dashboard');

    } catch (error) {
        console.error(error.message);
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        return res.redirect('/');
    } catch (error) {
        console.error(error.message);
    }
}

const loadDashboard = async (req, res) => {
    try {
        return res.render('dashboard', { user: req.session.user });
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboard
}