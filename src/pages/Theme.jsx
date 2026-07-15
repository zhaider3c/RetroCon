
export const THEME = {};
THEME.MUDDY = {
    bg: "#ddceb4",
    textColor: "#30210b",
    borderColor: "#30210b",
    shadowColor: "#30210b",
    baseBg: "#30210b"
}
THEME.POP = {
    bg: "#fefcd0",
    textColor: "black",
    borderColor: "black",
    shadowColor: "#c381b5",
    baseBg: "#c381b5"
}
THEME.GRAY = {
    bg: "#6f707f",
    textColor: "white",
    borderColor: "black",
    shadowColor: "black",
    baseBg: "darkgray"
}

THEME.MATRIX = {
    bg: "#202020",
    textColor: "lime",
    borderColor: "black",
    shadowColor: "black",
    baseBg: "#2e2e2e"
}

THEME.BLACK = {
    bg: "#202020",
    textColor: "darkgray",
    borderColor: "black",
    shadowColor: "black",
    baseBg: "#202020"
}

THEME.MIDNIGHT = {
    bg: "#20202e",
    textColor: "white",
    borderColor: "black",
    shadowColor: "black",
    baseBg: "#20202e"
}

THEME.WHITE = {
    bg: "white",
    textColor: "black",
    borderColor: "black",
    shadowColor: "black",
    baseBg: "white"
}

THEME.DANGER = {
    bg: "#ff003f",
    textColor: "white",
    borderColor: "#800020",    // darker red shade for border
    shadowColor: "black",      // changed to black as per instruction
    baseBg: "#FF0000",
}

THEME.WARNING = {
    bg: "#FFC107",               // Amber, Material Design yellow
    textColor: "#3A2F00",        // Deep brown for good contrast with amber
    borderColor: "#222",         // Nearly black border
    shadowColor: "#C68400",      // Shadow in dark amber
    baseBg: "#FFC107",
}

THEME.SUCCESS = {
    bg: "#3fbf3f",
    textColor: "#003e20",
    borderColor: "#004e20",
    shadowColor: "black",
    baseBg: "darkgreen"
}

THEME.SUCCESS_DARK = {
    bg: "#2e802e",
    textColor: "#e6e6e6",
    borderColor: "#2e802e",
    shadowColor: "black",
    baseBg: "darkgreen"
}

THEME.SEAMLESS = {
    bg: "transparent",
    textColor: "lime",
    borderColor: "transparent",
    shadowColor: "transparent",
    style: {
        boxShadow: "none"
    },
    baseBg: "transparent"
}

THEME.TRANSPARENT = {
    bg: "transparent",
    textColor: "b0f0faf",
    borderColor: "transparent",
    shadowColor: "transparent",
    baseBg: "transparent",
    style: {
        boxShadow: "none"
    }
}

THEME.TRANSLUCENT = {
    bg: "#303030",
    textColor: "white",
    borderColor: "black",
    shadowColor: "black",
    baseBg: "#404040",
    style:{
        opacity: 0.5
    }
}

THEME.ACCENT = {
    bg: "#007bff",
    textColor: "white",
    borderColor: "black",
    shadowColor: "black",
    baseBg: "#007bff",
}

THEME.JSON = {}
THEME.JSON.DEFAULT = {
    base00: "rgba(0,0,0,0)",  // background: transparent
    base01: "rgba(0,0,0,0)",  // unused or hover: transparent
    base02: "rgba(0,0,0,0)",  // unused or accent: transparent
    base03: "#777",  // dark shade: black
    base04: "#fff",  // lighter shade: black
    base05: "#0f0",  // main text: black
    base06: "#7ff",  // lighter text: black
    base07: "#0f0",  // highlights: black
    base08: "#f00",  // errors, insertions: black
    base09: "#aff",  // numbers: black
    base0A: "#aff",  // booleans: black
    base0B: "#aff",  // strings: black
    base0C: "#aff",  // variable: black
    base0D: "#aaa",  // params: black
    base0E: "#aaa",  // classes, keywords: black
    base0F: "#fff", // undefined value
}

THEME.PRIMARY = THEME.BLACK;
THEME.ACTIVE = THEME.BLACK;
THEME.SECONDARY = THEME.MIDNIGHT;
THEME.ACTIVE_INPUT = THEME.MATRIX;
THEME.ACTIVE_BUTTON = THEME.GRAY;
THEME.BLOCKED = THEME.GRAY;

export function themeToSidebarVars(theme) {
  return {
    '--sidebar': theme.bg,
    '--sidebar-foreground': theme.textColor,
    '--sidebar-border': theme.borderColor,
    '--sidebar-ring': theme.borderColor,
    '--sidebar-accent': theme.baseBg,
    '--sidebar-accent-foreground': theme.textColor,
    '--sidebar-primary': theme.baseBg,
    '--sidebar-primary-foreground': theme.textColor,
    '--accent': theme.baseBg,
    '--accent-foreground': theme.textColor,
    '--primary': theme.baseBg,
    '--primary-foreground': theme.textColor,
  };
}

export function pixelBevelStyle(theme) {
  return {
    backgroundColor: theme.bg,
    color: theme.textColor,
    border: `5px solid ${theme.borderColor}`,
    borderRadius: 0,
    boxShadow: `${theme.shadowColor} 2px 2px 0 2px, ${theme.bg} -2px -2px 0 2px`,
  };
}