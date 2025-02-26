const express = require("express");
const path = require("path");
const router = express.Router();
const database = require("../database/database.js");
const multer = require("multer");

const moment = require("moment");
const { estaLogado } = require("../helpers/logado.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/");
  },

  filename: (req, file, cb) => {
    cb(null, req.user.id + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Página do perfil
router.get("/perfil", estaLogado, (req, res) => {
  database
    .select(["nome", "email"])
    .table("usuarios")
    .where({ id: req.user.id })
    .then((perfil) => {
      //console.log(perfil);
      res.render("admin/perfil", { perfil: perfil });
    })
    .catch((erro) => {
      console.log(erro);
    });
});

// Página de registro de refeição
router.get("/cadastroref", (req, res) => {
  database
    .select(["id", "nome"])
    .table("tipo_refeicao")
    .then((tipo) => {
      res.render("admin/cadastroref", { tipo: tipo });
    })
    .catch((erro) => {
      console.log(erro);
    });
});

// Registro de refeição
router.post("/refeicao/add", upload.single("file"), estaLogado, (req, res) => {
  //console.log(req.file.path);

  let erros = [];

  if (
    !req.body.dataref ||
    typeof req.body.dataref == undefined ||
    typeof req.body.dataref == null
  ) {
    erros.push({ text: "Data da refeição não informada!" });
  }

  if (
    !req.body.timeref ||
    typeof req.body.timeref == undefined ||
    typeof req.body.timeref == null
  ) {
    erros.push({ text: "Horário da refeição não informada!" });
  }

  if (req.body.fastfood != 1) {
    req.body.fastfood = 0;
  }

  if (erros.length > 0) {
    res.render("admin/cadastroref", { erros: erros });
  } else {
    let NovaRef = {
      id_usuario: req.user.id,
      tipo_refeicao: req.body.tiporef,
      fastfood: req.body.fastfood,
      motivacao: req.body.motivacao,
      hora_refeicao: req.body.timeref,
      data_refeicao: req.body.dataref,
      foto: req.file.path,
    };

    database
      .insert(NovaRef)
      .into("refeicoes")
      .then((data) => {
        req.flash("success_msg", "Refeição registrada com sucesso!");
        res.redirect("/admin/perfil");
      })
      .catch((erro) => {
        req.flash("error_msg", "Houve um erro ao criar registrar sua refeição");
      });
  }
});

// Exibição das refeições
router.get("/calendario", estaLogado, (req, res) => {
  res.render("admin/calendario");
});

router.get("/calendario/json", estaLogado, (req, res) => {
  database
    .select([
      "tipo_refeicao",
      "fastfood",
      "motivacao",
      "data_refeicao",
      "hora_refeicao",
    ])
    .table("refeicoes")
    .where({ id_usuario: req.user.id })
    .orderBy("hora_refeicao", "desc")
    .orderBy("data_refeicao", "desc")
    .then((refeicoes) => {
      res.json(refeicoes);
    })
    .catch((erro) => {
      console.log(erro);
    });
});

router.get("/refeicoes", estaLogado, (req, res) => {
  let data = req.query.data;

  database
    .select([
      "tipo_refeicao",
      "fastfood",
      "motivacao",
      "data_refeicao",
      "hora_refeicao",
      "foto",
    ])
    .table("refeicoes")
    .where({ id_usuario: req.user.id })
    .andWhere({ data_refeicao: data })
    .orderBy("hora_refeicao", "desc")
    .orderBy("data_refeicao", "desc")
    .then((refeicoes) => {
      //console.log(refeicoes);
      res.render("admin/exibref", { refeicoes: refeicoes });
    })
    .catch((erro) => {
      console.log(erro);
    });
});

module.exports = router;
