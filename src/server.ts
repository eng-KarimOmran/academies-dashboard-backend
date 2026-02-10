import "dotenv/config";
import app from "./app";
import env from "./config/env";

const { port } = env.app;

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});

const myArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const result = myArray.some((e) => e > 6);

console.log(result);