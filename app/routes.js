// load the todo model
var Todo = require('./models/todo');
var user_id = "";

// expose the routes to our app with module.exports
module.exports = function(app, passport) {
    // get all todos
    app.get('/api/todos/:user_id', function(req, res) {
        user_id = req.params.user_id;
        // use mongoose to get all todos in the database
        Todo.find({user_id : req.params.user_id}, function(err, todos) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {
        var curr_user_id = req.body.user_id
        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.body.text,
            user_id : curr_user_id,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find({user_id : curr_user_id}, function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        console.log('user id: ' + user_id);
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find({user_id : user_id}, function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('index.ejs', { message: req.flash('loginMessage') }); 
    });
    
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    
    app.get('/todos', isLoggedIn, function(req, res) {
        res.render('todos.ejs', {
            user : req.user    
        });
    });
    
    // =====================================
    // LOCAL ROUTES =======================
    // =====================================
    
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/todos',
                    failureRedirect : '/'
            }));

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/todos', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
};
    
    // route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}