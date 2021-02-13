const {User} = require('../models')
const bcrypt = require('bcryptjs')
const {UserInputError, AuthenticationError} = require('apollo-server')
const jwt = require('jsonwebtoken')
const {JWT_SECRET } = require('../config/env.json')
const { Op } = require('sequelize')

module.exports = {
    Query: {
      getUsers: async (parent, args, context) => {
          try{
            let user;
            if(context.req && context.req.headers.authorization){
                const token = context.req.headers.authorization.split('Bearer ')[1]
                jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
                    if(err){
                        throw new AuthenticationError('UnAuthenticated')
                    }
                    user = decodedToken
                })
            }
            
              const users = User.findAll({
                  where: { username: { [Op.ne]: user.username } }
              });
              return users;
          }
          catch(err){
              console.log(err);
              throw err;
          }
      },
      login: async (parent, args) => {
          const { username, password } = args
          let errors = {}

          try{
            if(username.trim()==='') errors.username = 'Username must not be empty'
            if(password === '') errors.password = 'Password must not  be empty'
  
            if(Object.keys(errors).length > 0){
                throw new UserInputError('Bad Input', {errors})
            }
            
            const user = await User.findOne({
                where: { username }
            })

            if(!user){
                errors.username = 'User not found'
                throw new UserInputError('Bad Input', {errors}) 
            }

            const correctPassword = await bcrypt.compare(password, user.password)

            if(!correctPassword){
                errors.password = 'Password is incorrect'
                throw new AuthenticationError('password is incorrect')
            }

            const token = jwt.sign( { username}, JWT_SECRET, { expiresIn: '1h' });
            user.token = token
            return {
                ...user.toJSON(),
                createdAt: user.createdAt.toISOString(),
                token
            }

          }catch(err){
              console.log(err)
              throw err;
          }
      } 
    },
    Mutation: {
        register: async (parent, args) => {
            let {username, email, password, confirmPassword} = args
            let errors = {}

            try{
                // validate input data
                if(email.trim()=== '') errors.email = 'Email must not be empty'
                if(username.trim()=== '') errors.username = 'Username must not be empty'
                if(password.trim()=== '') errors.password = 'Password must not be empty'
                if(confirmPassword.trim()=== '') errors.confirmPassword = 'Repeat Password must not be empty'

                if(password!==confirmPassword) errors.confirmPassword = 'Password must match'

                // check if username/ email exists
                if(Object.keys(errors).length > 0){
                    throw errors
                }
                // Hash Password
                password = await bcrypt.hash(password, 6);

                // create User
                const user = await User.create({
                    username, email, password
                })

                // Return User
                return user;

            }
            catch(err){
                console.log(err)
                if(err.name === 'SequelizeUniqueConstraintError'){
                    err.errors.forEach((e) => (errors[e.path] = `${e.path} is already taken`))
                }
                else{
                    if(err.name === 'SequelizeValidationError'){
                        err.errors.forEach((e) => errors[e.path] = e.message)
                    }
                }
                throw new UserInputError('Bad Input',{errors});
            }
        }
    }
  };