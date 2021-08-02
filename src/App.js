import React from 'react';
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

//Displays the current question that the user has to answer
class Question extends React.Component {
  render() {
    return(
      <Text mb={10} fontSize="2xl">{this.props.question}</Text>
    )
  }
}

//Displays buttons for the user to answer the question
class Buttons extends React.Component {
  render() {
    return(
      <HStack spacing="24px">
        <Button colorScheme="green" onClick={() => this.props.onClick(true)}>Wahr</Button>
        <Button colorScheme="red" onClick={() => this.props.onClick(false)}>Falsch</Button>
      </HStack>
    )
  }
}

class Quiz extends React.Component {
  constructor(props){
    super(props);

    const questions = shuffle(props.data.questions.slice());
    this.state = {
      currentQuestion: 0, //Defines which question is currently shown
      showResult: false, //Defines if the user see the result of a answered question
      currentAnswerCorrect: null, //Defines if the user answered the currently shown question correct
      questions: questions, //Data for all questions (question,answer,trivia)
      userQuestionAnswers: [], //Saves the answers of the user for all already answered questions
    };
  }

  //Triggered when the user uses a button do answer a question
  //answerUser is either true = Wahr or false = Falsch
  answerQuestion(answerUser){
    const answerQuestion = this.state.questions[this.state.currentQuestion].answer; //Correct Answer of the current question
    const userQuestionAnswers = this.state.userQuestionAnswers.slice(); //History of all the answered questions
    let currentAnswerCorrect = false; //Defines if the user answered the currenct question correct
    if(answerUser === answerQuestion){ //Check if the user answered the current question correct
      currentAnswerCorrect = true;
    }
    this.setState({
      userQuestionAnswers: userQuestionAnswers.concat([answerUser]), //Update history of answered questions
      currentAnswerCorrect: currentAnswerCorrect, //Set if the user answered the current question correct
      showResult: true //Change the state to show the result screen for the current question
    });
  }

  //Triegered when the user uses the button "Nächste Frage" on the question result screen
  nextQuestion(){
    this.setState({
      showResult: false, //Disable showing the result screen
      currentQuestion: this.state.currentQuestion+1 //Advane to the next question
    });
  }

  //Displayed on the result screen if the user answered the question correct
  renderAnswerCorrect(){
    return(
      <Text mb={10}><CheckIcon/>Du hast die <Badge colorScheme="green">korrekte</Badge> Antwort gewählt</Text>
    );
  }

  //Displayed on the result screen if the user answered the question wrong
  renderAnswerWrong(){
    return(
      <Text mb={10}><WarningTwoIcon/> Du hast die <Badge colorScheme="red">falsche</Badge> Antwort gewählt</Text>
    );
  }

  render() {
    //Read the current question
    const question = this.state.questions[this.state.currentQuestion];

    if(!question){ //If there are no more questions then the quiz has ended

      //Calculate how many questions the user answered correctly
      let countCorrectAnswers = 0;
      for(let i=0; i < this.state.userQuestionAnswers.length; i++){
        if(this.state.userQuestionAnswers[i] === this.state.questions[i].answer){
          countCorrectAnswers++;
        }
      }

      //Map the questions answered by the user to show an overview of the questions on the quiz result screen
      const questionResult = this.state.userQuestionAnswers.slice().map((userAnswer,i) => {

          //Check if the user answered the question correctly
          let answerCorrect = false;
          if(userAnswer === this.state.questions[i].answer){
            answerCorrect = true;
          }

          //Display the question text, the answer of the user and an indicator if the question was answered correctly
          return(
            <Box mb={2} key={i}>
              Frage: {this.state.questions[i].question}
              <br/>
              Meine Antwort: {userAnswer ? 'Wahr' : 'Falsch'}
              <Badge ml={1} colorScheme={answerCorrect ? 'green' : 'red'}>{answerCorrect ? 'Richtig' : 'Falsch'}</Badge>
            </Box>
          );
      });

      //Display the quiz result screen
      return (
        <Center mt={10} flexDirection="column">
          <Text fontSize="2xl" mb={10}>Das Quiz ist abgeschlossen.</Text>
          {/*Display how many questions has been answered correctly and the total number of questions*/}
          <Text mb={10}>Du hast {countCorrectAnswers} von {this.state.userQuestionAnswers.length} Fragen richtig beantwortet.</Text>
          {/*Display an overview of all the questions answered in an accordion*/}
          <Accordion allowMultiple>
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
        </Center>
      );
    }else if(this.state.showResult){
      //Display the question result screen
      return (
        <Center mt={10} flexDirection="column">
          <Question question={question.question}/>
          {/*Display if the user answered the question correctly*/}
          {this.state.currentAnswerCorrect ? this.renderAnswerCorrect() : this.renderAnswerWrong()}
          {/*Display a trivia on the answered question*/}
          <Text mb={10}>{question.trivia}</Text>
          {/*Button to continue to the next question*/}
          <Button onClick={() => this.nextQuestion()}>Nächste Frage</Button>
        </Center>
      );
    }else{
      //Display the current questions that has to be answered
      return (
        <Center mt={10} flexDirection="column">
          <Question question={question.question}/>
          {/*Display buttons to answer the question*/}
          <Buttons onClick={(answer) => this.answerQuestion(answer)}/>
        </Center>
      );
    }
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
