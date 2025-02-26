// Carregando módulos
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const multer = require("multer");
const moment = require("moment");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash")
const admin = require("./routes/admin");
const usuarios = require("./routes/usuario");

const passport = require("passport")
require("./config/auth.js")(passport)

// Carregando Rotas

// Config data
const data = new Date();
const dia = String(data.getDate()).padStart(2, "0")
const mes = String(data.getMonth() + 1).padStart(2, "0")
const ano = String(data.getFullYear())
const hora = String(data.getHours())
const min = String(data.getMinutes())


// Configurações 

    // Session
        app.use(session({
            secret: "nutrillery",
            resave: true,
            saveUninitialized: true
        }))
        
    // Passport
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
        
    // Middlewere
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")

            res.locals.error = req.flash("error")
            res.locals.dataAtual = `${ano}-${mes}-${dia}`
            res.locals.horaAtual = `${hora}:${min}`

            res.locals.user = req.user || null;
            next();
        })

    // BodyParser
        app.use(bodyParser.urlencoded({extend: true}));
        app.use(bodyParser.json());

    // Handlebars
        app.engine('handlebars', handlebars.engine({
            defaultlayout: 'main',
            helpers: {
                formatDate: (date) => {
                    return moment(date).format("DD/MM/YYYY")
                }
            }
        }));

        app.set('view engine', 'handlebars');


    // Public
        app.use("/public", express.static(path.join(__dirname, "/public")));

        
// Rotas

    app.use("/admin", admin);
    app.use("/usuarios", usuarios);


// Liganto Servidor
const port = 8080;
app.listen(port, () => {
    console.log("Acesse: http://localhost:8080/")
})