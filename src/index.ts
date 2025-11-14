
import app from "./app";

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Server listening on http://0.0.0.0:${port} (NODE_ENV=${process.env.NODE_ENV || "dev"})`);
});
