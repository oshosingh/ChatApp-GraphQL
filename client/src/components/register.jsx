import React, {useState} from 'react'
import {Container, Row, Col, Form, Button} from 'react-bootstrap'
import { gql, useMutation } from '@apollo/client';
import {Link} from 'react-router-dom'

export default function Register(props) {

    const REGISTER_USER = gql`
        mutation register($username: String! $email: String! $password: String! $confirmPassword: String!) {
            register(username: $username email: $email password: $password confirmPassword: $confirmPassword) {
                username email createdAt
            }
        }
    `;
    const [errors, setErrors] = useState({})

    const [register, {loading}] = useMutation(REGISTER_USER, {
        update(cache, res) {
            props.history.push('/login')
        },
        onError(err) {
            console.log(err)
            setErrors(err.graphQLErrors[0].extensions.errors)
        }
    })

    const [variables, setVariables] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const submitRegisterForm = e => {
        e.preventDefault();
        register({variables})
    }

    return (
        <Container className="p-5">
            <Row className="bg-white py-5 justify-content-center">
                <Col sm={8} md={6} lg={5} >
                    <h1 className="text-center"> Register</h1>
                    <Form onSubmit={submitRegisterForm}>
                        <Form.Group>
                            <Form.Label className={errors.username && "text-danger"}>Enter UserName</Form.Label>
                            <Form.Control className={errors.username && "is-invalid"} type="text"value={variables.username} 
                                onChange={e => setVariables({...variables, username: e.target.value})} />
                        </Form.Group>
                        
                        <Form.Group>
                            <Form.Label className={errors.email && "text-danger"}>Email address</Form.Label>
                            <Form.Control className={errors.email && "is-invalid"} type="email" value={variables.email} 
                                onChange={e => setVariables({...variables, email: e.target.value})} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className={errors.password && "text-danger"}>Enter Password</Form.Label>
                            <Form.Control className={errors.password && "is-invalid"} type="password" value={variables.password} 
                                onChange={e => setVariables({...variables, password: e.target.value})} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className={errors.confirmPassword && "text-danger"}>Enter Confirm Password</Form.Label>
                            <Form.Control className={errors.confirmPassword && "is-invalid"} type="password" value={variables.confirmPassword} 
                                onChange={e => setVariables({...variables, confirmPassword: e.target.value})} />
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="success" type="submit" disabled= {loading}>
                                {loading ? 'loading..' : 'Register' }
                            </Button>
                            <br />
                            <small> Already have an account?<Link to="/login">Login</Link></small>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
