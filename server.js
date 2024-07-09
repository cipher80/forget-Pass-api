const app = require('./app');
require('./config/db'); // Initialize database connection
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
