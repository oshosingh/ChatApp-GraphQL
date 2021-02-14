import React, {useState} from 'react'
import {Container, Row, Col, Form, Button} from 'react-bootstrap'
import {gql, useLazyQuery} from '@apollo/client'
import {Link} from 'react-router-dom'
import {useAuthDispatch} from './context'

export default function Login(props) {

    const LOGIN_USER = gql`
        query login($username: String!  $password: String!) {
            login(username: $username password: $password) {
                username email createdAt token
            }
        }
    `;

    const [errors, setErrors] = useState({})
    const dispatch = useAuthDispatch()

    const [loginUser, {loading}] = useLazyQuery(LOGIN_USER, {
        onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
        onCompleted(data){
            dispatch({type: "LOGIN", payload: data.login})
            props.history.push('/')
        }
    })

    const [variables, setVariables] = useState({
        username: '',
        password: ''
    })

    const submitLoginForm = e => {
        e.preventDefault()
        loginUser({variables})
    }

    return (
        <Container className="p-5">
            <Row className="bg-white py-5 justify-content-center">
                <Col sm={8} md={6} lg={5} >
                    <h1 className="text-center"> Login</h1>
                    <Form onSubmit={submitLoginForm}>
                        <Form.Group>
                            <Form.Label className={errors.username && "text-danger"}>Enter UserName</Form.Label>
                            <Form.Control className={errors.username && "is-invalid"} type="text"value={variables.username} 
                                onChange={e => setVariables({...variables, username: e.target.value})} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className={errors.password && "text-danger"}>Enter Password</Form.Label>
                            <Form.Control className={errors.password && "is-invalid"} type="password" value={variables.password} 
                                onChange={e => setVariables({...variables, password: e.target.value})} />
                        </Form.Group>

                        <div className="text-center">
                            <Button variant="success" type="submit" disabled= {loading}>
                                {loading ? 'loading..' : 'Register' }
                            </Button>
                            <br />
                            <small> Don't have an account?<Link to="/register">Register</Link></small>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
