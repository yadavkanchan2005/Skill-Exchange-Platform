

import http from 'http';
import { initSocket } from './socket/socketMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './config/db.js';



// Connect DB and start server
connectDB().then(() => {
    const server = http.createServer(app);

    
    initSocket(server); 

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(` Server running at http://localhost:${PORT}`);
    });
});
