import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript + Vercel!');
});

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'This is an API endpoint' });
});

// Export for Vercel
export default app;

// Local server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}