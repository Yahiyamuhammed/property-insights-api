import express from 'express';
import cors from 'cors';
import propertyRoutes from './routes/property.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/property', propertyRoutes);

app.listen(3000, () => {
    console.log('API Gateway running on http://localhost:3000');
});