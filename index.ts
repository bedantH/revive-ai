import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getNearestStations, getTextResponse } from "./libs/gen-ai";
import bodyParser from "body-parser";

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

app.post("/ai/response/all", (req: Request, res: Response) => {
  const location: string = req.body.location;
  const image: string = req.body.image;
  const mimeType: string = req.body.mimeType;

  getTextResponse(location, image, mimeType)
    .then((data) => {
      console.log(data);

      res.status(200).json({
        message: "Response fetched successfully",
        status: "success",
        code: 200,
        data,
      });
    })
    .catch((err) => {
      res.status(503).json({
        message: err,
        status: "failed",
        code: 503,
      });
    });
});

app.post("/ai/response/locations", (req: Request, res: Response) => {
  const location = req.body.location;

  getNearestStations(location)
    .then((stationsData) => {
      res.status(200).json({
        message: "Response fetched successfully",
        status: "success",
        code: 200,
        data: stationsData,
      });
    })
    .catch((err) => {
      res.status(503).json({
        message: `Couldn't find any locations near ${location}`,
        status: "failed",
        code: 503,
        data: err,
      });
    });
});

app.listen(PORT, () => {
  console.log(`Server is at http://localhost:${PORT}/`);
});
