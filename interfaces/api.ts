export interface FlightData {
    date: string
    flightStartDate: string
    rows: Row[]
}

export interface Row {
    coords: number[]
    altitude: number
}