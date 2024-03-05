import { Container, Navbar, Modal, Form, Button, Alert } from 'react-bootstrap';
import { Pen } from 'react-bootstrap-icons';
import { useEffect, useState, useContext } from "react";
import UserContext from './UserContext';
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';
import { login, logout, getWebSiteName, editWebSiteName } from './API';


import 'bootstrap/dist/css/bootstrap.min.css';


import { PageList } from "./PageList";
import { PageContent } from "./PageContent";
import {PageNotFound} from "./PageNotFound"




function App() {
  const [user, setUser] = useState() ;
  const handleUser = (u) => setUser(u);
  return (
    <UserContext.Provider value={user}>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout handleUser={handleUser}/>}>
          <Route index element={<PageList/>} />
          <Route path='/pages/:pageId' element={<PageContent/>}/>
          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  )
}







function MainLayout(props) {
  const user = useContext(UserContext) ;

  const [webSiteName, setWebSiteName] = useState('') ;

  useEffect(() => {
    getWebSiteName().then((name) => setWebSiteName(name));
  }, []);

  
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleLogout = async () => {
    await logout() ;
    props.handleUser();
  };



  const [showEditNameModal, setShowEditNameModal] = useState(false);

  const handleShowEditNameModal = () => setShowEditNameModal(true);
  const handleCloseEditNameModal = () => setShowEditNameModal(false);

  const handleEditWsName = async (wsName) => {
    await editWebSiteName(wsName);
    const name = await getWebSiteName();
    if(name)
      setWebSiteName(name);
    setShowEditNameModal(false);
  }



  return <>
    <header>
      <Navbar sticky="top" variant='dark' bg="success" expand="lg" className='mb-3'>
        <Container>
          <Navbar.Brand>
            <Link to='/' style={{ color: 'white', textDecoration: 'none' }}>{webSiteName}</Link>
            {user && user.role === "admin" &&<>  <Link onClick={handleShowEditNameModal} style={{ color: 'white', textDecoration: 'none' }}><Pen/></Link></>}
          </Navbar.Brand>
          <Navbar.Text>
            {user && <span>{user.name} - <Link onClick={handleLogout} style={{ color: 'white' }}>Logout</Link></span>}
            {!user && <span>Guest - <Link onClick={handleShowLoginModal} style={{ color: 'white' }}>Login</Link></span>}
          </Navbar.Text>
        </Container>
      </Navbar>
    </header>
    <main>
      <Container>
        <Outlet />
      </Container>
      {/* <Navbar fixed="bottom" bg="light" variant="light">
        <Container>
          <Navbar.Text>
            Borella Simone s317774
          </Navbar.Text>
        </Container>
      </Navbar> */}


      <LoginModal show={showLoginModal} handleClose={handleCloseLoginModal} handleUser={props.handleUser}/>
      <EditNameModal show={showEditNameModal} initWsName={webSiteName} handleClose={handleCloseEditNameModal} handleEditWsName={handleEditWsName}/>
        
    </main>
  </>
}








function LoginModal(props){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{
    setEmail('');
    setPassword('');
  }, [props.show])

  const [errorMsg, setErrorMsg] = useState('') ;
  useEffect(()=>{
      if(errorMsg) {
          setTimeout(()=>{setErrorMsg('')}, 2000);
      }
  }, [errorMsg]);

  const handleLogin = async () => {
    if(!email)
      setErrorMsg('Empty email field');
    else if(!password)
      setErrorMsg('Empty password field');
    else{
      try{
        const user = await(login(email, password));
        props.handleUser(user);
        props.handleClose();
      }
      catch(error){
        setErrorMsg('Wrong email or password');
      }
    }      
  };

  return <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
              <Form.Group className="mb-3" controlId="username">
              <Form.Label>Email</Form.Label>
              <Form.Control value={email} type="email" placeholder="Email" autoFocus
                  onChange={(ev => {setEmail(ev.target.value)})}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control value={password} type="password" placeholder="Password" autoFocus
                  onChange={(ev => {setPassword(ev.target.value)})}/>
              </Form.Group>
          </Form>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
              Cancel
          </Button>
          <Button variant="success" onClick={handleLogin}>
              Login
          </Button>
          </Modal.Footer>
        </Modal>
}








function EditNameModal(props){
  const [wsName, setWsName] = useState(props.initWsName);

  useEffect(()=>{
    setWsName(props.initWsName);
  }, [props.show])

  const [errorMsg, setErrorMsg] = useState('') ;
  useEffect(()=>{
      if(errorMsg) {
          setTimeout(()=>{setErrorMsg('')}, 2000);
      }
  }, [errorMsg]);

  
  const maxWsNameLength = 20;

  const handleEditWsName = () => {
    if(!wsName)
      setErrorMsg('Empty website name field');
    else if(wsName.length > maxWsNameLength)
      setErrorMsg('Website name too long');
    else{
      props.handleEditWsName(wsName);
    }    
  }

  return <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Edit website name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
              <Form.Group className="mb-3" controlId="username">
              <Form.Label>Website name</Form.Label>
              <Form.Control value={wsName} type="text" placeholder="Name" autoFocus
                  onChange={(ev => {setWsName(ev.target.value)})}/>
              </Form.Group>
          </Form>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
              Cancel
          </Button>
          <Button variant="success" onClick={handleEditWsName}>
              Save
          </Button>
          </Modal.Footer>
        </Modal>;
}


export default App
