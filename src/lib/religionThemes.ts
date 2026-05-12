export type ReligionTheme = {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  accent: string;
  accentText: string;
  muted: string;
  symbol: string;
};

const themes: Record<string, ReligionTheme> = {
  "Православие": {
    bg: "#1A1208",
    surface: "#241A0C",
    surface2: "#2E2210",
    border: "#4A3520",
    accent: "#C9A84C",
    accentText: "#F5DFA0",
    muted: "#A08050",
    symbol: "☦",
  },
  "Католицизм": {
    bg: "#0F1520",
    surface: "#161E2E",
    surface2: "#1C2840",
    border: "#2A3A58",
    accent: "#4A7FD4",
    accentText: "#A0C0F0",
    muted: "#5A7AAA",
    symbol: "✝",
  },
  "Протестантизм": {
    bg: "#101820",
    surface: "#162030",
    surface2: "#1C2A40",
    border: "#263850",
    accent: "#5B9BD5",
    accentText: "#A8CFF0",
    muted: "#507090",
    symbol: "✟",
  },
  "Ислам": {
    bg: "#0A1810",
    surface: "#102018",
    surface2: "#162A20",
    border: "#1E3E2A",
    accent: "#2E8B57",
    accentText: "#80D4A0",
    muted: "#408060",
    symbol: "☪",
  },
  "Иудаизм": {
    bg: "#0F1020",
    surface: "#161828",
    surface2: "#1C2035",
    border: "#282A48",
    accent: "#4A5FBF",
    accentText: "#A0AEFF",
    muted: "#4A5590",
    symbol: "✡",
  },
  "Буддизм": {
    bg: "#1A1000",
    surface: "#241800",
    surface2: "#2E2000",
    border: "#4A3800",
    accent: "#D4820A",
    accentText: "#FFD070",
    muted: "#907030",
    symbol: "☸",
  },
};

export const defaultTheme: ReligionTheme = {
  bg: "#EEEDE8",
  surface: "#E5E4DF",
  surface2: "#FAFAF8",
  border: "#D4D3CE",
  accent: "#1E3A5F",
  accentText: "#1E3A5F",
  muted: "#6B7280",
  symbol: "",
};

export function getTheme(religion?: string | null): ReligionTheme {
  if (!religion || !themes[religion]) return defaultTheme;
  return themes[religion];
}
