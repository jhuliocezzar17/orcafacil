import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const publicRoutes = Router();

publicRoutes.get('/public/proposals/:id', async (req, res) => {
  const id = String(req.params.id); // garante que o id é texto

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      totalValue: true,
      status: true,
      createdAt: true,
      client: { select: { name: true } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!proposal) {
    return res.status(404).json({ error: 'Orçamento não encontrado.' });
  }

  return res.json(proposal);
});

publicRoutes.patch('/public/proposals/:id/approve', async (req, res) => {
  const id = String(req.params.id); // garante que o id é texto

  const proposal = await prisma.proposal.findUnique({ where: { id } });

  if (!proposal) {
    return res.status(404).json({ error: 'Orçamento não encontrado.' });
  }

  if (proposal.status !== 'PENDING') {
    return res.status(409).json({ error: 'Este orçamento já foi respondido.' });
  }

  const updated = await prisma.proposal.update({
    where: { id },
    data: { status: 'APPROVED' },
  });

  return res.json({ message: 'Orçamento aprovado com sucesso!', proposal: updated });
});