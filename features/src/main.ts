import { startCountdown } from "./countdown";

const el = document.getElementById("countdown")!;
startCountdown(el, () => {
  console.log("Timer has concluded, doing the race starting now")
})