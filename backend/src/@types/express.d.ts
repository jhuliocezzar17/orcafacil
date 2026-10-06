// Ensina o TypeScript que toda requisição (req) pode ter um "userId".
// Quem preenche esse valor é o middleware ensureAuthenticated, depois de validar o token.
declare namespace Express {
  export interface Request {
    userId: string;
  }
}
