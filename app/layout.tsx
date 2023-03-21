"use client";

import { theme } from "@/lib/theme";
import { CssBaseline, ThemeProvider } from "@mui/material"
import { useEffect } from "react"
import './global.css'
// import 'mapbox-gl/dist/mapbox-gl.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    document.title = "Flight Data Visualizer"
  }, [])

  return (
    <html lang="en" >
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
