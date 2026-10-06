import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { ensureAuthenticated } from '../middlewares/auth';

export const proposalRoutes = Router();

proposalRoutes.post('/proposals', ensureAuthenticated, async (req, res) => {
  const { title, totalValue, clientId } = req.body;

  if (!title || !totalValue || !clientId) {
    return res.status(400).json({ error: 'Preencha título, valor e cliente.' });
  }

  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: req.userId },
  });

  if (!client) {
    return res.status(404).json({ error: 'Cliente não encontrado.' });
  }

  const proposal = await prisma.proposal.create({
    data: { title, totalValue: Number(totalValue), clientId, userId: req.userId },
  });

  return res.status(201).json(proposal);
});

proposalRoutes.get('/proposals', ensureAuthenticated, async (req, res) => {
  const proposals = await prisma.proposal.findMany({
    where: { userId: req.userId },
    include: { client: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(proposals);
});