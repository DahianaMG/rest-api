import { pool } from "./database.js";

class LibrosController {
  async getAll(req, res) {
    try {
      const [result] = await pool.query("SELECT * FROM libros");
      res.json(result);
    } catch (e) {
      console.log(e);
    }
  }

  async getOne(req, res) {
    try {
      const libro = req.body;
      const id_libro = parseInt(libro.id);
      const [result] = await pool.query(`select * from libros where id=?`, [
        id_libro,
      ]);

      if (result[0] != undefined) {
        res.json(result);
      } else {
        res.json({
          Error: "No se ha encontrado un libro con el id especificado",
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async add(req, res) {
    const libro = req.body;

    const listaAtributos = [
      "nombre",
      "autor",
      "categoria",
      "año_publicacion",
      "ISBN",
    ];
    const atributosExtra = Object.keys(libro).filter(
      (attr) => !listaAtributos.includes(attr)
    );

    if (atributosExtra.length > 0) {
      return res.json({
        Error: `Atributos inválidos: ${atributosExtra.join(", ")}`,
      });
    }
    try {
      const [result] = await pool.query(
        `INSERT INTO libros(nombre, autor, categoria, año_publicacion, ISBN) VALUES (?, ?, ?, ?, ?)`,
        [
          libro.nombre,
          libro.autor,
          libro.categoria,
          libro.año_publicacion,
          libro.ISBN,
        ]
      );
      res.json({ "ID insertado": result.insertId });
    } catch (e) {
      console.log(e);
    } finally {
      res.json({
        Error: "No se ha podido agregar el registro",
      });
    }
  }

  async delete(req, res) {
    try {
      const libro = req.body;
      const [result] = await pool.query(`DELETE FROM libros WHERE ISBN=(?)`, [
        libro.ISBN,
      ]);
      if (result.affectedRows === 0) {
        res.json({
          Error: "No se ha encontrado un libro con el ISBN especificado",
        });
      }
      res.json({ "Registros eliminados": result.affectedRows });
    } catch (e) {
      console.log(e);
    }
  }

  async update(req, res) {
    const libro = req.body;
    try {
      const [result] = await pool.query(
        `UPDATE libros SET nombre=(?), autor=(?), categoria=(?), año_publicacion=(?), ISBN=(?) WHERE id=(?)`,
        [
          libro.nombre,
          libro.autor,
          libro.categoria,
          libro.año_publicacion,
          libro.ISBN,
          libro.id,
        ]
      );
      if (result.changedRows === 0) {
        res.json({
          Error: "No se ha podido actualizar los campos",
        });
      }
      res.json({ "Registros actualizados": result.changedRows });
    } catch (e) {
      console.log(e);
    }
  }
}

export const libro = new LibrosController();
