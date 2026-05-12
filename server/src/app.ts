import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.js'
import { requireAuth } from './middleware/auth.js'
import { asyncHandler } from './middleware/asyncHandler.js'
import sessionsRouter from './routes/sessions.js'
import handsRouter from './routes/hands.js'
import studyRouter from './routes/study.js'
import flashcardsRouter from './routes/flashcards.js'
import statsRouter from './routes/stats.js'

const app = express()

app.use(cors())
app.use(express.json())

// All routes require authentication
app.use('/api/sessions', asyncHandler(requireAuth), sessionsRouter)
app.use('/api/hands', asyncHandler(requireAuth), handsRouter)
app.use('/api/study', asyncHandler(requireAuth), studyRouter)
app.use('/api/flashcards', asyncHandler(requireAuth), flashcardsRouter)
app.use('/api/stats', asyncHandler(requireAuth), statsRouter)

app.use(errorHandler)

export default app
