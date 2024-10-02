const app = require("./app");

require("dotenv").config();

const PORT = process.env.APP_PORT || 3001;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
