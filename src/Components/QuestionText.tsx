import React from 'react';
import {Text} from '@chakra-ui/react';

type QuestionText = {
  question: String,
}

// Returns the Text of the Current Question
const QuestionText = (props: QuestionText) => {
  return (
    <Text mb={10} fontSize="2xl">{props.question}</Text>
  );
};

export default QuestionText;
