export const gradeToRank = (grade: number) => {
    switch (grade) {
        default:
        case 1:
            return "";
        case 2:
            return "B";
        case 3:
            return "A";
        case 4:
            return "S";
        case 5:
            return "SS";
    }
};
