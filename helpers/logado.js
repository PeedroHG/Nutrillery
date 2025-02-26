module.exports = {
    estaLogado: (req, res, next) => {

        if (req.isAuthenticated()) {

            return next();
        } 

        req.flash("errror_msg", "Você deve estar logado para acessar")
        res.redirect("/usuarios/login")
    }
}