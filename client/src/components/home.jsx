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
        </>
    )
}
