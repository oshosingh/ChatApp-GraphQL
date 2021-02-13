import React, {useState} from 'react'
import {Container, Row, Col, Form, Button} from 'react-bootstrap'

export default function Register() {

    const [fields, setFields] = useState({
        email: '', username: '', password: '', confirmPassword: ''
    })

    const submitRegisterForm = e => {
        e.preventDefault();
        console.log(fields)
    }

    return (
        <Container className="p-5">
            <Row className="bg-white py-5 justify-content-center">
                <Col sm={8} md={6} lg={5} >
                    <h1 className="text-center"> Register</h1>
                    <Form onSubmit={submitRegisterForm}>
                        <Form.Group>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={fields.email} 
                                onChange={e => setFields({...fields, email: e.target.value})} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Enter UserName</Form.Label>
                            <Form.Control type="text"value={fields.username} 
                                onChange={e => setFields({...fields, username: e.target.value})} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Enter Password</Form.Label>
                            <Form.Control type="password" value={fields.password} 
                                onChange={e => setFields({...fields, password: e.target.value})} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Enter Confirm Password</Form.Label>
                            <Form.Control type="password" value={fields.confirmPassword} 
                                onChange={e => setFields({...fields, confirmPassword: e.target.value})} />
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="success" type="submit">
                                Register
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
