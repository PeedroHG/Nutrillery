const localStrategy = require("passport-local").Strategy
const database = require("../database/database.js");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {

    passport.use(new localStrategy({usernameField: "txtemail", passwordField: "txtpass"}, (email, senha, done) => {
        
        database.select("*").table("usuarios").where({email: email}).then((user) => {
            
            if(user.length <= 0) {

                return done(null, false, {message: "Esta conta não exite!"})
            }

            bcrypt.compare(senha, user[0].senha, (erro, batem) => {

                if(batem) {
                    return done(null, user[0])
                } else {
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })

    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)

    })

    passport.deserializeUser((id, done) => {
        try{
            database.select("*").where({id: id}).table("usuarios").then((user) => {
                delete user[0].senha
                done(null, user[0])
            })
        }
        catch(erro){
            console.log(erro);
            return done(erro, null);
        }
    })
}