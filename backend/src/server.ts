import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth';
import { clientRoutes } from './routes/clients';
import { proposalRoutes } from './routes/proposals';
import { publicRoutes } from './routes/public';

const app = express();

// CORS: libera o frontend (outro endereço, ex.: localhost:5173) a chamar esta API
app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(clientRoutes);
app.use(proposalRoutes);
app.use(publicRoutes);

app.get('/', (req, res) => {
  return res.json({ mensagem: 'API do OrçaFácil funcionando!' });
});

app.get('/status', (req, res) => {
  return res.json({ mensagem: 'primeiro projeto do Dev Cezzar!' });
});

app.listen(3333, () => {
  console.log('Servidor rodando em http://localhost:3333');
});