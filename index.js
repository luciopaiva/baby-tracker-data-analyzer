
import process from "node:process";
import fs from "node:fs";

function main(filename) {
    const data = JSON.parse(fs.readFileSync(filename, { encoding: "utf-8" }));
    const records = data["records"];

    analyzeFeverRecords(records);
    analyzeLeisurePlayRecords(records);
}

function analyzeFeverRecords(records) {
    const maxTemperatureByDate = new Map();

    for (const record of records) {
        if (record["subtype"] === "HEALTH_TEMPERATURE") {
            const dateAndTime = record["fromDate"];
            const date = dateAndTime.split(" ")[0];

            let curMax = maxTemperatureByDate.get(date);
            if (!curMax) {
                curMax = -Infinity;
            }

            if (record["amount"] > curMax) {
                maxTemperatureByDate.set(date, record["amount"]);
            }
        }
    }

    console.log("Dates with fever > 37°C:");
    for (const [date, maxTemperature] of maxTemperatureByDate) {
        if (maxTemperature > 37.0) {
            console.log(` - ${date}: ${maxTemperature}°C`);
        }
    }
}

function analyzeLeisurePlayRecords(records) {
    const countByYearMonth = new Map();

    for (const record of records) {
        if (record["subtype"] === "LEISURE_PLAY") {
            const dateAndTime = record["fromDate"];
            const yearMonth = dateAndTime.split(" ")[0].split("-").slice(0, 2).join("-");

            const curCount = countByYearMonth.get(yearMonth) ?? 0;
            countByYearMonth.set(yearMonth, curCount + 1);
        }
    }

    console.log("Play days by year-month:");
    for (const [date, count] of countByYearMonth) {
        console.log(` - ${date}: ${count}`);
    }

}

if (process.argv.length < 3) {
    console.error("Missing arguments");
    process.exit(1);
}

const filename = process.argv[2];

main(filename);