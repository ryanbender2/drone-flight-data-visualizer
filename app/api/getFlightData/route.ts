import { FlightDataRow } from "@/interfaces/flightData";
import { storage } from "@/lib/firebase";
import { ref, getBytes } from "@firebase/storage";
import neatCsv from "neat-csv";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id)
        return new Response(JSON.stringify({
            error: 'No id provided.'
        }))

    const data = await getCsvData(id)
    const first = data[0]

    return new Response(JSON.stringify({
        date: first.Date,
        flightStartDate: first.Time,
        rows: data.map((row => {
            const coordsStrs = row.GPS?.split(' ')
            return {
                coords: coordsStrs ? coordsStrs.map(s => Number.parseFloat(s)) : undefined,
                altitude: row["Alt(m)"] ? Number.parseInt(row["Alt(m)"]) : undefined
            }
        }))
    }))
}

const getCsvData = async (id: string): Promise<FlightDataRow[]> => {
    const pathReference = ref(storage, `flightData/${id}.csv`);
    const bytes = await getBytes(pathReference)
    const data = new TextDecoder().decode(bytes)
    return await neatCsv(data)
}