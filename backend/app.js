// Add or update CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Add PATCH to allowed methods
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
})); 