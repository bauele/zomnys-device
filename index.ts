import express, { Express, Request, Response } from 'express';
const app = express();
const port = 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/', (req: Request, res: Response) => {
    res.send('Oh I changed againsds!');
});
