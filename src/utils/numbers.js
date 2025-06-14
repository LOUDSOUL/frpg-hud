const numberFormatter = Intl.NumberFormat("en-GB");

export const parseNumberWithCommas = (text) => {
    return Number(text.replaceAll(",", ""));
}

export const getFormattedNumber = (number) => {
    return Number.isNaN(number) ? "0" : numberFormatter.format(number);
}
