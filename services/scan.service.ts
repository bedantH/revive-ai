// two services to create a new scan and get a scan by its ID. The first service creates a new scan and the second service retrieves a scan by its ID. The first service takes three parameters: userId, object, and result. The second service takes one parameter: id. Both services use the Scan model to interact with the database. The createScan service creates a new scan and returns the newly created scan. The getScanById service retrieves a scan by its ID and returns the scan. The getScansByUserId service retrieves all scans by a user's ID and returns the scans.
// also a service to mark a scan as complete and update the how_desc field. The service takes two parameters: id and how_desc. The service uses the Scan model to interact with the database. The service updates the scan's is_completed field to true and updates the scan's how_desc field with the provided how_desc. The service returns the updated scan.

import { Request, Response } from "express";
import {
  createScan,
  getScanById,
  getScansByUserId,
} from "../controllers/scan.controller";

export async function completeScan(req: Request, res: Response) {
  const id = req.params.id;
  const { how_desc } = req.body;

  if (!id || !how_desc) {
    return res.status(400).json({
      message: "Invalid request",
      status: "failed",
      code: 400,
    });
  }

  let scan;
  try {
    scan = await getScanById(id);
  } catch (err) {
    return res.status(500).json({
      message: "Completing scan failed, please try again later.",
      status: "failed",
      code: 500,
    });
  }

  if (!scan) {
    return res.status(404).json({
      message: "Scan not found",
      status: "failed",
      code: 404,
    });
  }

  scan.is_completed = true;
  scan.how_desc = how_desc;

  try {
    await scan.save();
  } catch (err) {
    return res.status(500).json({
      message: "Completing scan failed, please try again later.",
      status: "failed",
      code: 500,
    });
  }

  res.status(200).json({
    message: "Scan completed successfully",
    status: "success",
    code: 200,
    scan,
  });
}

export async function createScanService(req: Request, res: Response) {
  const { userId, object, result, is_completed, how_desc } = req.body;

  if (!userId || !object || !result) {
    return res.status(400).json({
      message: "Invalid request",
      status: "failed",
      code: 400,
    });
  }

  let scan;
  try {
    scan = await createScan(userId, object, result, is_completed, how_desc);
  } catch (err) {
    return res.status(500).json({
      message: "Creating scan failed, please try again later.",
      status: "failed",
      code: 500,
      err: err,
    });
  }

  res.status(201).json({
    message: "Scan created successfully",
    status: "success",
    code: 201,
    scan,
  });
}

export async function getScanByIdService(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Invalid request",
      status: "failed",
      code: 400,
    });
  }

  let scan;
  try {
    scan = await getScanById(id);
  } catch (err) {
    return res.status(500).json({
      message: "Fetching scan failed, please try again later.",
      status: "failed",
      code: 500,
    });
  }

  if (!scan) {
    return res.status(404).json({
      message: "Scan not found",
      status: "failed",
      code: 404,
    });
  }

  res.status(200).json({
    message: "Scan fetched successfully",
    status: "success",
    code: 200,
    scan,
  });
}

export async function getScansByUserIdService(req: Request, res: Response) {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "Invalid request",
      status: "failed",
      code: 400,
    });
  }

  let scans;
  try {
    scans = await getScansByUserId(userId);
  } catch (err) {
    return res.status(500).json({
      message: "Fetching scans failed, please try again later.",
      status: "failed",
      code: 500,
    });
  }

  res.status(200).json({
    message: "Scans fetched successfully",
    status: "success",
    code: 200,
    scans,
  });
}
