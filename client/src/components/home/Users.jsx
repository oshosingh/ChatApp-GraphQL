import React from 'react'
import {gql, useQuery} from '@apollo/client'
import {Image, Col} from 'react-bootstrap'

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

export default function Users({setSelectedUser}) {
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
        <div className="d-flex p-3" key={found.username}
                style={{cursor: "pointer"}} onClick = {() => setSelectedUser(found.username)}>
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
    return (
        <Col xs={4} className="p-0 bg-secondary">
            {usersMarkup}
        </Col>
    )
}
