import type { FileSink } from "bun";

let keys: string[] = [];
let writer: FileSink | undefined;

function openNewLog() {
    writer?.end();
    const isoString = new Date().toISOString();
    const filename = "./_csv/" + isoString.substring(0, 4) + isoString.substring(5, 7) + isoString.substring(8, 10) + isoString.substring(11, 13) + isoString.substring(14, 16) + isoString.substring(17, 19) + ".csv";
    console.write("Logging to " + filename + "\n");
    writer = Bun.file(filename).writer();
}

function writeLog(data: string) {
    console.write(data);
    writer?.write(data);
}

const server = Bun.serve({
    routes: {
        "/new": () => {
            keys = [];
            return new Response();
        },
        "/log": (request) => {
            const params = new URL(request.url).searchParams;
            if ([...params.keys()].length !== keys.length || !keys.every(key => params.has(key))) {
                keys = [...params.keys()];
                openNewLog();
                writeLog(keys.join(",") + "\n");
            }
            writeLog(
                keys.map(key => params.get(key) ?? "").join(",") + "\n"
            );
            return new Response();
        },
    },
    fetch: () => new Response("Not Found", { status: 404 }),
});

console.log("Listening on " + server.url);