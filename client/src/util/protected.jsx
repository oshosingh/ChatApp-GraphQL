import React from 'react'
import {useAuthState} from '../components/context'
import {Redirect, Route} from 'react-router-dom'

export default function Protected(props){
    const {user} = useAuthState()

    if(props.authenticated && !user){
        return(
            <Redirect to="/login" />
        )
    }
    else if(props.guest && user){
        return(
            <Redirect to="/" />
        )
    }
    else{
        return <Route component={props.component} {...props} />
    }
}