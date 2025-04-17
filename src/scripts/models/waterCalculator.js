export default class WaterCalculator {
    constructor(props) {
        this.gender = props.gender;
        this.age = props.age;
        this.height = props.height;
        this.weight = props.weight;
        this.activity = props.activity;
        this.creatine = props.creatine || 0;
    }

    calculate(props) {
        let result = 0;
        let bmr = 0;
        const creatine = (props.creatine || 0) * 500;

        if (props.gender === "male") {
            bmr = WaterCalculator.getBasalMetabolicRateMale(props.weight, props.height, props.age);
            result = bmr * props.activity + creatine;
            return result;
        }

        bmr = WaterCalculator.getBasalMetabolicRateFemale(props.weight, props.height, props.age);
        result = bmr * props.activity + creatine;
        return result;
    }

    static getBasalMetabolicRateMale(weight, height, age) {
        const result = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        return result;
    }

    static getBasalMetabolicRateFemale(weight, height, age) {
        const result = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        return result;
    }
}