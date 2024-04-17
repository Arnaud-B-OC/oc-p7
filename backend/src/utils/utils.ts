
const mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export function isValidMail(mail: string | undefined) {
    if (!mail) return false;
    if (typeof mail != 'string') return false;

    return mail.match(mailRegex) ? true : false;
}

export function isValidYear(yearStr: string | number | undefined) {
    if (!yearStr) return false;

    const year = parseInt(yearStr.toString());

    if (Number.isNaN(year)) return false;

    if (year > new Date().getFullYear()) return false;

    return true;
}

export function isValidRating(ratingStr: string | number | undefined) {
    if (ratingStr == undefined) return false;

    const rating = parseInt(ratingStr.toString());
    if (Number.isNaN(rating)) return false;

    if (rating > 5 || rating < 0) return false;

    return true;
}

export function tryParseJSON(str: string) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return undefined
    }
}
