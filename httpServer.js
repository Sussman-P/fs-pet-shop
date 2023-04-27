import http from "http";
import fs from "fs";

http
	.createServer((req, res) => {
		const petRegExp = /^\/pets\/(\d+)$/;

		if (req.method === "GET" && req.url === "/pets") {
			fs.readFile("pets.json", "utf-8", (err, string) => {
				if (err) {
					console.error(err.stack);
					res.statusCode = 500;
					res.setHeader("Content-Type", "text/plain");
					return res.end("Internal Server Error");
				}

				res.setHeader("Content-Type", "application/json");
				res.end(string);
			});
		} else if (req.method === "GET" && petRegExp.test(req.url)) {
			//get pet index
			const petIndex = Number(req.url.match(petRegExp)[1]);

			fs.readFile("pets.json", "utf-8", (err, string) => {
				if (err) {
					console.error(err.stack);
					res.statusCode = 500;
					res.setHeader("Content-Type", "text/plain");
					return res.end("Internal Server Error");
				}
				res.setHeader("Content-Type", "application/json");
				let pets = JSON.parse(string);
				const pet = pets[petIndex];
				let petsJSON = JSON.stringify(pet);

				if (petsJSON === undefined) {
					console.log("does not exist");
					res.statusCode = 404;
					res.setHeader("Content-Type", "text/plain");
					res.end("Index doesn't exist!");
				}

				res.end(petsJSON);
			});
		} else if (req.method === "POST" && req.url === "/pets") {
			let body = "";
			req.on("data", (chunk) => {
				body += chunk;
			});
			req.on("end", () => {
				fs.readFile("pets.json", "utf-8", (error, string) => {
					if (error) {
						req.statusCode = 500;
						req.end();
					}
					let pets = JSON.parse(string);
					const newPets = JSON.parse(body);
					pets.push(newPets);

					fs.writeFile("pets.json", JSON.stringify(pets), (error) => {
						res.end(JSON.stringify(newPets));
					});
				});
			});
		} else {
			res.statusCode = 404;
			res.setHeader("Content-Type", "text/plain");
			res.end("Not found");
		}
	})
	.listen(3000);
