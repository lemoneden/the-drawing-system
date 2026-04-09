import readline from "readline";
import fs from "fs";

import getRandomWinner from "./lottery.js";
import { addRecord, showHistory } from "./history.js";

const yellow = "\x1b[33m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const reset = "\x1b[0m";

const pathToParticipants = "./data/participants.json";
const participants = JSON.parse(fs.readFileSync(pathToParticipants, "utf-8"));

// const spin = (participantsArray, callback) => {
//   let index = 0;
//   let speed = 100;
//   // Сохраняем победителя ДО анимации
//   const finalWinner = getRandomWinner(participantsArray);

//   const draw = () => {
//     const view = participantsArray
//       .map((item, i) =>
//         i === index % participantsArray.length ? `[ ${item.name} ]` : item.name,
//       )
//       .join("  ");
//     process.stdout.write("\r" + view);
//   };

//   const animate = () => {
//     draw();
//     index++;
//     const maxSpeed = 450;

//     if (speed < maxSpeed) speed += 15;

//     if (speed >= maxSpeed) {
//       // Используем заранее выбранного победителя
//       console.log(`\nПОБЕДИТЕЛЬ: ${finalWinner.name}`);
//       callback(finalWinner);
//       return;
//     }

//     setTimeout(animate, speed);
//   };

const spin = (participantsArray, callback) => {
  let index = 0;
  let speed = 100;
  const finalWinner = getRandomWinner(participantsArray);
  const winnerIndex = participantsArray.findIndex(
    (p) => p.id === finalWinner.id,
  );
  let maxSpeedReached = false;
  let roundsAfterMaxSpeed = 0;

  const draw = () => {
    const view = participantsArray
      .map((item, i) =>
        i === index % participantsArray.length
          ? `${green}[ ${item.name} ]${reset}`
          : item.name,
      )
      .join("  ");
    process.stdout.write("\r" + view);
  };

  const animate = () => {
    draw();
    index++;
    const maxSpeed = 450;

    if (speed < maxSpeed) {
      speed += 15;
    } else {
      maxSpeedReached = true;
    }

    if (maxSpeedReached) {
      roundsAfterMaxSpeed++;
    }

    // Останавливаемся, когда сделали хотя бы 1 полный круг на максимальной скорости И дошли до победителя
    if (
      maxSpeedReached &&
      roundsAfterMaxSpeed >= participantsArray.length &&
      index % participantsArray.length === winnerIndex
    ) {
      draw(); // <-- добавить: финальная отрисовка с подсветкой победителя
      console.log(`\nПОБЕДИТЕЛЬ: ${green}${finalWinner.name}${reset}`);
      callback(finalWinner);
      return;
    }

    setTimeout(animate, speed);
  };

  animate();
};

// animate();

// создание интерфейса для ввода данных

const rl = readline.createInterface({
  input: process.stdin, // stdin стандартный ввод
  output: process.stdout, // stdout стадартный вывод
});

// обработка ввода

const showMenu = () => {
  console.log(`\n${yellow}=== СИСТЕМА РОЗЫГРЫША ===${reset}`);
  console.log(`${green}[ 1 ]${reset} Запустить розыгрыш`);
  console.log(`${green}[ 2 ]${reset} Показать историю`);
  console.log(`${green}[ 3 ]${reset} Выход`);

  rl.question(`${yellow}Выберите действие: ${reset}`, (answer) => {
    switch (answer) {
      case "1":
        console.log("Запуск розыгрыша...");
        spin(participants, (winner) => {
          console.log("Розыгрыш закончен, победитель:", winner);
          addRecord(participants, winner);
          showMenu();
        });
        break;
      case "2":
        console.log("Показ истории...");
        showHistory();
        showMenu();
        break;
      case "3":
        console.log("До свидания!");
        rl.close();
        break;
      default:
        console.log(`${red}Неверный ввод${reset}`);
        console.log(
          `${red}Выберите одно из доступных действий, например 2${reset}`,
        );
        showMenu();
        break;
    }
  });
};

export default showMenu;
