import Scan from "../models/scan.model";

export async function createScan(
  userId: string,
  object: string,
  result: any,
  is_completed: boolean,
  how_desc: string
) {
  const scan = new Scan({
    user: userId,
    object,
    result,
    is_completed,
    how_desc,
  });

  return scan.save();
}

export async function getScanById(id: string) {
  return Scan.findById(id).populate("user").exec();
}

export async function getScansByUserId(userId: string) {
  return Scan.find({ user: userId }).populate("user").exec();
}
