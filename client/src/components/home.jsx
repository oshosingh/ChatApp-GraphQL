import React, { useState, useEffect } from 'react'
import {Row, Col, Button, Image} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {useAuthDispatch} from './context'
import {gql, useQuery, useLazyQuery} from '@apollo/client'

export default function Home(props) {

    const [selectedUser, setSelectedUser] = useState(null)

    const GET_USERS = gql`
        query getUsers{
            getUsers{
                username createdAt imageUrl
                latestMessage{
                    uuid from to createdAt content
                }
            }
        }
    `;

    const {loading, data, error } = useQuery(GET_USERS);
    let usersMarkup
    if(!data || loading){
        usersMarkup = <p> Loading .....</p>
    }
    else if(data.getUsers.length===0){
        usersMarkup = <p> No users have joined yet</p>
    }
    else{
        usersMarkup = data.getUsers.map( (found) => {
            return(
            <div className="d-flex p-3" key={found.username} onClick = {() => setSelectedUser(found.username)}>
                <Image src={found.imageUrl} roundedCircle className="mr-2" style={{ width: 50, height:50, objectFit: 'cover' }} />
                <div>
                    <p className="text-success">  {found.username}</p>
                    <p className="font-weight-light">
                        {found.latestMessage ? found.latestMessage.content : 'You are now connected'}
                    </p>
                </div>
            </div>)
        } )
    }

    const GET_MESSAGES = gql`
        query getMessages($from: String!){
            getMessages(from : $from){
                uuid from to content createdAt
            }
        }
    `;
    
    const [getMessages, {loading: messagesLoading, data: messagesData}] = useLazyQuery(GET_MESSAGES)

    useEffect( () => {
        if(selectedUser){
            getMessages({variables: {from: selectedUser}})
        }
    }, [selectedUser] )


    const dispatch = useAuthDispatch()
    const handleLogout = (e) => {
        dispatch({type: "LOGOUT"})
        props.history.push("/login")
    }

    return (
        <>
            <Row className="bg-white justify-content-around">
                <Link to="/login">
                    <Button variant="link"> Login</Button>
                </Link>
                <Link to="/register">
                    <Button variant="link"> Register</Button>
                </Link>
                <Button variant="link" onClick={handleLogout}> Logout</Button>
            </Row>

            <Row className="bg-white mt-2 ">
                <Col xs={4} className="p-0 bg-secondary">
                    {usersMarkup}
                </Col>
                <Col xs={8}>
                    {messagesData && messagesData.getMessages.length>0 ? (
                        messagesData.getMessages.map( message => (
                            <p key={message.uuid}>
                                {message.content}
                            </p>
                        ))
                    ) : <p> You are now connected</p>}
                </Col>
            </Row>
        </>
    )
}
