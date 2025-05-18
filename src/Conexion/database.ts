import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'J0rg3@P@Z.$',
  database: 'sistema_inventario',
});

export default pool;
