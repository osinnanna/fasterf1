// import Scene from "./components/Scene";

import { h, render } from "preact";
import App from "./App";
// const container = document.createElement("div");
// document.body.appendChild(container);

// Scene(container);

// const res = await fetch("/data/silverstone.json");
// const data = await res.json();
// console.log(data);

render(<App />, document.getElementById("root")!);

