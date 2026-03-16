import mysql, { Pool } from "mysql2/promise";
import env from "./env";

// Create the connection pool. The pool-specific settings are the defaults
const pool: Pool = mysql.createPool({
   host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

export default pool;
