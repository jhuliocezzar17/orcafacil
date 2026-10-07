import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ensina o TypeScript que toda requisição (req) pode ter um "userId".
// Fica aqui (e não só no .d.ts) porque toda rota importa este arquivo:
// assim a Vercel, que confere os tipos arquivo por arquivo, também enxerga.
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}


export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não enviado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string };
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}