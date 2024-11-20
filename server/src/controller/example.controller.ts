import { Elysia, t } from "elysia"

export const example = new Elysia()
    .get("/", () => "Hello World", {
        detail: {
            tags: ["Example"],
            summary: "Get Hello World",
            description: "Welcome To My World"
        }
    })
    .get("/home", () => "wwwwwwwww", {

    })
    .post("/about", ({ body }) => {
        return {
            id: 'xxx',
            name: 'Hello' + body.name
        }
    }, {
        body: t.Object({
            name: t.String()
        }), detail: {
            tags: ["Example"],
            summary: "About",
            description: "Welcome To My Soul Society"
        }

    })