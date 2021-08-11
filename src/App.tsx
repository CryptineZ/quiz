import React, {useEffect, useCallback} from 'react';
import graphql from 'babel-plugin-relay/macro';
import {RelayEnvironmentProvider, PreloadedQuery, loadQuery, usePreloadedQuery} from 'react-relay/hooks';
import RelayEnvironment from './RelayEnvironment';
import {extendTheme, ChakraProvider, Center, Spinner, Box, Badge} from '@chakra-ui/react';
import shuffle from './Helper/shuffle';
import useSessionStorage from './Helper/useSessionStorage';
import Question from './Components/Question';
import QuestionAnswer from './Components/QuestionAnswer';
import QuizResult from './Components/QuizResult';

import {AppQuestionQuery, AppQuestionQueryResponse} from './__generated__/AppQuestionQuery.graphql';

// Used to preload Question data
const QuestionQuery = graphql`
  query AppQuestionQuery{
    questions{
      question
      answer
      trivia
    }
  }
`;

type QuizProps = {
  data: AppQuestionQueryResponse
}

const Quiz = (props: QuizProps) => {
  const [questions, setQuestions] = useSessionStorage('questions', props.data.questions ? shuffle(props.data.questions.slice()) : null); // Data for all questions (question,answer,trivia)
  const [currentQuestion, setCurrentQuestion] = useSessionStorage('currentQuestion', 0); // Defines which question is currently shown
  const [showResult, setShowResult] = useSessionStorage('showResult', false); // Defines if the user sees the result of a answered question
  const [currentAnswerCorrect, setCurrentAnswerCorrect] = useSessionStorage('currentAnswerCorrect', null); // Defines if the user answered the currently shown question correct
  const [userQuestionAnswers, setQuestionAnswers] = useSessionStorage('userQuestionAnswers', []); // Saves the answers of the user for all already answered questions

  // Returns if the Quiz has ended
  const showQuizResult = useCallback(
      () => {
        const question = questions[currentQuestion];
        if (!question) {
          return true;
        }
        return false;
      },
      [questions, currentQuestion],
  );

  useEffect(() => {
    // Update the document title
    if (showQuizResult()) {
      document.title = `Quiz - Resultat`;
    } else {
      document.title = `Quiz - Frage ${currentQuestion + 1} von ${questions.length}`;
    }
  }, [questions, currentQuestion, showQuizResult]);

  // Triggered when the user uses a button do answer a question
  // answerUser is either true = Wahr or false = Falsch
  const answerQuestion = (answerUser: boolean) => {
    const answerQuestion = questions[currentQuestion].answer;
    setQuestionAnswers(userQuestionAnswers.slice().concat([answerUser])); // Update history of answered questions
    setCurrentAnswerCorrect(answerUser === answerQuestion ? true : false); // Set if the user answered the current question correct
    setShowResult(true); // Change the state to show the result screen for the current question
  };

  // Triggered when the user uses the button "Nächste Frage" on the question result screen
  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion+1);
    setShowResult(false);
  };

  // Handler to reset Quiz
  const resetQuiz = () => {
    setQuestions(shuffle(questions.slice()));
    setCurrentQuestion(0);
    setShowResult(false);
    setCurrentAnswerCorrect(null);
    setQuestionAnswers([]);
  };

  // Calculate how many questions the user answered correctly
  const countCorrectAnswers = () => {
    let countCorrectAnswers = 0;
    for (let i=0; i < userQuestionAnswers.length; i++) {
      if (userQuestionAnswers[i] === questions[i].answer) {
        countCorrectAnswers++;
      }
    }
    return countCorrectAnswers;
  };

  if (showQuizResult()) {
    // Map the questions answered by the user to show an overview of the questions
    const questionOverview = userQuestionAnswers.slice().map((userAnswer: boolean, i: number) => {
      // Check if the user answered the question correctly
      let answerCorrect = false;
      if (userAnswer === questions[i].answer) {
        answerCorrect = true;
      }

      // Display the question text, the answer of the user and an indicator if the question was answered correctly
      return (
        <Box mb={2} key={i}>
          Frage: {questions[i].question}
          <br/>
          Meine Antwort: {userAnswer ? 'Wahr' : 'Falsch'}
          <Badge ml={1} colorScheme={answerCorrect ? 'green' : 'red'}>{answerCorrect ? 'Richtig' : 'Falsch'}</Badge>
        </Box>
      );
    });

    // Display the quiz result screen
    return (
      <QuizResult resetQuiz={resetQuiz} countCorrectAnswers={countCorrectAnswers()} countQuestions={userQuestionAnswers.length} questionOverview={questionOverview}/>
    );
  } else if (showResult) {
    // Display the question result screen
    return (
      <QuestionAnswer question={questions[currentQuestion].question} trivia={questions[currentQuestion].trivia} currentAnswerCorrect={currentAnswerCorrect} nextQuestion={nextQuestion}/>
    );
  } else {
    // Display the current questions that has to be answered
    return (
      <Question question={questions[currentQuestion].question} answerQuestion={answerQuestion}/>
    );
  }
};

type AppProps = {
  preloadedQuery: PreloadedQuery<AppQuestionQuery>,
}

function App(props: AppProps) {
  const data = usePreloadedQuery(QuestionQuery, props.preloadedQuery);

  return (
    <Quiz data={data}/>
  );
}

function AppRoot() {
  const loader = () => {
    return (
      <Center minH="100vh">
        <Spinner size="xl"/>
      </Center>
    );
  };

  return (
    <ChakraProvider theme={extendTheme({config: {initialColorMode: 'dark', useSystemColorMode: false}})}> {/* Chakra UI*/}
      <RelayEnvironmentProvider environment={RelayEnvironment}> {/* Relay*/}
        <React.Suspense fallback={loader()}> {/* While questions are gathered display loading screen*/}
          <App preloadedQuery={loadQuery(RelayEnvironment, QuestionQuery, {})}/>
        </React.Suspense>
      </RelayEnvironmentProvider>
    </ChakraProvider>
  );
}

export default AppRoot;
