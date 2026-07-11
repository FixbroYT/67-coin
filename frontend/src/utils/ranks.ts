const RANKS_CONFIG = [
    { name: "Bronze", levels: ["I", "II", "III", "IV", "V"] },
    { name: "Silver", levels: ["I", "II", "III", "IV", "V"] },
    { name: "Gold", levels: ["I", "II", "III", "IV", "V"] },
    { name: "Platinum", levels: ["I", "II", "III", "IV", "V"] },
    { name: "Diamond", levels: ["I", "II", "III", "IV", "V"] },
    { name: "Master", levels: [""] },
];

export const getRankName = (level: number): string => {
    const rankIndex = Math.floor((level) / 5)
    
    if (rankIndex >= RANKS_CONFIG.length) {
        return RANKS_CONFIG[RANKS_CONFIG.length - 1].name
    }

    const rank = RANKS_CONFIG[rankIndex]

    const tierIndex = (level) % 5
    const tier = rank.levels[tierIndex] || ""

    return `${rank.name} ${tier}`.trim()
};