import AppError from "@/shared/errors/AppError";
import { LoginPayload } from "@/shared/types/auth";
import { IUser } from "@/shared/types/user";
import User, { UserDocument } from "./auth.model";
import { serializeUser, signToken } from "./auth.utils";

export async function login(payload: LoginPayload) {
  const { email, password } = payload;

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user) {
    throw new AppError(401, "Invalid email or password.");
  }

  const matched = await user.comparePassword(password);

  if (!matched) {
    throw new AppError(401, "Invalid email or password.");
  }

  return {
    token: signToken(user),
    user: serializeUser(user),
  };
}

export async function me(user: UserDocument) {
  return {
    user: serializeUser(user),
  };
}

export async function createUser(payload: IUser & {password: string}) {
  const exists = await User.findOne({
    email: payload.email.toLowerCase().trim(),
  });

  if (exists) {
    throw new AppError(
      409,
      "A user with this email already exists.",
    );
  }

  const user = await User.create(payload);

  return {
    user: serializeUser(user),
  };
}

export async function listUsers() {
  const users = await User.find().sort({
    isOnCall: -1,
    name: 1,
  });

  return {
    users: users.map(serializeUser),
  };
}

export async function deleteUser(
  id: string,
  currentUser: UserDocument,
) {
  if (String(currentUser._id) === id) {
    throw new AppError(
      400,
      "You cannot delete your own account while logged in.",
    );
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  // await Incident.updateMany(
  //   {
  //     assignedTo: user._id,
  //   },
  //   {
  //     $unset: {
  //       assignedTo: "",
  //     },
  //   },
  // );

  // await Notification.deleteMany({
  //   targetUser: user._id,
  // });

  await User.findByIdAndDelete(user._id);

  return {
    message: `${user.name} was deleted successfully.`,
  };
}