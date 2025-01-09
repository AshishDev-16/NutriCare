// Add or update CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://hospital-food-delivery-m38p.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Add PATCH to allowed methods
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
})); 