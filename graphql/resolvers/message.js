const {Message, User} = require('../../models')
const {UserInputError, AuthenticationError, PubSub} = require('apollo-server')
const {Op} = require('sequelize')

const pubsub = new PubSub()

module.exports = {
    Query: {
        getMessages: async (parent, {from}, {user}) =>{
            try{
                if(!user){
                    throw new AuthenticationError('UnAuthenticated')
                }

                const otherUser = await User.findOne({
                    where: {username: from}
                })

                if(!otherUser){
                    throw new UserInputError('User not found')
                }
                const userNames = [user.username, otherUser.username]

                const messages = await Message.findAll({
                    where: {
                        from : {[Op.in]: userNames},
                        to: {[Op.in]: userNames}
                    },
                    order: [['createdAt', 'DESC']]
                })

                return messages

            }catch(err){
                console.log('err')
                throw err
            }
        }
    },
    Mutation: {
        sendMessage: async(parent, {to, content}, {user}) => {
            try{
                if(!user){
                    throw new AuthenticationError('UnAuthenticated')
                }
                const recipient = await User.findOne({
                    where: {username: to}
                })
                if(!recipient){
                    throw new UserInputError('User not found')
                }else if(recipient.username===user.username){
                    throw new UserInputError('You Cant message yourself')
                }

                if(content.trim()===''){
                    throw new UserInputError('Message is Empty')
                }

                const message = await Message.create({
                    from: user.username,
                    to,
                    content
                })

                pubsub.publish('NEW_MESSAGE', {newMessage: message})

                return message;
            }
            catch(err){
                console.log(err)
                throw err;
            }
        }
    },
    Subsription: {
        newMessage: {
            subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE'])
        },
    }
  };