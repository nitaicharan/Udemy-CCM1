const adjectives = [
  "Swift",
  "Silent",
  "Bold",
  "Quick",
  "Clever",
  "Sly",
  "Phantom",
  "Shadow",
  "Steady",
  "Fierce",
  "Stealthy",
  "Daring",
  "Cunning",
  "Nimble",
  "Wily",
  "Keen",
  "Brisk",
  "Covert",
  "Rogue",
  "Shrewd",
];

const colors = [
  "Crimson",
  "Azure",
  "Violet",
  "Golden",
  "Silver",
  "Obsidian",
  "Emerald",
  "Scarlet",
  "Amber",
  "Ivory",
  "Cobalt",
  "Jade",
  "Coral",
  "Onyx",
  "Teal",
  "Indigo",
  "Copper",
  "Slate",
  "Rust",
  "Peach",
];

const nouns = [
  "Falcon",
  "Fox",
  "Wolf",
  "Raven",
  "Tiger",
  "Viper",
  "Hawk",
  "Panther",
  "Lynx",
  "Cobra",
  "Otter",
  "Badger",
  "Eagle",
  "Shark",
  "Jaguar",
  "Mantis",
  "Puma",
  "Osprey",
  "Weasel",
  "Gecko",
];

function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCodename(): string {
  return `${pick(adjectives)}${pick(colors)}${pick(nouns)}`;
}
