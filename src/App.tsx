import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import MainPage from './componentes/MainPage/MainPage';
import Registro from './componentes/Registro/Registro';
import InicioSesion from './componentes/InicioSesion/InicioSesion';
import RecuperarCuenta from './componentes/RecuperarCuenta/RecuperarCuenta';
import Logged from  './componentes/Logged/Logged';
import Confirmacion from  './componentes/Confirmacion/Confirmacion';
import Recuperado from  './componentes/Recuperado/Recuperado';
import NoRecuperado from  './componentes/Recuperado/NoRecuperado';

function App() {
  return (
    <div className="App">
      <Navbar bg="dark"  variant="dark">
        <Navbar.Brand href="#home">
          Micrin
        </Navbar.Brand>
    </Navbar>
    <Router>
        <Switch>
          <Route path='/login' component={InicioSesion} />
          <Route path='/register' component={Registro} />
          <Route path='/recover' component={RecuperarCuenta}/>
          <Route path='/init' exact component={Logged} />
          <Route path='/confirmed' component={Confirmacion} />
          <Route path='/recuperado' component={Recuperado} />
          <Route path='/nrecuperado' component={NoRecuperado} />
          <Route path='/' component={MainPage} /> 
        </Switch>
    </Router>
    </div>
  );
}

export default App;
