const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();


const payload = {
    File: 'QueueBuilderFileGenerator',
};

const secretKey = process.env.JwtSecretKey;

const options = {
    expiresIn: '315360000',
};

/* Es importante correr este script antes para poder generar un token
y luego agregarlo a nuestras variables de entorno para que sea un token permanente */

/**
 * @param string, secretKey, options
 * @returns `token`
 */


const token = jwt.sign(payload, secretKey, options);

console.log('Token permanente:', token);
