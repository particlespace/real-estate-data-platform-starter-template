import GoogleMapReact from 'google-map-react';
import { useEffect, useMemo, useState } from 'react';
import env from 'react-dotenv';

/**
 * Recursively logs key value pairs of an object
 */
const logObject = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      logObject(obj[key]);
    } else {
      console.log(`${key}: ${obj[key]}`);
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
  const [map, setMap] = useState<any>(null);
  const [maps, setMaps] = useState<any>(null);

  const [geocoder, setGeocoder] = useState<any>(null);

  const [center, setCenter] = useState<any>({
    lat: 39.092306123688125,
    lng: -94.58670048764,
  });

  const [zoom, setZoom] = useState<number>(9);

  const [boundaries, setBoundaries] = useState<any>(null);

  const [point, setPoint] = useState<any>(null);

  const selectedLocation = useMemo(() => {
    return {
      lat: selectedPlace?.geometry?.location.lat() || null,
      lng: selectedPlace?.geometry?.location.lng() || null,
    };
  }, [selectedPlace]);

  useEffect(() => {
    if (boundariesState !== null && boundariesState !== boundaries) {
      setBoundaries(boundariesState);
      console.log(boundariesState);
    }
  }, [boundariesState, boundaries]);

  useEffect(() => {
    console.log('baoundary change');
    console.log(!!map);
    console.log(!!maps);
    console.log(boundaries);
    if (
      !!map
      && !!maps
      && boundaries
      && boundaries.data
    ) {
      console.log('boundaries', boundaries);
      const boundaryData = boundaries.data.boundaries;
      const type = boundaryData?.type;
      if (type === 'Polygon') {
        console.log('polygon');
        const poly = new maps.Polygon({
          paths: [
            { lat: 39.092306123688125, lng: -94.58670048764 },
            { lat: 39.093306123688125, lng: -94.58670048764 },
            { lat: 39.093306123688125, lng: -94.68670048764 },
          ],
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35
        });
        poly.setMap(map);
      } else if (type === 'Point') {
        console.log('point');
        setPoint({
          lat: boundaryData?.coordinates[1],
          lng: boundaryData?.coordinates[0],
        });
      }
    }
  }, [map, maps, boundaries]);

  console.log('point', point);
  console.log('!!point', !!point);

  return (
    <div style={{ height: 'calc(100vh - 72px)', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: env.GOOGLE_MAPS_KEY,
          libraries: ['places', 'geocoder'],
        }}
        onGoogleApiLoaded={({ map, maps }) => {
          setGeocoder(new maps.Geocoder());
          setMap(map);
          setMaps(maps);
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
        onClick={({ event, x, y, lat, lng }) => {
          console.log('click', event, x, y, lat, lng);
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