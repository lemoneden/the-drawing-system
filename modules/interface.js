import readline from "readline";
import fs from "fs";

// Цвета
const yellow = "\x1b[33m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const reset = "\x1b[0m";

// Загрузка участников с обработкой ошибок
let participants = [];
try {
  const pathToParticipants = "./data/participants.json";
  if (!fs.existsSync(pathToParticipants)) {
    throw new Error(`Файл не найден: ${pathToParticipants}`);
  }
  const rawData = fs.readFileSync(pathToParticipants, "utf-8");
  const parsed = JSON.parse(rawData);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(
      "Список участников пуст или имеет неверный формат (ожидается массив)",
    );
  }
  participants = parsed;
  console.log(`${green}Загружено ${participants.length} участников${reset}`);
} catch (err) {
  console.error(`${red}Ошибка загрузки участников:${reset} ${err.message}`);
  console.error(`${red}Программа завершена.${reset}`);
  process.exit(1);
}

// Импорты модулей
import getRandomWinner from "./lottery.js";
import { addRecord, showHistory } from "./history.js";

// Функция розыгрыша
const spin = (participantsArray, callback) => {
  if (!participantsArray || participantsArray.length === 0) {
    console.error(`${red}Невозможно провести розыгрыш: нет участников${reset}`);
    callback(null);
    return;
  }

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

    if (
      maxSpeedReached &&
      roundsAfterMaxSpeed >= participantsArray.length &&
      index % participantsArray.length === winnerIndex
    ) {
      draw();
      console.log(
        `\nПОБЕДИТЕЛЬ: ${green}${finalWinner.name}${reset}, ID: ${green}${finalWinner.id}${reset}`,
      );
      callback(finalWinner);
      return;
    }

    setTimeout(animate, speed);
  };

  animate();
};

// Интерфейс
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
          if (winner) {
            try {
              addRecord(participants, winner);
            } catch (err) {
              console.error(
                `${red}Ошибка сохранения истории:${reset} ${err.message}`,
              );
            }
          }
          showMenu();
        });
        break;
      case "2":
        console.log("Показ истории...");
        try {
          showHistory();
        } catch (err) {
          console.error(
            `${red}Ошибка загрузки истории:${reset} ${err.message}`,
          );
        }
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
