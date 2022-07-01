const express = require("express");
const fetch = require("node-fetch");

const app = express();

const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(express.urlencoded({
	extended: true,
}));

app.use("/", (request, response, next) => {
	if (request.headers["api-key"] === process.env["API-Key"]) {
		next();
	} else {
		response.status(403).send();

		console.log("Received unauthorized request.");
	}
})

app.get("/", async (request, response) => {
	const proxyResponse = await fetch(request.query.url, {
		method: "GET"
	});

	console.log(proxyResponse.status, request.query.url);

	response.status(proxyResponse.status).send(await proxyResponse.json());
})

app.post("/", async (request, response) => {
	const proxyResponse = await fetch(request.query.url, {
		method: "POST",
		body: request.body
	});

	console.log(proxyResponse.status, request.query.url);

	response.status(proxyResponse.status).send(proxyResponse.body);
})

app.listen(PORT, () => {
	console.log(`Running on port ${PORT}.`);
})