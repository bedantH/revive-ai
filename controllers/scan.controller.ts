import Scan from "../models/scan.model";

export async function createScan(userId: string, object: string, result: any) {
  const scan = new Scan({
    user: userId,
    object,
    result,
  });

  return scan.save();
}

export async function getScanById(id: string) {
  return Scan.findById(id).populate("user").exec();
}

export async function getScansByUserId(userId: string) {
  return Scan.find({ user: userId }).populate("user").exec();
}
