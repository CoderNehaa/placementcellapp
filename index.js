import bodyParser from "body-parser";
import path from "path"
import express from "express"
import expressEjsLayouts from "express-ejs-layouts";
import router from "./src/router/routes.js";
import session from "express-session";

const server = express();

server.set("view engine", "ejs");
server.set("views", path.join(path.resolve(), "src", "views"));

server.use(expressEjsLayouts);

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(session({
    secret:"IdcsIO70Afrja1hBkx1njb9ZaoJI1cr2",
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))

server.use('/', router);

server.listen(3000, () => {
    console.log("server is listening on port 3000");
})

