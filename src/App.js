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

class Question extends React.Component {
  render() {
    return(
      <Text mb={10} fontSize="2xl">{this.props.question}</Text>
    )
  }
}

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
      currentQuestion: 0,
      showResult: false,
      currentAnswerCorrect: null,
      questions: questions,
      userQuestionAnswers: [],
    };
  }

  answerQuestion(answerUser){
    const answerQuestion = this.state.questions[this.state.currentQuestion].answer;
    const userQuestionAnswers = this.state.userQuestionAnswers.slice();
    let currentAnswerCorrect = false;
    if(answerUser === answerQuestion){
      currentAnswerCorrect = true;
    }
    this.setState({
      userQuestionAnswers: userQuestionAnswers.concat([answerUser]),
      currentAnswerCorrect: currentAnswerCorrect,
      showResult: !this.state.showResult
    });
  }

  nextQuestion(){
    this.setState({
      showResult: !this.state.showResult,
      currentQuestion: this.state.currentQuestion+1
    });
  }

  renderAnswerCorrect(){
    return(
      <Text mb={10}><CheckIcon/>Du hast die <Badge colorScheme="green">korrekte</Badge> Antwort gewählt</Text>
    );
  }

  renderAnswerWrong(){
    return(
      <Text mb={10}><WarningTwoIcon/> Du hast die <Badge colorScheme="red">falsche</Badge> Antwort gewählt</Text>
    );
  }

  render() {
    const question = this.state.questions[this.state.currentQuestion];
    if(!question){
      let countCorrectAnswers = 0;

      for(let i=0; i < this.state.userQuestionAnswers.length; i++){
        if(this.state.userQuestionAnswers[i] === this.state.questions[i].answer){
          countCorrectAnswers++;
        }
      }

      const questionResult = this.state.userQuestionAnswers.slice().map((userAnswer,i) => {
          let answerCorrect = false;
          if(userAnswer === this.state.questions[i].answer){
            answerCorrect = true;
          }

          return(
            <Box mb={2} key={i}>
              Frage: {this.state.questions[i].question}
              <br/>
              Meine Antwort: {userAnswer ? 'Wahr' : 'Falsch'}
              <Badge ml={1} colorScheme={answerCorrect ? 'green' : 'red'}>{answerCorrect ? 'Richtig' : 'Falsch'}</Badge>
            </Box>
          );
      });

      return (
        <Center mt={10} flexDirection="column">
          <Text fontSize="2xl" mb={10}>Das Quiz ist abgeschlossen.</Text>
          <Text mb={10}>Du hast {countCorrectAnswers} von {this.state.userQuestionAnswers.length} Fragen richtig beantwortet.</Text>
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
      return (
        <Center mt={10} flexDirection="column">
          <Question question={question.question}/>
          {this.state.currentAnswerCorrect ? this.renderAnswerCorrect() : this.renderAnswerWrong()}
          <Text mb={10}>{question.trivia}</Text>
          <Button onClick={() => this.nextQuestion()}>Nächste Frage</Button>
        </Center>
      );
    }else{
      return (
        <Center mt={10} flexDirection="column">
          <Question question={question.question}/>
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
    <ChakraProvider theme={extendTheme({ config: {  initialColorMode: "dark",  useSystemColorMode: false,} })}>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <Suspense fallback={loader()}>
          <App preloadedQuery={preloadedQuery} />
        </Suspense>
      </RelayEnvironmentProvider>
    </ChakraProvider>
  );
}

export default AppRoot;

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
