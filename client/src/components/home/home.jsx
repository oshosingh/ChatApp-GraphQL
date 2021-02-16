import React, { useState, useEffect } from 'react'
import {Row, Col, Button, Image} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {useAuthDispatch} from '../context'
import {gql, useLazyQuery} from '@apollo/client'
import Users from './Users'
import Messages from './Messages'

export default function Home(props) {

    const [selectedUser, setSelectedUser] = useState(null)
    const dispatch = useAuthDispatch()
    const handleLogout = (e) => {
        dispatch({type: "LOGOUT"})
        window.location.href = '/login'
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
                <Users setSelectedUser = {setSelectedUser} />
                <Messages selectedUser = {selectedUser} />
            </Row>
        </>
    )
}
