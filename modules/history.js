import fs from "fs";

// Цвета для ошибок
const red = "\x1b[31m";
const reset = "\x1b[0m";

const pathToHistory = "./data/history.json";

const loadHistory = () => {
  try {
    if (!fs.existsSync(pathToHistory)) {
      console.error(
        `${red}Ошибка: файл истории не найден по пути ${pathToHistory}${reset}`,
      );
      process.exit(1);
    }
    const data = fs.readFileSync(pathToHistory, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`${red}Ошибка загрузки истории: ${err.message}${reset}`);
    process.exit(1);
  }
};

const saveHistory = (history) => {
  try {
    fs.writeFileSync(pathToHistory, JSON.stringify(history, null, 2), "utf-8");
  } catch (err) {
    console.error(`${red}Ошибка сохранения истории: ${err.message}${reset}`);
    process.exit(1);
  }
};

const addRecord = (participantsList, winner) => {
  const history = loadHistory();
  const record = {
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    participantsCount: participantsList.length,
    participantsList: participantsList,
    winner: winner,
  };
  history.push(record);
  saveHistory(history);
  return record;
};

const showHistory = () => {
  const history = loadHistory();

  if (history.length === 0) {
    console.log("\nИстория розыгрышей пуста");
    return;
  }

  console.log("\n=== ИСТОРИЯ РОЗЫГРЫШЕЙ ===");
  history.forEach((record, index) => {
    console.log(`\n${index + 1}. ${record.date} ${record.time}`);
    console.log(`   Участников: ${record.participantsCount}`);
    console.log(
      `   Победитель: ${record.winner.name} (${record.winner.contact})`,
    );
  });
};

export { addRecord, showHistory };
