import GoogleMapReact from 'google-map-react';
import { useMemo, useState } from 'react';
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
}

export default function Map({
  selectedPlace,
  setSelectedPlace,
}: MapProps) {
  const [geocoder, setGeocoder] = useState<any>(null);
  const [center, setCenter] = useState<any>({
    lat: 39.092306123688125,
    lng: -94.58670048764,
  });

  const [zoom, setZoom] = useState<number>(9);

  const selectedLocation = useMemo(() => {
    return {
      lat: selectedPlace?.geometry?.location.lat() || null,
      lng: selectedPlace?.geometry?.location.lng() || null,
    };
  }, [selectedPlace]);

  return (
    <div style={{ height: 'calc(100vh - 72px)', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: env.GOOGLE_MAPS_KEY,
          libraries: ['places', 'geocoder'],
        }}
        onGoogleApiLoaded={({ map, maps }) => {
          setGeocoder(new maps.Geocoder());
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
          console.log('event', event);
          console.log('x', x);
          console.log('y', y);
          console.log('lat', lat);
          console.log('lng', lng);
          geocoder && geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            console.log('results', results);
            console.log('status', status);
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
      </GoogleMapReact>
    </div>
  );
}