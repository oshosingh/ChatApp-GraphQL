import './App.scss';
import Register from './components/register'
import ApolloProvider from './ApolloProvider'
import {Container} from 'react-bootstrap'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import login from './components/login';
import home from './components/home';

function App() {
  return (
    <ApolloProvider>
      <BrowserRouter> 
        <Container className="pt-5">
          <Switch>
            <Route exact path="/" component={home} />
            <Route path="/login" component={login} />
            <Route path="/register" component={Register} />
          </Switch>
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
