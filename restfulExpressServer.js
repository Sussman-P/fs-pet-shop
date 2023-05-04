import express from "express";
import fs from "fs/promises";

const server = express();
const PORT = 4000;

// Looks for requests w/ Content-Type = app/json
server.use(express.json());

server.get("/pets", (req, res) => {
	fs.readFile("pets.json", "utf-8").then((data) => {
		res.send(JSON.parse(data));
	});
});

server.post("/pets", (req, res) => {
	const { age, name, type } = req.body;
	//create a new pet
	const pet = { age, name, type };
	// Validation
	if (!type || !age || !name) {
		res.sendStatus(422);
		return;
	}

	fs.readFile("pets.json", "UTF-8")
		.then((data) => {
			const pets = JSON.parse(data);
			pets.push(pet);
			return fs.writeFile("pets.json", JSON.stringify(pets));
		})
		.then(() => {
			res.status(201).send(pet);
		});
	//add it to pets.json
});

server.delete("/pets/:id", (req, res) => {
	fs.readFile("pets.json", "utf-8").then((data) => {
		const pets = JSON.parse(data);

		if (typeof pets[req.params.id] == "object") {
			pets.splice(req.params.id, 1);
			res.status(200).send("pet successfully deleted!");
			return fs.writeFile("pets.json", JSON.stringify(pets));
		} else {
			res.status(404).send("Pet does not exist in that address.");
		}
	});
	// .then(() => {
	// 	res.status(200).send("pets successfully deleted!");
	// });
});

server.listen(4000, () => {
	console.log(`Listening on port: ${PORT}`);
});
