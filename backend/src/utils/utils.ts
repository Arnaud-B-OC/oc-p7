
const mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export function isValidMail(mail: string) {
    return mail.match(mailRegex) ? true : false;
}

export function isValidYear(yearStr: string | number) {
    const year = parseInt(yearStr.toString());

    if (Number.isNaN(year)) return false;

    if (year > new Date().getFullYear()) return false;

    return true;
}
