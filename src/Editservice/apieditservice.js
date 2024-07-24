const express = require('express');
const router = express.Router();
const connection = require('../../modules/dbconect');

router.get('/:idservice', (req, res) => {
    const { idservice } = req.params;
    var query = 'SELECT * FROM services WHERE idservices = ?';
    connection.query(query, [idservice], (err, results) => {
        if (err) {
            console.log("ERROR " + err.message);
            console.log("err: " + err.message);
            return res.status(500).json({ err: err.message });
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json('Service not found');
        }
    });
});

router.post('/', async (req, res) => {
    const { idservices, name, originalName, price, description} = req.body;
    var query = 'UPDATE services SET name = ?, price = ?, description = ? WHERE idservices = ?';
    connection.query(query, [name, price, description, idservices], async (err, results) => {
        if (err) {
            console.log("ERROR " + err.message);
            return res.status(500).json({ err: err.message });
        }
        if (results.affectedRows > 0) {
            const resp = await fetch("http://localhost:4009/apieditimages", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, originalName })
            });
            if (resp.ok) {
                res.status(200).json("Service updated successfully");
            }
        } else {
            res.status(404).json('Service not found');
        }
    });
});

router.delete('/:idservice/:name', async (req, res) => {
    const { idservice, name } = req.params;
    var query = 'DELETE FROM services WHERE idservices = ?';
    connection.query(query, [idservice], async (err, results) => {
        if (err) {
            console.log("ERROR " + err.message);
            return res.status(500).json({ err: err.message });
        }
        if (results.affectedRows > 0) {
            const url = "http://localhost:4009/apieditimages/" + name;
            const response = await fetch(url, {
                method: 'DELETE'
            });
            if (!response.ok) {
                return res.status(500).json("Error");
            }else{
                res.status(200).json("Service deleted successfully removed")
            }
        } else {
            res.status(404).json('Service not found');
        }
    });
});

module.exports = router;
