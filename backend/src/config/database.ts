import mysql, { Pool } from "mysql2/promise";
import env from "./env";

// Create the connection pool. The pool-specific settings are the defaults
const pool: Pool = mysql.createPool({
    uri: env.DB_URI,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

export default pool;
