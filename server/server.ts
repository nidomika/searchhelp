import express from 'express'
import { google } from 'googleapis'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID' // Wstaw tutaj ID swojego arkusza
const RANGE = 'Sheet1!A1:D' // Zakres danych w arkuszu

const credentials = require('./config/credentials.json') // Załaduj plik poświadczeń

// Autoryzacja Google API
async function authorize() {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )

  // Tutaj musisz ustawić token dostępu
  oAuth2Client.setCredentials({ token: 'TWOJ_TOKEN' })
  return oAuth2Client
}

// Endpoint do wyszukiwania w Google Sheets
app.get('/api/search', async (req, res) => {
  const { name, surname } = req.query

  const auth = await authorize()
  const sheets = google.sheets({ version: 'v4', auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE
  })

  const rows = response.data.values
  const result = rows.find((row: any) => row[0] === name && row[1] === surname)

  if (result) {
    res.json([{ name: result[0], surname: result[1], status: result[2] }])
  } else {
    res.json([])
  }
})

// Endpoint do oznaczania odbioru
app.put('/api/collect', async (req, res) => {
  const { name, surname } = req.body

  const auth = await authorize()
  const sheets = google.sheets({ version: 'v4', auth })

  // Zaktualizuj dane w arkuszu (wymagana logika znajdowania wiersza)
  // ...

  res.send('Status zaktualizowany')
})

// Start serwera
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`)
})
