"use client"

import { useEffect, useRef, useState, type SVGProps } from "react";
import { TabList } from "./module/tab/TabRoot";
import { tab } from "./module/tab/tab-primitives";

export function ThemeSwitcherDev() {

  const isDarkRef = useRef(() => {
    const theme = localStorage.getItem("theme");
    return theme === "dark";
  });

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 px-4 card p-2 flex gap-3 z-50">
      <button onClick={() => saveThemeToStore("light")}>
        Light
      </button>
      <button onClick={() => { saveThemeToStore("dark") }}>
        Dark
      </button>
      <button onClick={() => { saveThemeToStore("system") }}>
        System
      </button>
    </div>
  )
}


const themeModes = ['light', 'dark', 'system'] as const
type Themes = typeof themeModes[number]

export function getStoredTheme() {
  const theme = globalThis.localStorage?.getItem("theme");
  if (theme === null)
    return "not-set" as const;
  if (!themeModes.includes(theme as Themes))
    return "not-set" as const;
  return theme as Themes
}

export function saveThemeToStore(theme: Themes) {
  if (!themeModes.includes(theme))
    return;
  if (theme === "system") {
    document.documentElement.style.colorScheme = "light dark";
  } else {
    document.documentElement.style.colorScheme = theme;
  }
  localStorage.setItem("theme", theme);
}

export function ThemeSwitcher() {

  // Using useState to prevent hydration error from localsotrage being undefined on the server.
  const [theme, setTheme] = useState<ReturnType<typeof getStoredTheme> | null>(null)
  useEffect(() => setTheme(getStoredTheme()), [])

  if (theme === undefined) return null;
  const tabNum = theme === "light" ? 0 : theme === "dark" ? 1 : 2

  return (
    <TabList
      id="footer"
      className="p-1 tab-item:p-1.5 [&_svg]:w-4 [&_svg]:h-4"
      tabs={[
        tab(<MaterialSymbolsLightModeOutline />),
        tab(<MaterialSymbolsDarkModeOutline />),
        tab(<MaterialSymbolsDesktopWindowsOutline />),
      ]}
      onTabChange={(_, index) => {
        setTheme(themeModes[index])
        saveThemeToStore(themeModes[index])
      }}
      tabNum={tabNum}
    />
  )
}



export function MaterialSymbolsDarkModeOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 21q-3.75 0-6.375-2.625T3 12t2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21m0-2q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5 12q0 2.9 2.05 4.95T12 19m-.25-6.75"></path></svg>
  )
}
export function MaterialSymbolsLightModeOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 15q1.25 0 2.125-.875T15 12t-.875-2.125T12 9t-2.125.875T9 12t.875 2.125T12 15m0 2q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12t-1.463 3.538T12 17m-7-4H1v-2h4zm18 0h-4v-2h4zM11 5V1h2v4zm0 18v-4h2v4zM6.4 7.75L3.875 5.325L5.3 3.85l2.4 2.5zm12.3 12.4l-2.425-2.525L17.6 16.25l2.525 2.425zM16.25 6.4l2.425-2.525L20.15 5.3l-2.5 2.4zM3.85 18.7l2.525-2.425L7.75 17.6l-2.425 2.525zM12 12"></path></svg>
  )
}
export function MaterialSymbolsDesktopWindowsOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M8 21v-2h2v-2H4q-.825 0-1.412-.587T2 15V5q0-.825.588-1.412T4 3h16q.825 0 1.413.588T22 5v10q0 .825-.587 1.413T20 17h-6v2h2v2zm-4-6h16V5H4zm0 0V5z"></path></svg>
  )
}




export function MaterialSymbolsNightsStayOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M13.1 23h-2.6l.5-.312q.5-.313 1.088-.7t1.087-.7l.5-.313q2.025-.15 3.738-1.225t2.712-2.875q-2.15-.2-4.075-1.088t-3.45-2.412t-2.425-3.45T9.1 5.85Q7.175 6.925 6.088 8.813T5 12.9v.3l-.3.138q-.3.137-.663.287t-.662.288l-.3.137q-.05-.275-.062-.575T3 12.9q0-3.65 2.325-6.437T11.25 3q-.45 2.475.275 4.838t2.5 4.137t4.138 2.5T23 14.75q-.65 3.6-3.45 5.925T13.1 23M6 21h4.5q.625 0 1.063-.437T12 19.5t-.425-1.062T10.55 18h-1.3l-.5-1.2q-.35-.825-1.1-1.312T6 15q-1.25 0-2.125.863T3 18q0 1.25.875 2.125T6 21m0 2q-2.075 0-3.537-1.463T1 18t1.463-3.537T6 13q1.5 0 2.738.813T10.575 16Q12 16.05 13 17.063t1 2.437q0 1.45-1.025 2.475T10.5 23z"></path></svg>
  )
}