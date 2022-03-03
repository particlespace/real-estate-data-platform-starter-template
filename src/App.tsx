import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Nav, Navbar } from 'react-bootstrap';

function App() {
  return (
    <div>
      <Container>
        <Navbar>
          <Navbar.Brand href="/" className="me-auto">
            Particle Space Real Estate Data Platform Starter
          </Navbar.Brand>
        </Navbar>
        <Row>
          {Math.random() > 0.5 ? (
            <p>Home</p>
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
