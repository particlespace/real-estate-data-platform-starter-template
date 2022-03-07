import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Nav, Navbar } from 'react-bootstrap';
import Home from './pages/Home';
import logo from './logo_upscaled_198_138.png';
import githubIcon from './GitHub-Mark-64px.png';

function App() {
  return (
    <div>
      <Container>
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
          {true ? (
            <Container>
              <Home />
            </Container>
          ) : (
            <Col
              className="mx-auto"
              xs={6}
            >
              <Card>
                <Card.Body>
                  This project requires a valid <code>.env</code> file to function.
                  Add your keys to the <code>.env</code> file in the root projec and try again.
                  See <a href="">here</a>
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
