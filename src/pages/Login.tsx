import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';

type LoginProps = {
  setLoginState: (state: boolean) => void;
};

export default function Login({
  setLoginState,
}: LoginProps) {

  const login = useCallback(() => {
    setLoginState(true);
  }, [setLoginState]);

  const [signingUp, setSigningUp] = useState<boolean>(false);

  return (
    <Container className="p-5 h-100">
      <Col
        className="mx-auto"
        xs={10}
        sm={7}
        md={5}
        lg={4}
        xl={4}
        xxl={3}
      >
        <Card>
          <Card.Header>
            Login
          </Card.Header>
          <Card.Body>
            <Form onSubmit={login}>
              <Form.Label>
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                className="mb-3"
              />
              <Form.Label>
                Password
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                className="mb-3"
              />
              {signingUp && (
                <>
                  <Form.Label>
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm password"
                    className="mb-3"
                  />
                </>
              )}
              <Form.Group
                controlId="submit"
                className="mb-1"
              >
                <Button id="submit" type="submit">
                  Submit
                </Button>
              </Form.Group>
              <Form.Text
                className="text-primary"
                onClick={() => setSigningUp(!signingUp)}

              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>
                  {signingUp ? 'Log In' : 'Sign Up'}
                </a>
              </Form.Text>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}