import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.js'
import sessionsRouter from './routes/sessions.js'
import handsRouter from './routes/hands.js'
import studyRouter from './routes/study.js'
import flashcardsRouter from './routes/flashcards.js'
import statsRouter from './routes/stats.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/sessions', sessionsRouter)
app.use('/api/hands', handsRouter)
app.use('/api/study', studyRouter)
app.use('/api/flashcards', flashcardsRouter)
app.use('/api/stats', statsRouter)

app.use(errorHandler)

export default app
