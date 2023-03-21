import { useEffect, useRef, useState, useMemo } from 'react';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { Path } from '@/interfaces/map';
import { useTheme } from '@mui/material';

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY!
const GOOGLE_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID!

const renderMap = (status: string) => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return <div></div>;
}

type MyMapComponentProps = {
    center: google.maps.LatLng | google.maps.LatLngLiteral;
    zoom: number;
    path: Path;
}

const MyMapComponent: React.FC<MyMapComponentProps> = ({ center, zoom, path }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const theme = useTheme()

    const flightPlanCoordinates: google.maps.LatLngLiteral[] = useMemo(
        () => path.path.map(p => ({ lat: p[0], lng: p[1] })),
        [path]
    )

    const flightPlanOverlay = useMemo(() => new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: theme.palette.primary.main,
        strokeOpacity: 1.0,
        strokeWeight: 3,
    }), [flightPlanCoordinates, theme])

    useEffect(() => {
        if (!map) return

        map.setCenter(center)
        map.setZoom(zoom)
        flightPlanOverlay.setMap(map)
    }, [map, center, zoom, flightPlanOverlay])

    useEffect(() => {
        if (!ref.current) return

        const mapInstance = new window.google.maps.Map(ref.current, {
            mapId: GOOGLE_MAP_ID,
        });
        setMap(mapInstance)
    }, [])

    return (
        <div ref={ref} id="map" style={{ height: '100vh', width: '100wh' }} />
    )
}

interface MapProps {
    path: Path
}

const DronePathMap: React.FC<MapProps> = ({ path }) => {
    const firstCoords = useMemo(() => path.path[0], [path])

    return (
        <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={renderMap}>
            <MyMapComponent center={{ lat: firstCoords[0], lng: firstCoords[1] }} zoom={16} path={path} />
        </Wrapper>
    )
}

export default DronePathMap