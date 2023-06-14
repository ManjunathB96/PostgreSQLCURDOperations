import sequelize, { DataTypes } from '../config/database';
const User = require('../models/user')(sequelize, DataTypes);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//get all users
export const getAllUsers = async () => {
  const data = await User.findAll();
  return data;
};

//create new user
export const newUser = async (body) => {
  const hash = await bcrypt.hashSync(body.password, 10);
  body.password = hash;
  const data = await User.create(body);
  return data;
};
//create new user
export const userLogin = async (body) => {
  const data = await User.findOne({ where: { email:body.email} });
  if (data && bcrypt.compareSync(body.password, data.password)) {
    const token = await jwt.sign({ id: data.id, email: data.email },process.env.SECRET_kEY);
    return token;
  } else {
    throw new Error('Invalid credentials');
  }
};

//update single user
export const updateUser = async (id, body) => {
  await User.update(body, {
    where: { id: id }
  });
  return body;
};

//delete single user
export const deleteUser = async (id) => {
  await User.destroy({ where: { id: id } });
  return '';
};

//get single user
export const getUser = async (id) => {
  const data = await User.findByPk(id);
  return data;
};
