import React, {useState, useEffect, useCallback} from 'react';
import graphql from 'babel-plugin-relay/macro';
import {RelayEnvironmentProvider, PreloadedQuery, loadQuery, usePreloadedQuery, useLazyLoadQuery, commitMutation, FetchPolicy} from 'react-relay/hooks';
import RelayEnvironment from './RelayEnvironment';
import { extendTheme, ChakraProvider, Text, Center, Button, HStack, Badge, Box, Spinner, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Input } from "@chakra-ui/react"
import { CheckIcon, WarningTwoIcon } from '@chakra-ui/icons'

import { AppQuestionQuery, AppQuestionQueryResponse } from "./__generated__/AppQuestionQuery.graphql"
import { AppScoreQuery } from "./__generated__/AppScoreQuery.graphql"
import { AppCreateScoreMutation } from "./__generated__/AppCreateScoreMutation.graphql"

const { Suspense } = React;

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

function Quiz(props: QuizProps){
  const [questions, setQuestions] = useSessionStorage('questions',props.data.questions ? shuffle(props.data.questions.slice()) : null); //Data for all questions (question,answer,trivia)
  const [currentQuestion, setCurrentQuestion] = useSessionStorage('currentQuestion',0); //Defines which question is currently shown
  const [showResult, setShowResult] = useSessionStorage('showResult',false); //Defines if the user sees the result of a answered question
  const [currentAnswerCorrect, setCurrentAnswerCorrect] = useSessionStorage('currentAnswerCorrect',null); //Defines if the user answered the currently shown question correct
  const [userQuestionAnswers, setQuestionAnswers] = useSessionStorage('userQuestionAnswers',[]); //Saves the answers of the user for all already answered questions

  //Returns if the Quiz has ended
  const showQuizResult = useCallback(
    () => {
      const question = questions[currentQuestion];
      if(!question){
        return true;
      }
      return false;
    },
    [questions, currentQuestion],
  );

  //Returns the Text of the Current Question
  const QuestionText = useCallback(
    () => {
      return(
        <Text mb={10} fontSize="2xl">{questions[currentQuestion].question}</Text>
      );
    },
    [questions, currentQuestion],
  );

  useEffect(() => {
    //Update the document title
    if(showQuizResult()){
      document.title = `Quiz - Resultat`;
    }else{
      document.title = `Quiz - Frage ${currentQuestion + 1} von ${questions.length}`;
    }
  }, [questions, currentQuestion, showQuizResult]);

  //Display the current question for the user to answer
  function Question(){

    //Displays the current question that the user has to answer
    function AnswerButtons(){

      //Triggered when the user uses a button do answer a question
      //answerUser is either true = Wahr or false = Falsch
      function answerQuestion(answerUser: boolean){
        const answerQuestion = questions[currentQuestion].answer; //Correct Answer of the current question
        setQuestionAnswers(userQuestionAnswers.slice().concat([answerUser])); //Update history of answered questions
        setCurrentAnswerCorrect(answerUser === answerQuestion ? true : false); //Set if the user answered the current question correct
        setShowResult(true); //Change the state to show the result screen for the current question
      }

      return(
        <HStack spacing="24px">
          <Button colorScheme="green" onClick={() => answerQuestion(true)}>Wahr</Button>
          <Button colorScheme="red" onClick={() => answerQuestion(false)}>Falsch</Button>
        </HStack>
      )
    }

    return (
      <Center mt={10} mb={10} flexDirection="column">
        {/*Display the text of the current question*/}
        <QuestionText/>
        {/*Display buttons to answer the question*/}
        <AnswerButtons/>
      </Center>
    );
  }

  //Display the answer screen of the current question
  function QuestionAnswer(){
    //Displayed on the result screen if the user answered the question correct
    function renderAnswerCorrect(){
      return(
        <Text mb={10}><CheckIcon mr={1}/>Du hast die <Badge colorScheme="green">korrekte</Badge> Antwort gewählt</Text>
      );
    }

    //Displayed on the result screen if the user answered the question wrong
    function renderAnswerWrong(){
      return(
        <Text mb={10}><WarningTwoIcon mr={1}/> Du hast die <Badge colorScheme="red">falsche</Badge> Antwort gewählt</Text>
      );
    }

    //Triggered when the user uses the button "Nächste Frage" on the question result screen
    function nextQuestion(){
      setCurrentQuestion(currentQuestion+1);
      setShowResult(false);
    }

    return (
      <Center mt={10} mb={10} flexDirection="column">
        {/*Display the text of the current question*/}
        <QuestionText/>
        {/*Display if the user answered the question correctly*/}
        {currentAnswerCorrect ? renderAnswerCorrect() : renderAnswerWrong()}
        {/*Display a trivia on the answered question*/}
        <Text mb={10}>{questions[currentQuestion].trivia}</Text>
        {/*Button to continue to the next question*/}
        <Button onClick={() => nextQuestion()}>Nächste Frage</Button>
      </Center>
    );
  }

  // Quiz Result Screen
  function QuizResult(){
    const [scoreBoardInput, setScoreBoardInputs] = useSessionStorage('scoreBoardInput',''); //User input for scoreboard
    const [scoreBoardSend, setScoreBoardSend] = useSessionStorage('scoreBoardSend',false); //Defines if the user already submitted to the scoreboard
    const [scoardBaordUserId, setScoreBoardUserId] = useSessionStorage('scoardBaordUserId',null); //Saves the id of the users scoreboard entry
    const [queryFetchKey, setQueryFetchKey] = useState(0);
    const [queryPolicy, setQueryPolicy] = useState<FetchPolicy>('store-and-network');

    const refreshScoreboard = useCallback(() => {
      setQueryFetchKey(prev => (prev+1));
      setQueryPolicy('network-only');
    }, []);

    function ScoreBoardList(){

      const data = useLazyLoadQuery<AppScoreQuery>(
        graphql`
          query AppScoreQuery{
            scores{
              id
              name
              score
            }
          }
        `,
        {},
        {fetchPolicy: queryPolicy, fetchKey: queryFetchKey},
      );

      //Check if there are any scores yet
      if(!data || !data.scores || !data.scores.length){
        return(
          <Text mb={2}>Noch keine Resultate</Text>
        );
      }

      const scores = data.scores.slice();

      //Sort scores
      scores.sort(function(a, b) {
        if(!a || !a.score || !b || !b.score){
          return 0;
        }
        return b.score - a.score;
      });

      //Map the data to display scoreboard
      const scoreboardList = scores.map((score,i) => {
        if(score){
          if(scoardBaordUserId === score.id){
            return(
              <Text mb={2} key={i}>
                <strong>{score.name}: {score.score}</strong>
              </Text>
            );
          }else{
            return(
              <Text mb={2} key={i}>
                {score.name}: {score.score}
              </Text>
            );
          }
        }else{
          return '';
        }
      });

      return(
        <Center mb={2} flexDirection="column">
          {scoreboardList}
        </Center>
      );

    }

    function ScoreBoardInput(){
      if(scoreBoardSend){
        return(
          <Box>
            {scoreBoardInput} eingetragen.
          </Box>
        );
      }else{
        return(
          <HStack spacing="24px" mt={3}>
            <Input placeholder="Dein Name" w="200px" value={scoreBoardInput} onChange={(e) => setScoreBoardInputs(e.target.value)}/>
            <Button onClick={() => addToScoreBoard()}>Eintragen</Button>
          </HStack>
        );
      }
    }

    //Add User to Scoreboard
    function addToScoreBoard(){
      const score = countCorrectAnswers();

      const mutation = graphql`
        mutation AppCreateScoreMutation($name: String!, $score: Int!){
          createScore(name: $name, score: $score) {
            id
            name
            score
          }
        }
      `

      const variables = {
        name: scoreBoardInput,
        score: score
      }

      commitMutation<AppCreateScoreMutation>(
        RelayEnvironment,
        {
          mutation,
          variables,
          onCompleted: (response) => {
            setScoreBoardSend(true);
            refreshScoreboard();
            setScoreBoardUserId(response.createScore.id);
          },
          onError: err => console.error(err),
        },
      )
    }

    //Handler to reset Quiz
    function resetQuiz(){
      setQuestions(shuffle(questions.slice()));
      setCurrentQuestion(0);
      setShowResult(false);
      setCurrentAnswerCorrect(null);
      setQuestionAnswers([]);
      setScoreBoardInputs('');
      setScoreBoardSend(false);
    }

    //Calculate how many questions the user answered correctly
    function countCorrectAnswers(){
      let countCorrectAnswers = 0;
      for(let i=0; i < userQuestionAnswers.length; i++){
        if(userQuestionAnswers[i] === questions[i].answer){
          countCorrectAnswers++;
        }
      }
      return countCorrectAnswers;
    }

    //Map the questions answered by the user to show an overview of the questions
    const questionResult = userQuestionAnswers.slice().map((userAnswer: boolean,i: number) => {

      //Check if the user answered the question correctly
      let answerCorrect = false;
      if(userAnswer === questions[i].answer){
        answerCorrect = true;
      }

      //Display the question text, the answer of the user and an indicator if the question was answered correctly
      return(
        <Box mb={2} key={i}>
          Frage: {questions[i].question}
          <br/>
          Meine Antwort: {userAnswer ? 'Wahr' : 'Falsch'}
          <Badge ml={1} colorScheme={answerCorrect ? 'green' : 'red'}>{answerCorrect ? 'Richtig' : 'Falsch'}</Badge>
        </Box>
      );
    });

    return(
      <Center mt={10} mb={10} flexDirection="column">
        <Text fontSize="2xl" mb={10}>Das Quiz ist abgeschlossen.</Text>
        {/*Display how many questions has been answered correctly and the total number of questions*/}
        <Text mb={10}>Du hast {countCorrectAnswers()} von {userQuestionAnswers.length} Fragen richtig beantwortet.</Text>
        {/*Display an overview of all the questions answered in an accordion*/}
        <Accordion mb={10} allowMultiple>
          <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Deine Antworten
                </Box>
                <AccordionIcon />
              </AccordionButton>
            <AccordionPanel pb={4}>
              {questionResult}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        {/*Display scoreboard*/}
        <Text mb={2} fontSize="xl">Bestenliste</Text>
        <Center mb={10} flexDirection="column">
          <React.Suspense fallback="Lade Bestenliste...">
            <ScoreBoardList/>
          </React.Suspense>
          {ScoreBoardInput()}
        </Center>
        {/*Display a button to reset the quiz to start over*/}
        <Button mb={10} onClick={() => resetQuiz()}>Quiz neu starten</Button>
      </Center>
    )
  }

  if(showQuizResult()){
    //Display the quiz result screen
    return (
      <QuizResult/>
    );
  }else if(showResult){
    //Display the question result screen
    return (
      <QuestionAnswer/>
    );
  }else{
    //Display the current questions that has to be answered
    return (
      <Question/>
    );
  }

}

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

  function loader(){
    return (
      <Center minH="100vh">
        <Spinner size="xl"/>
      </Center>
    );
  }

  return (
    <ChakraProvider theme={extendTheme({ config: {  initialColorMode: "dark",  useSystemColorMode: false,} })}> {/*Chakra UI*/}
      <RelayEnvironmentProvider environment={RelayEnvironment}> {/*Relay*/}
        <Suspense fallback={loader()}> {/*While questions are gathered display loading screen*/}
          <App preloadedQuery={loadQuery(RelayEnvironment, QuestionQuery, {})}/>
        </Suspense>
      </RelayEnvironmentProvider>
    </ChakraProvider>
  );
}

export default AppRoot;

// Hook to save state in sessionStorage
// https://usehooks.com/useSessionStorage/
function useSessionStorage(key: string, initialValue: any) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from session storage by key
      const item = window.sessionStorage.getItem(key);
      // Parse stored json or if none return initialValue
      if(item){
        return JSON.parse(item);
      }else{
        // When not in session storage yet, save it
        window.sessionStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue
      }
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to sessionStorage.
  const setValue = (value: any) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to session storage
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

//Function to shuffle the question array randomly
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array: any) {
  var currentIndex = array.length,  randomIndex;

  //While there remain elements to shuffle
  while (0 !== currentIndex) {

    //Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    //And swap it with the current element
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
