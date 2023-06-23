import { config } from "dotenv";
config();
import app from "./server";
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
