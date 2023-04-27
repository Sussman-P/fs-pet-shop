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
		// res.set("Content-Type", "application/json");
		res.send(pets);
	});
});

server.get("/pets/:petIndex", (req, res) => {
	const petsInt = Number(req.params.petIndex);
	fs.readFile("pets.json", (error, string) => {
		const pets = JSON.parse(string);

		if (pets[petsInt] === undefined) {
			res.set("Content-Type", "text/plain");
			res.status(404);
			res.send("Not Found!");
		}

		res.send(pets[petsInt]);
	});
});

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
