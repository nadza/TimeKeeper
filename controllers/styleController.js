const styleMiddleware = (req, res, next) => {
    res.locals.showNavbar = false;
    res.locals.showAuthStyle = false;
    res.locals.showNavbarStyle = false;
    res.locals.showHomeStyle = false;
    res.locals.userRole = 'user';
    res.locals.showAdminUserStyle = false;
    res.locals.successMessage = false;
    res.locals.showUserScript = false;
    res.locals.showProjectScript = false;
    res.locals.showTasksScript = false;
    res.locals.showUserProjectScript = false;
    res.locals.showUserProfileStyle = false;
    res.locals.showUserEditScript = false;

    if (req.user) {
        res.locals.username = req.user.username || '';
    } else {
        res.locals.username = '';
    }

    if (req.path === '/register') {
        res.locals.showAuthStyle = true;
    }
    else if (req.path === '/login') {
        res.locals.showAuthStyle = true;
    }
    else if (req.path === '/login') {
        res.locals.showNavbar = true;
        res.locals.showNavbarStyle = true;
    }
    else if (req.path === '/home') {
        res.locals.showNavbar = true;
        res.locals.showNavbarStyle = true;
        res.locals.showHomeStyle = true;
    } else if (req.path === '/admin/users') {
        res.locals.showNavbar = true;
        res.locals.showNavbarStyle = true;
        res.locals.userRole = 'admin';
        res.locals.showAdminUserStyle = true;
        res.locals.showUserScript = true;
    } else if (req.path === '/admin/projects') {
        res.locals.showNavbar = true;
        res.locals.showNavbarStyle = true;
        res.locals.userRole = 'admin';
        res.locals.showAdminUserStyle = true;
        res.locals.showProjectScript = true;
    } else if (req.path.startsWith('/projects/')) {
        res.locals.showNavbar = true;
        res.locals.showNavbarStyle = true;
        res.locals.showTasksScript = true;
    } else if (req.path.startsWith('/users/')) {
        res.locals.showNavbar = true;
        res.locals.showNavbarStyle = true;
        res.locals.showUserProjectScript = true;
        res.locals.showUserProfileStyle = true;
        res.locals.showUserEditScript = true;
    } else if (req.path.startsWith('/chat')) {
        res.locals.showNavbar = true;
        res.locals.showNavbarStyle = true;
    } else if (req.path.startsWith('/reports')) {
        res.locals.showNavbar = true;
        res.locals.showNavbarStyle = true;
    }



next();

    //dodat rutu za to i dat samo da nemma navbar i obicna stranica koja vodi na home :D
};

module.exports = styleMiddleware;
