import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

export default root.render(
  <StrictMode>
    <App />
  </StrictMode>
);