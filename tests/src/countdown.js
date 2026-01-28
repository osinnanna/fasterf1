import { animate } from "animejs";

export function startCountdown(targetHTMLElement, onComplete) {
  const counters = ["3", "2", "1", "GO"];

  counters.forEach((value, i) => {
    setTimeout(() => {
      animate(targetHTMLElement, {
        scale: [2, 1],
        opacity: [0, 1],
        duration: 700,
        easing: "easeOutExpo",
        begin: () => {
          targetHTMLElement.textContent = value;
        },
        complete: () => {
          if (i === counters.length - 1 && onComplete) {
            onComplete();
          }
        },
      });
    }, i * 800);
  });
}
