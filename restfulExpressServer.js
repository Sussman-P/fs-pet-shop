import express from "express";
import fs from "fs/promises";
import pg from "pg";

const server = express();
const PORT = 4000;

// Looks for requests w/ Content-Type = app/json
server.use(express.json());

const db = new pg.Pool({
	database: "petshop",
});

server.get("/pets", (req, res) => {
	db.query("SELECT * FROM pet", []).then((result) => {
		res.send(result.rows);
	});
});

server.get("/pets/:id", (req, res) => {
	const id = Number(req.params.id);
	// const { id } = req.params;

	if (Number.isNaN(id)) {
		res.sendStatus(422);
		return;
	}
	db.query("SELECT * FROM pet WHERE id = $1", [id]).then((result) => {
		if (result.rows.length === 0) {
			res.sendStatus(404);
		} else {
			res.send(result.rows[0]);
		}
	});
});

server.post("/pets", (req, res) => {
	const { name, kind } = req.body;
	const age = Number(req.body.age);

	//Validation
	if (!kind || Number.isNaN(age) || !name) {
		res.sendStatus(422);
		return;
	}

	db.query("INSERT INTO pet (name, age, kind) VALUES ($1, $2, $3) RETURNING *", [
		name,
		age,
		kind,
	]).then((result) => {
		res.status(201).send(result.rows[0]);
	});
});

server.delete("/pets/:id", (req, res) => {
	const id = Number(req.params.id);
	if (Number.isNaN(id)) {
		res.sendStatus(422);
		return;
	}

	db.query("DELETE FROM pet WHERE id = $1 RETURNING *", [id]).then((result) => {
		if (result.rows.length === 0) {
			res.sendStatus(404);
		} else {
			res.send(result.rows[0]);
		}
	});
});

server.patch("/pets/:id", (req, res) => {
	// Get pet index, and parse it as Number,
	const id = Number(req.params.id);
	// Get pet fields from request body,
	const { name, kind } = req.body;
	// Validate given fields,
	const age = Number(req.body.age);
	if ((!age && !name && !kind) || (age && Number.isNaN(age)) || Number.isNaN(id)) {
		res.sendStatus(422);
		return;
	}
	db.query(
		"UPDATE pet SET name = COALESCE($1, name), age = COALESCE($2, age), kind = COALESCE($3, kind) WHERE id = $4 RETURNING *",
		[name, age, kind, id]
	).then((result) => {
		res.send(result.rows[0]);
	});
});

// server.get("/pets", (req, res) => {
// 	fs.readFile("pets.json", "utf-8").then((data) => {
// 		res.send(JSON.parse(data));
// 	});
// });

// server.post("/pets", (req, res) => {
// 	const { age, name, kind } = req.body;
// 	//create a new pet
// 	const pet = { age, name, kind };
// 	// Validation
// 	if (!kind || !age || !name) {
// 		res.sendStatus(422);
// 		return;
// 	}

// 	fs.readFile("pets.json", "UTF-8")
// 		.then((data) => {
// 			const pets = JSON.parse(data);
// 			pets.push(pet);
// 			return fs.writeFile("pets.json", JSON.stringify(pets));
// 		})
// 		.then(() => {
// 			res.status(201).send(pet);
// 		});
// 	//add it to pets.json
// });

// server.patch("/pets/:petIndex", (req, res) => {
// 	// Get pet index, and parse it as Number,
// 	const petIndex = Number(req.params.petIndex);
// 	// Get pet fields from request body,
// 	const { age, name, kind } = req.body;
// 	// Validate given fields,
// 	const ageNum = Number(age);
// 	if ((!age && !name && !kind) || (age && Number.isNaN(ageNum)) || Number.isNaN(petIndex)) {
// 		res.sendStatus(422);
// 		return;
// 	}
// 	// Read pets.json,
// 	fs.readFile("pets.json", "utf-8").then((data) => {
// 		const pets = JSON.parse(data);

// 		if (petIndex < 0 && petIndex >= pets.length) {
// 			res.sendStatus(404);
// 			return;
// 		}
// 		const petToUpdate = pets[petIndex];
// 		// console.log({ age, name, kind }, petToUpdate);
// 		if (name !== undefined) {
// 			petToUpdate.name = name;
// 		}
// 		if (kind !== undefined) {
// 			petToUpdate.kind = kind;
// 		}
// 		if (age !== undefined) {
// 			petToUpdate.age = ageNum;
// 		}

// 		// Validate petIndex is in range,
// 		// update the pet in question
// 		// write results back to pets.json
// 		fs.writeFile("pets.json", JSON.stringify(pets));
// 		// return response 201
// 		res.send(petToUpdate);
// 	});
// });

// server.delete("/pets/:id", (req, res) => {
// 	fs.readFile("pets.json", "utf-8").then((data) => {
// 		const pets = JSON.parse(data);

// 		if (pets[req.params.id] === "undefined") {
// 			pets.splice(req.params.id, 1);
// 			res.status(200).send("pet successfully deleted!");
// 			return fs.writeFile("pets.json", JSON.stringify(pets));
// 		} else {
// 			res.status(404).send("Pet does not exist in that address.");
// 		}
// 	});
// });

server.listen(4000, () => {
	console.log(`Listening on port: ${PORT}`);
});
