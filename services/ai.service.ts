import { Request, Response } from "express";
import { getNearestStations, getTextResponse } from "../libs/gen-ai";

export async function getAIResponseAll(req: Request, res: Response) {
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
}

export async function getAllLocationsNearby(req: Request, res: Response) {
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
}
