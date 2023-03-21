"use client";

import { storage } from "@/lib/firebase";
import { Box, LinearProgress, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { ref, uploadBytesResumable } from 'firebase/storage';
import { FlightData } from "@/interfaces/api";
import FlightDataSelector from "@/components/FlightDataSelector";
import MapView from "@/components/MapView";

export default function Home() {
  const [flightData, setFlightData] = useState<FlightData | null>(null)

  if (flightData) {
    return <MapView flightData={flightData} />
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
        gap: 5,
        pt: '2rem',
      }}
    >
      <Typography variant="h2">Flight Data Visualizer</Typography>
      {!flightData && <FlightDataSelector setFlightData={setFlightData} />}
      {!flightData && <Typography>Or upload data and use...</Typography>}
      {!flightData && <UploadFile setFlightData={setFlightData} />}
    </Box>
  )
}

const UploadFile = ({ setFlightData }: { setFlightData: Dispatch<SetStateAction<FlightData | null>> }) => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadingFile, setUploadingFile] = useState<File | null>(null)
  const [complete, setComplete] = useState(false)
  const [id, setId] = useState('')


  const uploadFlightData = useCallback((flightData: File) => {
    if (!flightData)
      return
    const id = new Date().getTime().toString()
    setId(id)
    const uploadRef = ref(storage, `flightData/${id}.csv`)
    const uploadTask = uploadBytesResumable(uploadRef, flightData)
    uploadTask.on('state_changed', (task) => {
      setUploadProgress(Math.round(task.totalBytes / task.bytesTransferred) * 100)
    }, () => { }, () => setComplete(true))
  }, [])

  useEffect(() => {
    if (!complete) return

    const getData = async () => {
      const params = new URLSearchParams([['id', id]])
      const resp = await fetch(`api/getFlightData?${params.toString()}`)
      if (!resp.ok) {
        return
      }
      const data: FlightData = await resp.json()
      setFlightData(data)
    }
    getData()
  }, [complete, setFlightData, id])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Typography variant="h4">Please upload your flight data</Typography>
      <input
        onChange={(e) => {
          if (!e.target.files) return
          uploadFlightData(e.target.files[0])
          setUploadingFile(e.target.files[0])
        }}
        type="file"
        accept=".csv"
      />
      {(uploadingFile && !complete) && <Typography>Uploading {uploadingFile.name}...</Typography>}
      {(uploadingFile && !complete) &&
        <Box sx={{ width: '40rem' }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>}
      {complete && <Typography variant="h5" color={(theme) => theme.palette.success.main}>Success!</Typography>}
    </Box>
  )
}
