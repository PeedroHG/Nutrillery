const express = require("express");
const router = express.Router();
const database = require("../database/database.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/registro", (req,res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    
    let erros = [];

    if(!req.body.txtemail || typeof req.body.txtemail == undefined || typeof req.body.txtemail == null) {
        erros.push({texto: "E-mail inválido"})
    } 

    if(!req.body.txtnome || typeof req.body.txtnome == undefined || typeof req.body.txtnome == null) {
        erros.push({texto: "Nome inválido"})
    } 

    if(!req.body.txtpass || typeof req.body.txtpass == undefined || typeof req.body.txtpass == null) {
        erros.push({texto: "Senha inválida"})
    }
    
    if(req.body.txtpass.length < 4) {
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.txtpass != req.body.txtpass2) {
        erros.push({texto: "As senha são diferentes, tente novamente"})
    }

    if(erros.length > 0) {

        res.render("usuarios/registro", {erros: erros})

    } else {

        database.select("*").table("usuarios").where({email: req.body.txtemail}).then((user) => {

            
            if(user.length > 0) {

                req.flash("error_msg", "Ja existe uma conta com esse e-mail no sistema")
                res.redirect("/usuarios/registro")

            } else {
                
                let novoUsuario = {
                    nome: req.body.txtnome,
                    email: req.body.txtemail,
                    senha: req.body.txtpass
                } 

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro) {
                            req.flash("error_msg", "Houve um erro durante o cadastro do usuário")
                            res.redirect("/usuarios/registro")
                        } else {

                            novoUsuario.senha = hash;

                            database.insert(novoUsuario).into("usuarios").then((data) => {
                                req.flash("success_msg", "Usuário registrado com sucesso!")
                                res.redirect("/usuarios/login")
                            }).catch((erro) => {
                                req.flash("error_msg", "Houve um erro durante o cadastro do usuário")
                                res.redirect("/usuarios/registro")
                            })
                        }
                    })
                })
            }

        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro interno")
            console.log("caiu aqui")
            res.redirect("/")
        })
    }


})

router.get("/login", (req, res) => {
    res.render("usuarios/login");
})

router.post("/login", (req, res, next) => {
    
    passport.authenticate("local", {
        successRedirect: "/admin/perfil",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)

})

router.get("/logout", (req, res) => {
    req.logout((erro) => {
        
        if(erro) {
            console.log(erro)
        } else {
            req.flash("success_msg", "Deslogado com sucesso!")
            res.redirect("/usuarios/login")
        }
    })

})

module.exports = router