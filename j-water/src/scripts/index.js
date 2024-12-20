import WaterCalculator from "./models/waterCalculator.js";

document.getElementById("jbutton").addEventListener("click", (event) => {
    event.preventDefault();
    jWater();
});

export default function jWater() {

    const data = {
        gender: document.querySelector('input[name="gender"]:checked').value,
        age: Number(document.getElementById("age").value),
        height: Number(document.getElementById("height").value),
        weight: Number(document.getElementById("weight").value),
        activity: Number(document.querySelector('input[name="activity"]:checked').value),
        creatine: Number(document.getElementById("creatine").value)
    }

    const result = new WaterCalculator(data);
    const dailyWater = result.calculate(data)
    console.log(dailyWater)
}



