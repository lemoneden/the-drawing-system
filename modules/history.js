import fs from "fs";

const pathToHistory = "./data/history.json";

const loadHistory = () => {
  try {
    if (fs.existsSync(pathToHistory)) {
      const data = fs.readFileSync(pathToHistory, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.log("Ошибка загрузки истории");
  }
  return [];
};

const saveHistory = (history) => {
  fs.writeFileSync(pathToHistory, JSON.stringify(history, null, 2), "utf-8");
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
    console.log("\n📭 История розыгрышей пуста");
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
