import User from "../models/user.model";
import bcrypt from "bcrypt";

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
  });

  return user.save();
}

export async function getUserByEmail(email: string) {
  return User.findOne({ email }).populate("history").exec();
}

export async function getUserById(id: string) {
  return User.findById(id).populate("history").exec();
}

export async function addScanToUserHistory(userId: string, scanId: string) {
  const user = await User.findById(userId).populate("history").exec();

  user?.updateOne({ history: [...user.history, scanId] });
}

export async function removeScanFromUserHistory(
  userId: string,
  scanId: string
) {
  const user = await User.findById(userId).populate("history").exec();

  user?.updateOne({
    history: user.history.filter((id) => id.toString() !== scanId),
  });
}

export async function comparePassword(id: string, password: string) {
  const user = await User.findById(id).exec();

  return user?.comparePassword(password);
}

export async function updateUserDetails(id: string, data: any) {
  return User.findByIdAndUpdate(id, data).exec();
}
