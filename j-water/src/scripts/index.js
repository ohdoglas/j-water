import WaterCalculator from "./models/waterCalculator.js";

document.getElementById("activity_level_text").addEventListener("click", (event) => {
    event.preventDefault();
    showTips();
})

document.getElementById("jbutton").addEventListener("click", (event) => {
    event.preventDefault();
    jWater();
});

function jWater() {
    const formResult = document.getElementById("result_h1");

    const data = {
        gender: document.querySelector('input[name="gender"]:checked').value,
        age: Number(document.getElementById("age").value),
        height: Number(document.getElementById("height").value),
        weight: Number(document.getElementById("weight").value),
        activity: Number(document.querySelector('input[name="activity"]:checked').value),
        creatine: Number(document.getElementById("creatine").value)
    }

    if (data.age === 0 || data.height === 0 || data.weight === 0) {
        formResult.classList.add("form_result_h1");
        formResult.textContent = `Os valores idade, altura e peso, devem ser maior que zero para o calculo`;
        return
    }

    const result = new WaterCalculator(data);
    const dailyWater = result.calculate(data)

    formResult.classList.add("form_result_h1");
    formResult.textContent = `Você deve ingerir diariamente ${parseInt(dailyWater)} ml de Água`;
}

function showTips() {
    const text = document.getElementById("activity_text");
    const sedentary = document.createElement('p');
    const light = document.createElement('p');
    const moderate = document.createElement('p');
    const active = document.createElement('p');
    const intense = document.createElement('p');

    sedentary.textContent = "Sedentário: Não pratica atividade física regular.";
    light.textContent = "Levemente Ativo: Atividades domésticas, prática de exercícios leves de 2-4 vezes por semana.";
    moderate.textContent = "Moderadamente Ativo: Atividade física regular: corrida, ciclismo ou natação por pelo menos 5 dias por semana.";
    active.textContent = "Muito Ativo: Atividades fisica vigorosa por pelo menos 6 dias na semana.";
    intense.textContent = "Extremamente Ativo: Atividade física intensa. Atletas e fisiculturistas. Pessoas com empregos fisicamente exigentes que também se exercitam fora do trabalho.";

    text.appendChild(sedentary);
    text.appendChild(light);
    text.appendChild(moderate);
    text.appendChild(active);
    text.appendChild(intense);

    const button = document.getElementById("activity_level_text");

    button.style.display = "none";
}