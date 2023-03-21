"use client";

import { FlightData } from "@/interfaces/api";
import { Path } from "@/interfaces/map";
import { useMemo } from "react";
import MapTest from "./DronePathMap";

export default function MapView({ flightData }: { flightData: FlightData }) {
    const paths: Path = useMemo(() => ({ color: [255, 0, 0], name: flightData.flightStartDate, path: flightData.rows.map(({ coords }) => [coords[0], coords[1]]) }), [flightData])

    return (
        <MapTest path={paths} />
    )
}
