"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Toy in-memory database of flights
var mockFlights = [
    {
        airline: 'Delta Air Lines',
        flightNumber: 'DL123',
        from: 'JFK',
        to: 'LAX',
        depart: '2024-07-01',
        arrive: '2024-07-01',
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
        depart: '2024-07-01',
        arrive: '2024-07-01',
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
        depart: '2024-07-01',
        arrive: '2024-07-01',
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
        depart: '2024-07-02',
        arrive: '2024-07-02',
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
        depart: '2024-07-03',
        arrive: '2024-07-03',
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
        depart: '2024-07-04',
        arrive: '2024-07-04',
        duration: '3h 10m',
        stops: 0,
        fareClass: 'economy',
        price: 200,
        currency: 'USD',
        miles: 15000,
    },
];
// Mock search endpoint
app.get('/search', function (req, res) {
    // Extract query params
    var _a = req.query, from = _a.from, to = _a.to, depart = _a.depart, fareClass = _a.fareClass;
    // Filter mock flights based on query params (case-insensitive)
    var results = mockFlights.filter(function (flight) {
        var match = true;
        if (from && typeof from === 'string')
            match = match && flight.from.toLowerCase() === from.toLowerCase();
        if (to && typeof to === 'string')
            match = match && flight.to.toLowerCase() === to.toLowerCase();
        if (depart && typeof depart === 'string')
            match = match && flight.depart === depart;
        if (fareClass && typeof fareClass === 'string')
            match = match && flight.fareClass.toLowerCase() === fareClass.toLowerCase();
        return match;
    });
    res.json({ results: results });
});
app.listen(PORT, function () {
    console.log("Mock API server running on http://localhost:".concat(PORT));
});
