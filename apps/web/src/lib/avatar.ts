const avatarColors = [
  "bg-red-500 text-white",
  "bg-orange-500 text-white",
  "bg-amber-500 text-white",
  "bg-yellow-500 text-black",
  "bg-lime-500 text-black",
  "bg-green-500 text-white",
  "bg-emerald-500 text-white",
  "bg-teal-500 text-white",
  "bg-cyan-500 text-white",
  "bg-sky-500 text-white",
  "bg-blue-500 text-white",
  "bg-indigo-500 text-white",
  "bg-violet-500 text-white",
  "bg-purple-500 text-white",
  "bg-fuchsia-500 text-white",
  "bg-pink-500 text-white",
  "bg-rose-500 text-white",
];

export function getAvatarColor(name = "") {
  if (!name) return "bg-muted text-muted-foreground";

  const hash = [...name].reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );

  return avatarColors[hash % avatarColors.length];
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}