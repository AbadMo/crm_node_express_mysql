const express = require('express');
const router = express.Router();

const conn = require('../mysql');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await conn.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    console.log("Llegando a admin");
    const contactos = await conn.query('SELECT * FROM contactos WHERE user_id = ?', [req.user.id]);
    res.render('admin/dashboard', { contactos });
});
/**********************USERS******************************* */
router.get('/users', isLoggedIn, async (req, res) => {
    console.log("Llegando a usuarios");
    const usuarios = await conn.query('SELECT * FROM users');
    res.render('admin/users/users', { usuarios });
});
router.get('/user_add', isLoggedIn, (req, res) => {
    res.render('admin/users/user_add');
});
router.get('/user_edit/:id', async (req, res) => {
    const { id } = req.params;
    const user = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
    console.log(user);
    res.render('admin/users/user_edit', {user: user[0]});
})

router.get('/editando', isLoggedIn, async (req, res) => {
    console.log("Llegando a admin");
    const contactos = await conn.query('SELECT * FROM contactos WHERE user_id = ?', [req.user.id]);
    res.render('admin/dashboard', { contactos });
});
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await conn.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await conn.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await conn.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});

module.exports = router;