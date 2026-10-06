import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { ensureAuthenticated } from '../middlewares/auth';

export const clientRoutes = Router();

clientRoutes.post('/clients', ensureAuthenticated, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Preencha nome e e-mail do cliente.' });
  }

  const client = await prisma.client.create({
    data: { name, email, userId: req.userId },
  });

  return res.status(201).json(client);
});

clientRoutes.get('/clients', ensureAuthenticated, async (req, res) => {
  const clients = await prisma.client.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(clients);
});
clientRoutes.put('/clients/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body ?? {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Preencha nome e e-mail do cliente.' });
  }

  const client = await prisma.client.findFirst({
    where: { id, userId: req.userId },
  });

  if (!client) {
    return res.status(404).json({ error: 'Cliente não encontrado.' });
  }

  const updated = await prisma.client.update({
    where: { id },
    data: { name, email },
  });

  return res.json(updated);
});

clientRoutes.delete('/clients/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;

  const client = await prisma.client.findFirst({
    where: { id, userId: req.userId },
  });

  if (!client) {
    return res.status(404).json({ error: 'Cliente não encontrado.' });
  }

  const proposalsCount = await prisma.proposal.count({ where: { clientId: id } });

  if (proposalsCount > 0) {
    return res.status(409).json({ error: 'Este cliente tem orçamentos e não pode ser excluído.' });
  }

  await prisma.client.delete({ where: { id } });

  return res.status(204).send();
});