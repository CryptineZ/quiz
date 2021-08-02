import React, {useState, useEffect} from 'react';
import graphql from 'babel-plugin-relay/macro';
import {RelayEnvironmentProvider, loadQuery, usePreloadedQuery} from 'react-relay/hooks';
import RelayEnvironment from './RelayEnvironment';
import { extendTheme, ChakraProvider, Text, Center, Button, HStack, Badge, Box, Spinner, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react"
import { CheckIcon, WarningTwoIcon } from '@chakra-ui/icons'

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

const preloadedQuery = loadQuery(RelayEnvironment, QuestionQuery, {});

function Quiz(props){
  const [questions, setQuestions] = useSessionStorage('questions',shuffle(props.data.questions.slice())); //Data for all questions (question,answer,trivia)
  const [currentQuestion, setCurrentQuestion] = useSessionStorage('currentQuestion',0); //Defines which question is currently shown
  const [showResult, setShowResult] = useSessionStorage('showResult',false); //Defines if the user sees the result of a answered question
  const [currentAnswerCorrect, setCurrentAnswerCorrect] = useSessionStorage('currentAnswerCorrect',null); //Defines if the user answered the currently shown question correct
  const [userQuestionAnswers, setQuestionAnswers] = useSessionStorage('userQuestionAnswers',[]); //Saves the answers of the user for all already answered questions

  useEffect(() => {
    //Update the document title
    const question = questions[currentQuestion];
    if(!question){
      document.title = `Quiz - Resultat`;
    }else{
      document.title = `Quiz - Frage ${currentQuestion + 1} von ${questions.length}`;
    }
  }, [questions, currentQuestion]);

  //Triggered when the user uses a button do answer a question
  //answerUser is either true = Wahr or false = Falsch
  function answerQuestion(answerUser){
    const answerQuestion = questions[currentQuestion].answer; //Correct Answer of the current question
    setQuestionAnswers(userQuestionAnswers.slice().concat([answerUser])); //Update history of answered questions
    setCurrentAnswerCorrect(answerUser === answerQuestion ? true : false); //Set if the user answered the current question correct
    setShowResult(true); //Change the state to show the result screen for the current question
  }

  //Triggered when the user uses the button "Nächste Frage" on the question result screen
  function nextQuestion(){
    setCurrentQuestion(currentQuestion+1);
    setShowResult(false);
  }

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

  //Handler to reset Quiz
  function resetQuiz(){
    setQuestions(shuffle(props.data.questions.slice()));
    setCurrentQuestion(0);
    setShowResult(false);
    setCurrentAnswerCorrect(null);
    setQuestionAnswers([]);
  }

  //Displays the current question that the user has to answer
  function Buttons(){
    return(
      <HStack spacing="24px">
        <Button colorScheme="green" onClick={() => answerQuestion(true)}>Wahr</Button>
        <Button colorScheme="red" onClick={() => answerQuestion(false)}>Falsch</Button>
      </HStack>
    )
  }

  //Displays buttons for the user to answer the question
  function Question(){
    return(
      <Text mb={10} fontSize="2xl">{questions[currentQuestion].question}</Text>
    )
  }

  //Read the current question
  const question = questions[currentQuestion];

  if(!question){ //If there are no more questions then the quiz has ended

    //Calculate how many questions the user answered correctly
    let countCorrectAnswers = 0;
    for(let i=0; i < userQuestionAnswers.length; i++){
      if(userQuestionAnswers[i] === questions[i].answer){
        countCorrectAnswers++;
      }
    }

    //Map the questions answered by the user to show an overview of the questions on the quiz result screen
    const questionResult = userQuestionAnswers.slice().map((userAnswer,i) => {

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

    //Display the quiz result screen
    return (
      <Center mt={10} mb={10} flexDirection="column">
        <Text fontSize="2xl" mb={10}>Das Quiz ist abgeschlossen.</Text>
        {/*Display how many questions has been answered correctly and the total number of questions*/}
        <Text mb={10}>Du hast {countCorrectAnswers} von {userQuestionAnswers.length} Fragen richtig beantwortet.</Text>
        {/*Display an overview of all the questions answered in an accordion*/}
        <Accordion mb={10} allowMultiple>
          <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Übersicht
                </Box>
                <AccordionIcon />
              </AccordionButton>
            <AccordionPanel pb={4}>
              {questionResult}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Button onClick={() => resetQuiz()}>Quiz neu starten</Button>
      </Center>
    );
  }else if(showResult){
    //Display the question result screen
    return (
      <Center mt={10} mb={10} flexDirection="column">
        <Question/>
        {/*Display if the user answered the question correctly*/}
        {currentAnswerCorrect ? renderAnswerCorrect() : renderAnswerWrong()}
        {/*Display a trivia on the answered question*/}
        <Text mb={10}>{question.trivia}</Text>
        {/*Button to continue to the next question*/}
        <Button onClick={() => nextQuestion()}>Nächste Frage</Button>
      </Center>
    );
  }else{
    //Display the current questions that has to be answered
    return (
      <Center mt={10} mb={10} flexDirection="column">
        <Question/>
        {/*Display buttons to answer the question*/}
        <Buttons/>
      </Center>
    );
  }
}

function App(props) {
  const data = usePreloadedQuery(QuestionQuery, props.preloadedQuery);
  return (
    <Quiz data={data}/>
  );
}

function AppRoot(props) {

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
          <App preloadedQuery={preloadedQuery} />
        </Suspense>
      </RelayEnvironmentProvider>
    </ChakraProvider>
  );
}

export default AppRoot;

// Hook to save state in sessionStorage
// https://usehooks.com/useSessionStorage/
function useSessionStorage(key, initialValue) {
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
  const setValue = (value) => {
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
function shuffle(array) {
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
