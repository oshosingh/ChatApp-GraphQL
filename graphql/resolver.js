const {User} = require('../models')
const bcrypt = require('bcryptjs')
const {UserInputError} = require('apollo-server')

module.exports = {
    Query: {
      getUsers: async () => {
          try{
              const users = User.findAll();
              return users;
          }
          catch(err){
              console.log(err);
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