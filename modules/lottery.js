const getRandomWinner = (participants) => {
  const randomIndex = Math.floor(Math.random() * participants.length);
  return participants[randomIndex];
};

export default getRandomWinner;
