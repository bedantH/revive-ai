import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getMe, refresh, register } from "./services/auth.service";
import { getAIResponseAll, getAllLocationsNearby } from "./services/ai.service";
import {
  completeScan,
  createScanService,
  getScanByIdService,
  getScansByUserIdService,
} from "./services/scan.service";

const app: Express = express();
app.use(
  bodyParser.json({
    limit: "100mb",
  })
);
dotenv.config();

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "The API is up running fine!",
    status: "success",
    code: 200,
  });
});

/*
  An endpoint to get the response from the AI model and return it as a JSON response
*/

app.post("/ai/response/all", async (req: Request, res: Response) => {
  await getAIResponseAll(req, res);
});

app.post("/ai/response/locations", async (req: Request, res: Response) => {
  await getAllLocationsNearby(req, res);
});

app.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {}
);

app.post("/signup", async (req: Request, res: Response) => {
  register(req, res);
});

app.get("/me", async (req: Request, res: Response) => {
  await getMe(req, res);
});

// refresh token
app.post("/refresh", async (req, res) => {
  await refresh(req, res);
});

// scan routes
app.post("/scan", async (req: Request, res: Response) => {
  await createScanService(req, res);
});

app.get("/scan/:id", async (req: Request, res: Response) => {
  await getScanByIdService(req, res);
});

app.get("/scan/user/:userId", async (req: Request, res: Response) => {
  await getScansByUserIdService(req, res);
});

app.post("/scan/:id/complete", async (req: Request, res: Response) => {
  await completeScan(req, res);
});

/* -------------------------------------------------------------------------- */
/*                                Error Handler                               */
/* -------------------------------------------------------------------------- */

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Not Found",
    status: "failed",
    code: 404,
  });
});

app.listen(PORT, () => {
  console.log(`Server is at http://localhost:${PORT}/`);
});
