import "dotenv/config";
import app from "./app";
import env from "./config/env";

const { port } = env.app;

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});