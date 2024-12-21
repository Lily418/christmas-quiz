import "./App.css";

import quiz from "./quiz.json";
import { useEffect, useState } from "react";

const RoundIntro = ({ roundName, humanReadableRoundNumber }) => {
  return (
    <h2 className="font-sans text-8xl text-white flex flex-col items-center justify-center gap-6">
      <span className="font-serif text-6xl">
        Round {humanReadableRoundNumber}
      </span>
      <span>{roundName}</span>
    </h2>
  );
};

const Question = ({ question }) => {

  if (!question.image) {
    return <div className="flex flex-col items-center justify-center">
      <p className="text-5xl text-white max-w-prose mx-4">
        {question.question}
      </p>
    </div>
  } else {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 max-h-full">
        <p className="text-5xl text-white max-w-prose mx-4">
          {question.question}
        </p>
        {question.image && (
          <div className="h-5/6">
            <img
              src={`${process.env.PUBLIC_URL}/${question.image}`}
              className="object-contain h-full"
            />
          </div>
        )}
      </div>
    );
  }


};

const RoundAnswers = ({ round }) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Enter":
          setRevealed(true);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6 my-4">
      <h2 className="font-sans text-6xl text-white flex flex-col items-center gap-6">
        <span>{round.name}</span>
      </h2>
      <div className={revealed ? "hidden" : "inline"}>
        <button
          className="bg-white rounded-full text-4xl text-black py-2 px-12 mx-4 uppercase"
          onClick={() => {
            setRevealed(true);
          }}
        >
          Reveal
        </button>
      </div>
      <div className={revealed ? "inline" : "hidden"}>
        <ol className="flex flex-col gap-6">
          {round.questions.map((question, index) => {
            return (
              <li className="flex flex-col gap-2">
                <p className="text-white text-xl">
                  {index + 1}. {question.question}
                </p>
                {question.image && <img
                  src={`${process.env.PUBLIC_URL}/${question.image}`}
                  className="object-contain h-[400px]"
                />}
                <p className="text-white text-2xl">{question.answer}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

const Round = ({
  round,
  humanReadableRoundNumber,
  questionNumber,
  setQuestionNumber,
  nextRound,
  previousRound,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log("keydown pressed");
      switch (e.key) {
        case "ArrowLeft":
          if (questionNumber > -1) {
            setQuestionNumber(questionNumber - 1);
          } else {
            previousRound();
          }
          break;

        case "ArrowRight":
          console.log("questionNumber", questionNumber);
          console.log("round.questions.length", round.questions.length);
          if (questionNumber < round.questions.length) {
            console.log("setQuestionNumber");
            setQuestionNumber(questionNumber + 1);
          } else {
            nextRound();
          }
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    nextRound,
    previousRound,
    questionNumber,
    round.questions.length,
    setQuestionNumber,
  ]);

  console.log("questionNumber", questionNumber);
  if (questionNumber === -1) {
    return (
      <RoundIntro
        roundName={round.name}
        humanReadableRoundNumber={humanReadableRoundNumber}
      />
    );
  }

  if (questionNumber >= round.questions.length) {
    return <RoundAnswers round={round} />;
  }

  const question = round.questions[questionNumber];
  return <Question question={question} />;
};

const EndOfQuiz = ({ previousRound }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          previousRound();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-sans text-7xl text-white mx-4">
        Now count up your scores... 🤶
      </h1>
    </div>
  );
};

const StartOfQuiz = ({ nextRound }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowRight":
          nextRound();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-sans text-9xl text-white">🎄 Christmas Quiz 🎄</h1>
    </div>
  );
};

function App() {
  var searchParams = new URLSearchParams(window.location.search);

  const [roundNumber, setRoundNumber] = useState(
    isNaN(parseInt(searchParams.get("round_number")))
      ? -1
      : parseInt(searchParams.get("round_number"))
  );
  const [questionNumber, setQuestionNumber] = useState(
    isNaN(parseInt(searchParams.get("question_number")))
      ? -1
      : parseInt(searchParams.get("question_number"))
  );

  console.log("roundNumber", roundNumber);
  console.log("questionNumber", questionNumber);

  const round = quiz.rounds[roundNumber];

  const Wrapper = ({ children }) => {
    return (
      <div className="bg-emerald-900 h-screen flex flex-col justify-between items-center">
        <div className="flex-1 flex justify-center h-5/6">
          {children}
        </div>
        <a
          className="text-xs text-white w-full"
          href="https://favicon.io/emoji-favicons/christmas-tree"
        >
          Favicon provided by favicon.io
        </a>
      </div>
    );
  };

  const updateQueryString = ({ roundNumber, questionNumber }) => {
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set("round_number", roundNumber);
    searchParams.set("question_number", questionNumber);
    window.location.search = searchParams.toString();
  };

  const nextRound = () => {
    if (roundNumber < quiz.rounds.length) {
      const newRoundNumber = roundNumber + 1;
      const newQuestionNumber = -1;
      setRoundNumber(newRoundNumber);
      setQuestionNumber(newQuestionNumber);
      updateQueryString({
        roundNumber: newRoundNumber,
        questionNumber: newQuestionNumber,
      });
    }
  };

  const previousRound = () => {
    if (roundNumber > 0) {
      const newRoundNumber = roundNumber - 1;
      const newQuestionNumber =
        quiz.rounds[newRoundNumber].questions.length - 1;
      setRoundNumber(newRoundNumber);
      setQuestionNumber(newQuestionNumber);
      updateQueryString({
        roundNumber: newRoundNumber,
        questionNumber: newQuestionNumber,
      });
    } else if (roundNumber === 0) {
      setRoundNumber(-1);
      setQuestionNumber(-1);
      updateQueryString({
        roundNumber: -1,
        questionNumber: -1,
      });
    }
  };

  if (round) {
    return (
      <Wrapper>
        <Round
          round={round}
          humanReadableRoundNumber={(roundNumber + 1).toString()}
          nextRound={nextRound}
          previousRound={previousRound}
          questionNumber={questionNumber}
          setQuestionNumber={(i) => {
            setQuestionNumber(i);
            updateQueryString({
              roundNumber,
              questionNumber: i,
            });
          }}
        />
      </Wrapper>
    );
  } else if (roundNumber >= quiz.rounds.length) {
    return (
      <Wrapper>
        <EndOfQuiz previousRound={previousRound} />
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <StartOfQuiz nextRound={nextRound} />
      </Wrapper>
    );
  }
}

export default App;
