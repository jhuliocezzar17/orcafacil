import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { ensureAuthenticated } from '../middlewares/auth.js';

export const authRoutes = Router();

authRoutes.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha nome, e-mail e senha.' });
  }

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
  }

  const passwordHash = await bcrypt.hash(password, 8);

  const user = await prisma.user.create({
    data: { name, email, password: passwordHash },
  });

  return res.status(201).json({ id: user.id, name: user.name, email: user.email });
});
authRoutes.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Preencha e-mail e senha.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });

  return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

authRoutes.get('/me', ensureAuthenticated, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true },
  });

  return res.json(user);
});