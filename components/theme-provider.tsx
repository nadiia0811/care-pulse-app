"use client"

import * as React from "react";
import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

//import { type ThemeProviderProps } from "next-themes/dist/types"

type Attribute = 'class' | 'data-theme';

export interface ThemeProviderProps {
  children?: ReactNode;
  attribute?: Attribute | Attribute[]; 
  defaultTheme?: string;
  enableSystem?: boolean;
  forcedTheme?: string;
  storageKey?: string;
  themes?: string[];
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
}



export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
