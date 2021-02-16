import './App.scss';
import Register from './components/register'
import ApolloProvider from './ApolloProvider'
import {Container} from 'react-bootstrap'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import login from './components/login';
import home from './components/home/home';
import {AuthProvider} from './components/context'
import Protected from './util/protected'

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter> 
          <Container className="pt-5">
            <Switch>
              <Protected exact path="/" component={home} authenticated/>
              <Protected path="/login" component={login} guest/>
              <Protected path="/register" component={Register} guest/>
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
