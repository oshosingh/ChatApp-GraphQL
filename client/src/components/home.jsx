import React from 'react'
import {Row, Col, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {useAuthDispatch} from './context'
import {gql, useQuery} from '@apollo/client'

export default function Home(props) {

    const GET_USERS = gql`
        query getUsers{
            getUsers{
                username email createdAt
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
            <div key={found.username}>
                <p>  {found.username}</p>
            </div>)
        } )
    }

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
                <Col xs={4}>
                    {usersMarkup}
                </Col>
                <Col xs={8}>
                    <p> Messages </p>
                </Col>
            </Row>
        </>
    )
}
