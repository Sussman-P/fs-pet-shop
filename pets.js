import process from "process";
import fs from "fs";

const subcommand = process.argv[2];

// read pets.json
// log it to the console
if (subcommand === "read") {
	const petIndexStr = process.argv[3];
	const petIndex = Number(petIndexStr);
	fs.readFile("pets.json", "utf-8", (error, string) => {
		if (error) {
			throw error;
		}

		// Print "Usage: node pets.js read INDEX" to stderr and exit with non-zero-exit code
		const pets = JSON.parse(string);

		if (petIndexStr === undefined) {
			console.log(pets);
		} else if (petIndex >= petIndex.length || petIndex < 0 || Number.isNaN(petIndex)) {
			console.error("Usage: node pets.js read INDEX");
			process.exit(1);
		} else {
			console.log(pets[petIndex]);
		}
	});
} else if (subcommand === "create") {
	// create stuff
	const age = Number(process.argv[3]);
	const kind = process.argv[4];
	const name = process.argv[5];

	fs.readFile("pets.json", "utf-8", (error, string) => {
		if (error) {
			throw error;
		}

		const pets = JSON.parse(string);
		const newPet = { age, kind, name };

		if (Number.isNaN(age) || kind == "" || name == "") {
			console.error("Usage: create AGE KIND NAME");
			process.exit(1);
		} else {
			pets.push(newPet);
			fs.writeFile("pets.json", JSON.stringify(pets), (error) => {
				if (error) {
					throw error;
				}

				console.log(newPet);
			});
		}
	});
} else {
	console.error("Usage: node pets.js [read | create | update | destroy]");
	process.exit(1);
}
