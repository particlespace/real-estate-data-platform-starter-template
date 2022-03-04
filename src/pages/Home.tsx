import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import Row from 'react-bootstrap/Row';
import { useState, useMemo, useCallback } from 'react';
import Map from '../components/Map';
import Button from 'react-bootstrap/Button';
import { verifyAddress, searchProperty } from '../apiOperations';
import { Card, Form, FormGroup, Offcanvas } from 'react-bootstrap';
import '../code.css';

type verifyState = {
  isLoading: boolean;
  isError: boolean;
  data: any;
}

type searchState = {
  isLoading: boolean;
  isError: boolean;
  data: any;
}

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const [verifyState, setVerifyState] = useState<verifyState>({
    isLoading: false,
    isError: false,
    data: null,
  });

  const [searchState, setSearchState] = useState<searchState>({
    isLoading: false,
    isError: false,
    data: null,
  });

  const address = useMemo(() => {
    if (selectedPlace) {
      if (selectedPlace.formatted_address) {
        const [streetAddress, city, stateZip, country] = selectedPlace.formatted_address.split(', ');
        if (stateZip) {
          const [state, zip] = stateZip.split(' ');
          return {
            streetAddress,
            city,
            state,
            zip,
            country,
          };
        }
      }
    }
    return null;
  }, [selectedPlace]);

  const handleVerifyAddress = useCallback(async () => {
    setVerifyState({
      ...verifyState,
      isLoading: true,
    });
    verifyAddress(address).then(data => {
      console.log(data);
      setVerifyState({
        ...verifyState,
        isLoading: false,
        isError: false,
        data,
      });
    }).catch(error => {
      setVerifyState({
        isLoading: false,
        isError: true,
        data: error,
      });
    });
  }, [address, verifyState]);

  const handleSearchAddress = useCallback(async () => {
    setSearchState({
      ...searchState,
      isLoading: true,
    });
    searchProperty(address).then(data => {
      console.log(data);
      setSearchState({
        ...searchState,
        isLoading: false,
        isError: false,
        data,
      });
    }).catch(error => {
      setSearchState({
        isLoading: false,
        isError: true,
        data: error,
      });
    });
  }, [address, searchState]);

  return (
    <Row>
      <Col>
        <Map
          selectedPlace={selectedPlace}
          setSelectedPlace={(place: any) => {
            setSelectedPlace(place);
            setVerifyState({
              isLoading: false,
              isError: false,
              data: null,
            });
            setSearchState({
              isLoading: false,
              isError: false,
              data: null,
            });
          }}
        />
      </Col>
      <Offcanvas
        show={!!selectedPlace}
        onHide={() => setSelectedPlace(null)}
      >
        <Card className="h-100">
          <Card.Header>
            <Card.Title>
              Actions
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-2">
              <Button
                className="mx-auto"
                variant="primary"
                onClick={handleVerifyAddress}
              >
                Verify Address
              </Button>
              <Button
                className="ms-3"
                variant="primary"
                onClick={handleSearchAddress}
              >
                Search Property
              </Button>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>
                Verified Result
              </Form.Label>
              <Form.Control
                type="text"
                className="code"
                readOnly
                value={
                  verifyState.isLoading ? 'Loading...' :
                    verifyState.isError ? 'Error' :
                      verifyState.data !== null ? JSON.stringify(verifyState.data) :
                        'No Data'
                }
              >
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>
                Search Result
              </Form.Label>
              <Form.Control
                as="textarea"
                className="code"
                readOnly
                //rows="auto"
                style={{ height: 'calc(100vh - 216px - 16px)' }}
                value={
                  searchState.isLoading ? 'Loading...' :
                    searchState.isError ? 'Error' :
                      searchState.data !== null ? JSON.stringify(searchState.data, null, 2) :
                        'No Data'
                }
              />
            </Form.Group>
          </Card.Body>
        </Card>
      </Offcanvas>
    </Row>
  );
}
