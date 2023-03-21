import { FlightData } from "@/interfaces/api"
import { storage } from "@/lib/firebase";
import { list, ref } from "@firebase/storage";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type FlightDataSelectorProps = {
    setFlightData: (data: FlightData) => void;
}

export default function FlightDataSelector({ setFlightData }: FlightDataSelectorProps) {
    const [ids, setIds] = useState<string[]>([])
    const [selection, setSelection] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            const pathReference = ref(storage, `flightData/`);
            const resp = await list(pathReference)
            setIds(resp.items.map(item => item.name.slice(0, -4)))
        })()
    }, [])

    useEffect(() => {
        if (!selection) return
        const getData = async () => {
            const params = new URLSearchParams([['id', selection]])
            const resp = await fetch(`api/getFlightData?${params.toString()}`)
            if (!resp.ok) {
                return
            }
            const data: FlightData = await resp.json()
            setFlightData(data)
        }
        getData()
    }, [selection, setFlightData])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h4">Select from the cloud</Typography>
            <Select
                value=""
                label="Flight Data"
                onChange={(e) => setSelection(e.target.value)}
            >
                {ids.map(id => <MenuItem key={id} value={id}>{new Date(Number.parseInt(id)).toLocaleString()}</MenuItem>)}
            </Select>
        </Box>
    )
}
