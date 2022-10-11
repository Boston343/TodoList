// jshint esversion:6
// to import, use:  'import * as date from "./src/date.js";'
// then you can use date.getDate();

export function getDate() {
    // get current date and format it
    const today = new Date();
    const dateOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    const day = today.toLocaleDateString("en-US", dateOptions);

    return day;
}

export function getDay() {
    // get current date and format it
    const today = new Date();
    const dateOptions = {
        weekday: "long",
    };
    const day = today.toLocaleDateString("en-US", dateOptions);

    return day;
}
