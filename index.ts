import { promises as fs } from "fs";

let keys: string[] = [];
let csvFile: fs.FileHandle | undefined;

async function openNewLog() {
    csvFile?.close();
    const isoString = new Date().toISOString();
    const filename = "./_csv/" + isoString.substring(0, 4) + isoString.substring(5, 7) + isoString.substring(8, 10) + isoString.substring(11, 13) + isoString.substring(14, 16) + isoString.substring(17, 19) + ".csv";
    console.write("Logging to " + filename + "\n");
    csvFile = await fs.open(filename, "w+");
}

function writeLog(data: string) {
    console.write(data);
    return csvFile?.write(data);
}

await fs.mkdir("_csv");
const server = Bun.serve({
    async fetch(request) {
        const params = new URL(request.url).searchParams;
        if ([...params.keys()].length !== keys.length || !keys.every(key => params.has(key))) {
            keys = [...params.keys()];
            await openNewLog();
            await writeLog(keys.join(",") + "\n");
        }
        await writeLog(
            keys.map(key => params.get(key) ?? "").join(",") + "\n"
        );
        return new Response();
    },
});

console.log("Listening on " + server.url);