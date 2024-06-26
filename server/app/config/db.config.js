module.exports = {
  HOST: process.env.POSTGRES_HOST,
  USER: process.env.POSTGRES_USERNAME,
  PASSWORD: process.env.POSTGRES_PASSWORD,
  DB: process.env.POSTGRES_DATABASE,
  dialect: "postgres",
  dialectOptions: {
    charset: 'utf8',
},
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};