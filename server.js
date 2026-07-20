{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "commonjs",
  "engines": {
    "node": "20.x"
  },
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.6",
    "dotenv": "^16.6.1",
    "express": "^4.22.2",
    "helmet": "^7.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.24.1",
    "morgan": "^1.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
