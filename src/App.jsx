// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// Data
import { wordsList } from './data/words';

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

const GUESSES_QUANTITY = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(GUESSES_QUANTITY);
  const [score, setScore] = useState(0)

  const pickWordAndCategory = () => {
    // pick a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)]

    console.log(category);

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    console.log(word);

    return { word, category };
  }

  // starts the secret word game
  const startGame = () => {
    // pick word and pick category
    const { word, category } = pickWordAndCategory();

    // create array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((letra) => letra.toLowerCase());

    console.log(word, category);
    console.log(wordLetters);

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }

  // process the letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utiliezed
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters(prevGuessedLetters => [...prevGuessedLetters, normalizedLetter])
    } else {
      setWrongLetters(prevWrongLetters => [...prevWrongLetters, normalizedLetter])
      setGuesses(prevGuesses => prevGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // DidUpdate // Quando Atualizar
  useEffect(() => {

    if(guesses <= 0) {
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }

  }, [guesses])

  // restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(GUESSES_QUANTITY);

    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' &&
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      }
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
};

export default App;
