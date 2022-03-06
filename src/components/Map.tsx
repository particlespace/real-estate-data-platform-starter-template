import GoogleMapReact from 'google-map-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import env from 'react-dotenv';

/**
 * Recursively logs key value pairs of an object
 */
const logObject = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      logObject(obj[key]);
    } else {
    }
  });
}

type MarkerProps = {
  lat?: number;
  lng?: number;
}

function Marker({
  lat,
  lng,
}: MarkerProps) {
  return (
    <img
      style={{
        position: 'absolute',
        top: '-50px',
        left: '-25px',
      }}
      src="https://img.icons8.com/ios/50/000000/region-code.png"
      alt="marker"
    />
  );
  }

export type MapProps = {
  selectedPlace: any;
  setSelectedPlace: any;
  boundariesState: any;
}

function Point({
  lat,
  lng,
}: MarkerProps) {
  return (
    <svg
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        //top: '0',
        left: '-15px',
      }}
    >
      <circle
        cx="15"
        cy="15"
        r="15"
        color="red"
        fill="red"
      />
    </svg>
  );
}

export default function Map({
  selectedPlace,
  setSelectedPlace,
  boundariesState,
}: MapProps) {
  const [geocoder, setGeocoder] = useState<any>(null);

  const [center, setCenter] = useState<any>({
    lat: 39.092306123688125,
    lng: -94.58670048764,
  });

  const [zoom, setZoom] = useState<number>(9);

  const [boundaries, setBoundaries] = useState<any>(null);

  const [point, setPoint] = useState<any>(null);

  const poly = useRef<any>(null);

  const selectedLocation = useMemo(() => {
    return {
      lat: selectedPlace?.geometry?.location.lat() || null,
      lng: selectedPlace?.geometry?.location.lng() || null,
    };
  }, [selectedPlace]);

  useEffect(() => {
    if (boundariesState !== null && boundariesState !== boundaries) {
      setBoundaries(boundariesState);
    }
  }, [boundariesState, boundaries]);

  useEffect(() => {
    if (boundaries && boundaries.data) {
      const boundaryData = boundaries.data.boundaries;
      const type = boundaryData?.type;
      const coordinates = boundaryData?.coordinates;
      if (type === 'Polygon') {
        const newPaths = coordinates[0].map(
              ([lng, lat]: [number, number]) => ({
                lat,
                lng,
              })
            )
        poly.current?.setPath(newPaths);
      } else if (type === 'Point') {
        const [lng, lat] = coordinates;
        (lat !== point?.lat || lng !== point?.lng) && setPoint({
          lat,
          lng,
        });
      }
    }
  }, [boundaries, point]);

  return (
    <div style={{ height: 'calc(100vh - 72px)', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: env.GOOGLE_MAPS_KEY,
          libraries: ['places', 'geocoder'],
        }}
        onGoogleApiLoaded={({ map, maps }) => {
          setGeocoder(new maps.Geocoder());
          poly.current = new maps.Polygon({
            paths: [],
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35
          });
          poly.current.setMap(map);
        }}
        yesIWantToUseGoogleMapApiInternals={true}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
        center={center}
        defaultZoom={8}
        zoom={zoom}
        onChange={({ zoom: newZoom, bounds, center: newCenter }) => {
          if (newZoom !== zoom) {
            setZoom(zoom);
          }
          if (newCenter.lat !== center.lat) {
            setCenter(newCenter);
          } else if (newCenter.lng !== center.lng) {
            setCenter(newCenter);
          }
        }}
        onClick={({ lat, lng }) => {
          geocoder && geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            setSelectedPlace(results[0]);
            setCenter({
              lat: selectedPlace?.geometry?.location.lat(),
              lon: selectedPlace?.geometry?.location.lng(),
            });
          });
        }}
      >
        {selectedPlace && (
          <Marker
            lat={selectedLocation.lat}
            lng={selectedLocation.lng}
          />
        )}
        {point?.lat && point?.lng && (
          <Point
            lat={point.lat}
            lng={point.lng}
          />
        )}
      </GoogleMapReact>
    </div>
  );
}