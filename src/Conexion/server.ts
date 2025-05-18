import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './database';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/compras', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM compras');
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/productos', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

//----------------------------Api Eliminar Producto--------------------------------
app.delete('/api/productos/:id', async (req: Request, res: Response) => {
const id = req.params.id;
try {
     const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
     if ((result as any).affectedRows === 0) {
// //       return res.status(404).json({ message: 'Producto no encontrado' });
     }
     res.json({ message: 'Producto eliminado correctamente' });
   } catch (error) {
     console.error('Error al eliminar producto:', error);
     res.status(500).json({ error: 'Error del servidor' });
   }
 });



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//---------------------Api Crear Producto-----------------------------------------

app.post('/api/productos', async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, cantidad, precio } = req.body;

    if (!nombre || !descripcion || cantidad == null || precio == null) {
  //    return res.status(400).json({ error: 'Faltan campos' });
    }

    await pool.query(
      'INSERT INTO productos (nombre, descripcion, cantidad, precio) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, cantidad, precio]
    );

    res.status(201).json({ message: 'Producto agregado correctamente' });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

//----------------------------------Api Actualizar Producto----------------------------
app.put('/api/productos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, cantidad, precio } = req.body;
  console.log('Actualizar producto id:', id, req.body);
  try {
    await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, cantidad = ?, precio = ? WHERE id = ?',
      [nombre, descripcion, cantidad, precio, id]
    );
    res.status(200).json({ message: "Producto Actualizado" });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});






//___________________________________CODIGO API PROVEEDORES________________________________________________________________//
// ------------------ API Obtener todos los proveedores ------------------
app.get('/api/proveedores', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM proveedores');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// ------------------ API Crear proveedor ------------------
// Crear proveedor
app.post('/api/proveedores', async (req: Request, res: Response) => {
  const { nombre, contacto } = req.body;

  if (!nombre || !contacto) {
 //   return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await pool.query(
      'INSERT INTO proveedores (nombre, contacto) VALUES (?, ?)',
      [nombre, contacto]
    );
    res.status(201).json({ message: 'Proveedor agregado correctamente' });
  } catch (error) {
    console.error('Error al agregar proveedor:', error);
    res.status(500).json({ error: 'Error al agregar proveedor' });
  }
});


app.delete('/api/proveedores/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM proveedores WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) {
 //     return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});