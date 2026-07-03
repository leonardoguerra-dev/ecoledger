"use client";

import * as React from "react";

// Context to expose the toggle function globally
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export function useColorMode() {
  return React.useContext(ColorModeContext);
}
