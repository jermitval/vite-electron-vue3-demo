import { Store } from "vuex"

const setDarkMode = (dark: boolean) => {
  dark
    ? document.querySelector("html")?.classList.add("dark")
    : document.querySelector("html")?.classList.remove("dark")
}

export default (store: Store<VRState>) => {
  window.onresize = () => {
    const width =
      document.body.clientWidth || document.documentElement.clientWidth
    const height =
      document.body.clientHeight || document.documentElement.clientHeight

    store.commit("app/screen", { width, height })
  }

  const darkmode = window.matchMedia("(prefers-color-scheme: dark)")
  setDarkMode(darkmode.matches)
  if (darkmode.addEventListener)
    darkmode.addEventListener("change", () => setDarkMode(darkmode.matches))
}
