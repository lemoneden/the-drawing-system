import readline from "readline";
import fs from "fs";

import getRandomWinner from "./lottery.js";
import { addRecord, showHistory } from "./history.js";

const pathToParticipants = "./data/participants.json";
const participants = JSON.parse(fs.readFileSync(pathToParticipants, "utf-8"));

const spin = (participantsArray, callback) => {
  let index = 0;
  let speed = 100;
  // Сохраняем победителя ДО анимации
  const finalWinner = getRandomWinner(participantsArray);

  const draw = () => {
    const view = participantsArray
      .map((item, i) =>
        i === index % participantsArray.length ? `[ ${item.name} ]` : item.name,
      )
      .join("  ");
    process.stdout.write("\r" + view);
  };

  const animate = () => {
    draw();
    index++;

    if (speed < 300) speed += 15;

    if (speed >= 300) {
      // Используем заранее выбранного победителя

      const winnerName = finalWinner.name;
      const winnerId = finalWinner.id;
      const winnerContacts = finalWinner.contact;

      //   console.log(winnerName, winnerId, winnerContacts);

      console.log(`\nПОБЕДИТЕЛЬ: ${finalWinner.name}`);
      callback(finalWinner);
      return;
    }

    setTimeout(animate, speed);
  };

  animate();
};

// создание интерфейса для ввода данных

const rl = readline.createInterface({
  input: process.stdin, // stdin стандартный ввод
  output: process.stdout, // stdout стадартный вывод
});

// обработка ввода

const showMenu = () => {
  console.log("\n=== СИСТЕМА РОЗЫГРЫША ===");
  console.log("1. Запустить розыгрыш");
  console.log("2. Показать историю");
  console.log("3. Выход");

  rl.question("Выберите действие: ", (answer) => {
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
        console.log("Неверный ввод");
        showMenu();
        break;
    }
  });
};

export default showMenu;
