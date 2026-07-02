import User from "../auth/auth.model";
import { NotificationService } from "../notification/notification.service";


const mentionKey = (
  value = "",
) =>
  value
    .toLowerCase()
    .replace(/^@/, "")
    .replace(
      /[^a-z0-9]/g,
      "",
    );

const findMentionedUsers =
  async (message = "") => {
    const users =
      await User.find().select(
        "name email role team isOnCall",
      );

    const tokens = [
      ...String(message).matchAll(
        /@([\w.-]+(?:@[\w.-]+)?)/g,
      ),
    ].map((match) =>
      mentionKey(match[1]),
    );

    if (!tokens.length) {
      return [];
    }

    return users.filter(
      (user) => {
        const nameKey =
          mentionKey(user.name);

        const emailKey =
          mentionKey(user.email);

        const firstNameKey =
          mentionKey(
            user.name.split(" ")[0],
          );

        return tokens.some(
          (token) =>
            token ===
              nameKey ||
            token ===
              emailKey ||
            token ===
              firstNameKey,
        );
      },
    );
  };

const notifyMentionedUsers =
  async ({
    message,
    incident,
    author,
  }: {
    message: string;
    incident: any;
    author: Express.User;
  }) => {
    const users =
      await findMentionedUsers(
        message,
      );

    await Promise.all(
      users.map((user) =>
        NotificationService.create({
          title: `You were mentioned by ${author.name}`,
          message: `${incident.title}: ${message}`,
          targetUser:
            user._id,
          incident:
            incident._id,
        }),
      ),
    );
  };

export {
  mentionKey,
  findMentionedUsers,
  notifyMentionedUsers,
};