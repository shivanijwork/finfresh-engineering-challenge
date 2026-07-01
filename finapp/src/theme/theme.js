// Central design tokens — keep all screens visually consistent.

export const colors = {
    bg: "#FCFCFA",        // app background
    surface: "#FFFFFF",   // cards
    surfaceMuted: "#F7F7F5", // input / chip background
    border: "#EFEAE3",    // hairline borders
    ink: "#111111",       // primary text / dark surfaces
    inkSoft: "#6B7280",   // secondary text (gray-500)
    brand: "#D6A34F",     // FINFRESH wordmark (gold)
    primary: "#30D5FF",   // action accent (cyan)
    dark: "#090B14",      // tab bar / deep surfaces
};

// Soft neutral shadow for cards / surfaces.
export const cardShadow = {
    shadowColor: "#0B1220",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
};

// Deeper shadow for hero / dark surfaces.
export const heroShadow = {
    shadowColor: "#0B1220",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
    elevation: 10,
};

// Tinted glow under primary CTAs.
export const buttonShadow = {
    shadowColor: "#30D5FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
};

// Dark CTA shadow (for #111 buttons).
export const darkButtonShadow = {
    shadowColor: "#0B1220",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
};
