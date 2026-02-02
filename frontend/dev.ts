import { spawn } from "bun";

spawn({
    cmd: ["bun", "build", "src/main.tsx", "--outdir=dist", "--watch"],
    stdout: "inherit",
    stderr: "inherit",
});

spawn({
    cmd: ["bun", "--hot", "index.ts"],
    stdout: "inherit",
    stderr: "inherit",
});