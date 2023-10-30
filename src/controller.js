import { pool } from "./database.js";

class LibrosController {
  async getAll(req, res) {
    try {
      const [result] = await pool.query("SELECT * FROM libros");
      res.json(result);
    } catch (error) {
      res.status(400).json({ Error: "Ocurrió un error al obtener los libros" });
    }
  }

  async getOne(req, res) {
    try {
      const libro = req.body;
      const [result] = await pool.query(`SELECT * FROM libros WHERE id=?`, [
        libro.id,
      ]);
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({
          Error: "No se ha encontrado un libro con el id especificado",
        });
      }
    } catch (error) {
      res.status(400).json({ Error: "Ocurrió un error al obtener el libro" });
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
      return res.status(404).json({
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
    } catch (error) {
      res.status(400).json({ Error: "Ocurrió un error al añadir el libro" });
    }
  }

  async delete(req, res) {
    try {
      const libro = req.body;
      const [result] = await pool.query(`DELETE FROM libros WHERE ISBN=(?)`, [
        libro.ISBN,
      ]);
      if (result.affectedRows === 0) {
        res.status(404).json({
          Error: "No se ha encontrado un libro con el ISBN especificado",
        });
      }
      res.json({ "Registros eliminados": result.affectedRows });
    } catch (error) {
      res.status(400).json({ Error: "Ocurrió un error al eliminar el libro" });
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
        res.status(404).json({
          Error: "No se ha podido actualizar los campos",
        });
      }
      res.json({ "Registros actualizados": result.changedRows });
    } catch (error) {
      res.status(400).json({ Error: "Ocurrió un error al editar el libro" });
    }
  }
}

export const libro = new LibrosController();
