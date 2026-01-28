import { animate } from "animejs";

export function startCountdown(
    el: HTMLElement,
    onComplete?: () => void
) {
    const numbers = ["3", "2", "1", "GO"];

    numbers.forEach((value, i) => {
        setTimeout(() => {
            animate(el, {
                scale: [2, 1],
                opacity: [0, 1],
                duration: 700,
                easing: "easeOutExpo",
                begin: () => {
                    el.textContent = value;
                },
                complete: () => {
                    if (i === numbers.length - 1 && onComplete) {
                        onComplete();
                    }
                },
            });
        }, i * 800);
    });
}