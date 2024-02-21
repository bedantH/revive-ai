import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getMe, login, refresh, register } from "./services/auth.service";
import { getAIResponseAll, getAllLocationsNearby } from "./services/ai.service";
import {
  completeScan,
  createScanService,
  getScanByIdService,
  getScansByUserIdService,
} from "./services/scan.service";
import mongoose from "mongoose";
import { authenticate } from "./libs/jwt";
import cookies from "cookie-parser";
import axios from "axios";

const app: Express = express();
app.use(
  bodyParser.json({
    limit: "200mb",
  })
);
app.use(cookies());
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

app.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  await login(req, res, next);
});

app.post("/register", async (req: Request, res: Response) => {
  await register(req, res);
});

app.get("/me", authenticate, async (req: Request, res: Response) => {
  await getMe(req, res);
});

// refresh token
app.post("/refresh", authenticate, async (req, res) => {
  await refresh(req, res);
});

// scan routes
app.post("/scan", authenticate, async (req: Request, res: Response) => {
  await createScanService(req, res);
});

app.get("/scan/:id", authenticate, async (req: Request, res: Response) => {
  await getScanByIdService(req, res);
});

app.get(
  "/scan/user/:userId",
  authenticate,
  async (req: Request, res: Response) => {
    await getScansByUserIdService(req, res);
  }
);

app.get("/search", async (req, res) => {
  try {
    const apiKey = "AIzaSyBwfsoIP2n5mYQAauWVrLkRQcul_odtGSs";
    const query = req.query.q; // Retrieve the query parameter from the request
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: apiKey,
          q: query,
          part: "snippet",
          type: "video",
          maxResults: 10, // You can adjust this value as needed
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from YouTube API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(
  "/scan/:id/complete",
  authenticate,
  async (req: Request, res: Response) => {
    await completeScan(req, res);
  }
);

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

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is at http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Err: ", err);
  });
