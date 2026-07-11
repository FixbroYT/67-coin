const bigNumRange = 1000000000

export const formatNum = (num: number, small: boolean = false): string => {
    const formatter = new Intl.NumberFormat('en-US');
    const bigFormatter = new Intl.NumberFormat('en-US', {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1
    })

    let result: string

    if (num >= bigNumRange || small) {
        result = bigFormatter.format(num)
    } else {
        result = formatter.format(num)
    }

    return result
}