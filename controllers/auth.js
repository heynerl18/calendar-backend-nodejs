
const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(request, res = response) => {

  const { email, password } = request.body;

  try {

    let user = await User.findOne({ email });
    
    if(user){
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario existe con ese correo'
      });
    }

    user = new User(request.body);

    // * Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // * Generar JWT
    const token = await  generateJWT(user.id, user.name);
  
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }


}

const loginUser = async(request, res = response) => {

  const { email, password } = request.body;

  try {

    const user = await User.findOne({ email });
    
    if(!user){
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese email'
      });
    }

    // * Confirmar los passwords

    const validPassword = bcrypt.compareSync(password, user.password);

    if(!validPassword){
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto'
      })
    }

    // * Generar nuestro JWT 
    const token = await  generateJWT(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }

}

const renewToken = async(req, res = response) => {

  const { uid, name } = req;

  // * Generar nuevo token
  const token = await  generateJWT(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token,
  });
}

module.exports = {
  createUser,
  loginUser,
  renewToken,
}