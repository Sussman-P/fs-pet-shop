import fs from "node:fs";
import express from "express";

const server = express();
const port = 3000;

server.get("/", (req, res) => {
	res.send("Hello World!");
});

server.get("/pets", (req, res) => {
	fs.readFile("pets.json", (error, string) => {
		if (error) {
			console.error(error);
			res.status(500);
			return;
		}
		const pets = JSON.parse(string);
		res.send(pets);
	});
});

server.get("/pets/:petIndex", (req, res) => {
	const petsInt = Number(req.params.petIndex);
	fs.readFile("pets.json", (error, string) => {
		if (error) {
			console.error(error);
			res.status(500);
			return;
		}

		const pets = JSON.parse(string);

		if (pets[petsInt] === undefined) {
			res.set("Content-Type", "text/plain");
			res.status(404);
			res.send("Not Found!");
		}

		res.send(pets[petsInt]);
	});
});

server.use(express.json());

server.post("/pets", (req, res, next) => {
	const newPets = req.body;
	console.log("Got body:", req.body);
	fs.readFile("pets.json", (error, string) => {
		if (error) {
			console.error(error);
			res.status(500);
			return;
		}

		let pets = JSON.parse(string);

		if (
			typeof newPets.age === "number" &&
			typeof newPets.name === "string" &&
			typeof newPets.kind === "string"
		) {
			pets.push(newPets);

			fs.writeFile("pets.json", JSON.stringify(pets), (error) => {
				if (error) {
					console.error(error);
					res.status(500);
					return;
				}
				res.set("Content-Type", "application/json");
				res.send(JSON.stringify(newPets));
			});
		} else {
			console.log("Double check data types!");
			res.sendStatus(500);
			return;
		}
	});
});

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
