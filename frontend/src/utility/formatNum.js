export const formatNum = (num, small=false) => {
    const formatter = new Intl.NumberFormat('en-US');
    const bigFormatter = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
    });

    if (num >= 1000000000 || small) {
        num = bigFormatter.format(num)
    } else {
        num = formatter.format(num)
    }

    return num
}