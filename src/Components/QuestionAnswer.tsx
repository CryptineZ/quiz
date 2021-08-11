import React from 'react';
import {Center, Button, Text, Badge} from '@chakra-ui/react';
import QuestionText from './QuestionText';
import {CheckIcon, WarningTwoIcon} from '@chakra-ui/icons';

type QuestionAnswerProps = {
  question: String,
  trivia: String,
  currentAnswerCorrect: Boolean,
  nextQuestion: () => void
}

// Display the answer screen of the current question
const QuestionAnswer = (props: QuestionAnswerProps) => {
  // Displayed on the result screen if the user answered the question correct
  const renderAnswerCorrect = () => {
    return (
      <Text mb={10}><CheckIcon mr={1}/>Du hast die <Badge colorScheme="green">korrekte</Badge> Antwort gewählt</Text>
    );
  };

  // Displayed on the result screen if the user answered the question wrong
  const renderAnswerWrong = () => {
    return (
      <Text mb={10}><WarningTwoIcon mr={1}/> Du hast die <Badge colorScheme="red">falsche</Badge> Antwort gewählt</Text>
    );
  };

  return (
    <Center mt={10} mb={10} flexDirection="column">
      {/* Display the text of the current question*/}
      <QuestionText question={props.question}/>
      {/* Display if the user answered the question correctly*/}
      {props.currentAnswerCorrect ? renderAnswerCorrect() : renderAnswerWrong()}
      {/* Display a trivia on the answered question*/}
      <Text mb={10}>{props.trivia}</Text>
      {/* Button to continue to the next question*/}
      <Button onClick={() => props.nextQuestion()}>Nächste Frage</Button>
    </Center>
  );
};

export default QuestionAnswer;
