import React from 'react';
import "../App.css";
import Board from '../hardcomponents/Board';
import Keyboard from '../commoncomponents/Keyboard';
import { useState, createContext, useEffect } from "react";
import { boardDefault, generateWordSet } from '../hardcomponents/Words';
import GameOver from '../commoncomponents/GameOver';
export const AppContext = createContext();

function Hard() {
  //use state function used in the code for Appcontext provider
  const [board,setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [correctWord, setCorrectWord] = useState("");
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  //function to reset the page
  const handleReset = () => {
    window.location.reload();
  };
  useEffect(() => {
    generateWordSet(7).then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  }, []);
  //function to do when a letter is pressed
  const onSelectLetter = (key) => {
    if (currAttempt.letterPos > 6) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos] = key;
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1 });
  };
  //function to do when you press delete in the keyboard
  const onDelete = () => {
    if (currAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = " ";
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos - 1 });
  };
  //function to do when you press the enter
  const onEnter = () => {
    let currWord = "";
    for (let i = 0; i < 7; i++) {
      currWord += board[currAttempt.attempt][i].toLowerCase();
    }
    if (currWord.length < 6) {
      window.alert("Word is less than 7 letters");
    } else if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letter: 0 });
    } else {
      window.alert("Word not found");
    }
    if (currWord === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }
    if (currAttempt.attempt === 4) {
      setGameOver({ gameOver: true, guessedWord: false });
      return;
    }
    if (currAttempt.letterPos !== 7) return;
    setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
  };
  //HTML rendering of the page
  return (
    <>
      <div>
        <nav>
          <div className='nav-container'>
          <h1>Wordle</h1>
          <button className='resetButton' onClick={handleReset}>Reset</button>
          </div>
        </nav>
      </div>
      <AppContext.Provider value={{board,setBoard,currAttempt, setCurrAttempt, onSelectLetter,onDelete,onEnter,correctWord,disabledLetters, setDisabledLetters,gameOver, setGameOver}}>
        <div className='game'>
        <Board />    
        {gameOver.gameOver ? <GameOver  
          currAttempt={currAttempt}
          correctWord={correctWord}
          gameOver={gameOver}
          />: <Keyboard
          onEnter={onEnter}
          onDelete={onDelete}
          onSelectLetter={onSelectLetter}
         disabledLetters={disabledLetters}
      />}
        </div>
      </AppContext.Provider>
    </>
  );
}

export default Hard;
