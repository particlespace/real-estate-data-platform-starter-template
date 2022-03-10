import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Navbar } from 'react-bootstrap';
import Home from './pages/Home';
import logo from './logo_upscaled_198_138.png';
import githubIcon from './GitHub-Mark-64px.png';
import { useRef, useState } from 'react';
import env from 'react-dotenv';
import Login from './pages/Login';

/**
 * Checks whether the necessary environment variables are set using
 * React dotenv.
 */
function validateKeys(): boolean {
  console.log(env);
  if (!env) {
    return false;
  }
  const requiredKeys = [
    'PS_PUBLISH_KEY',
    'PS_SECRET_KEY',
    'GOOGLE_MAPS_KEY',
  ];
  const missingKeys = requiredKeys.filter(key => !env[key]);
  console.log(`Missing keys: ${missingKeys}`);
  if (missingKeys.length > 0) {
    console.error(`Missing environment variables: ${missingKeys.join(', ')}`);
    return false;
  }
  return true;
}

function App() {
  /**
   * Retain a reference for the life of the app as whether the envVars are set or not
   */
  const keysPresent = useRef<boolean>(
    validateKeys()
  );

  /**
   * State for mock login
   */
  const [loginState, setLoginState] = useState<boolean>(false);

  return (
    <div>
      <Container fluid="md">
        <Navbar>
          <Navbar.Brand href="/" className="me-auto">
            <img
              style={{ height: '30px' }}
              alt="logo"
              src={logo}
            />
            Particle Space Real Estate Data Platform Starter
          </Navbar.Brand>
          <Navbar.Brand
            href="https://github.com/particlespace/real-estate-data-platform-starter-template"
            target="_blank"
          >
            <img
              src={githubIcon}
              alt="github"
              style={{ height: '32px' }}
            />
          </Navbar.Brand>
        </Navbar>
        <Row>
          {keysPresent.current === true ? (
            loginState === true ? (
              <Container>
                <Home />
              </Container>
            ) : (
              <Login setLoginState={setLoginState} />
            )
          ) : (
            <Col
              className="mx-auto"
              xs={6}
            >
              <Card>
                <Card.Body>
                  This project requires a valid <code>.env</code> file to function.
                  Add your keys to the <code>.env</code> file in the root project and try again.
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default App;
