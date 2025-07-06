import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/auth', authRoutes);

// Toy in-memory database of flights
const mockFlights = [
  {
    airline: 'Delta Air Lines',
    flightNumber: 'DL123',
    from: 'JFK',
    to: 'LAX',
    depart: '2025-07-01',
    arrive: '2025-07-01',
    duration: '6h 10m',
    stops: 0,
    fareClass: 'economy',
    price: 350,
    currency: 'USD',
    miles: 25000,
  },
  {
    airline: 'United Airlines',
    flightNumber: 'UA456',
    from: 'JFK',
    to: 'LAX',
    depart: '2025-07-01',
    arrive: '2025-07-01',
    duration: '6h 20m',
    stops: 1,
    fareClass: 'economy',
    price: 330,
    currency: 'USD',
    miles: 24000,
  },
  {
    airline: 'American Airlines',
    flightNumber: 'AA789',
    from: 'JFK',
    to: 'LAX',
    depart: '2025-07-01',
    arrive: '2025-07-01',
    duration: '6h 5m',
    stops: 0,
    fareClass: 'economy',
    price: 370,
    currency: 'USD',
    miles: 26000,
  },
  {
    airline: 'Air Canada',
    flightNumber: 'AC101',
    from: 'YYZ',
    to: 'YVR',
    depart: '2025-07-02',
    arrive: '2025-07-02',
    duration: '5h 10m',
    stops: 0,
    fareClass: 'business',
    price: 800,
    currency: 'CAD',
    miles: 40000,
  },
  {
    airline: 'Lufthansa',
    flightNumber: 'LH400',
    from: 'FRA',
    to: 'JFK',
    depart: '2025-07-03',
    arrive: '2025-07-03',
    duration: '8h 30m',
    stops: 0,
    fareClass: 'first',
    price: 2500,
    currency: 'EUR',
    miles: 90000,
  },
  {
    airline: 'Avianca',
    flightNumber: 'AV244',
    from: 'BOG',
    to: 'LIM',
    depart: '2025-07-04',
    arrive: '2025-07-04',
    duration: '3h 10m',
    stops: 0,
    fareClass: 'economy',
    price: 200,
    currency: 'USD',
    miles: 15000,
  },
];

// Mock search endpoint
app.get('/search', (req: Request, res: Response) => {
  // Extract query params
  const { from, to, depart, fareClass } = req.query;

  // Filter mock flights based on query params (case-insensitive)
  let results = mockFlights.filter(flight => {
    let match = true;
    if (from && typeof from === 'string') match = match && flight.from.toLowerCase() === from.toLowerCase();
    if (to && typeof to === 'string') match = match && flight.to.toLowerCase() === to.toLowerCase();
    if (depart && typeof depart === 'string') match = match && flight.depart === depart;
    if (fareClass && typeof fareClass === 'string') match = match && flight.fareClass.toLowerCase() === fareClass.toLowerCase();
    return match;
  });

  res.json({ results });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
