import React from 'react';
import {Center, Button, HStack} from '@chakra-ui/react';
import QuestionText from './QuestionText';

type QuestionProps = {
  question: String,
  answerQuestion: (answerUser: boolean) => void
}

// Display the current question for the user to answer
const Question = (props: QuestionProps) => {
  // Displays the current question that the user has to answer
  const AnswerButtons = () => {
    return (
      <HStack spacing="24px">
        <Button colorScheme="green" onClick={() => props.answerQuestion(true)}>Wahr</Button>
        <Button colorScheme="red" onClick={() => props.answerQuestion(false)}>Falsch</Button>
      </HStack>
    );
  };

  return (
    <Center mt={10} mb={10} flexDirection="column">
      {/* Display the text of the current question*/}
      <QuestionText question={props.question}/>
      {/* Display buttons to answer the question*/}
      <AnswerButtons/>
    </Center>
  );
};

export default Question;
