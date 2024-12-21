const Sequelize=require('sequelize');const sequelize=new Sequelize({dialect:'sqlite',storage:'./cmms.sqlite'});module.exports=sequelize;
