import React from 'react';
import Form from 'react-bootstrap/Form';
import { Col }  from 'react-bootstrap'; 
import { v4 as uuidv4 } from 'uuid';

export const NumericQuestion: React.FC<QuestionComponentProps>  = (props) => {
  let qd: PageQuestion = props.questionData;
  return (
    <Col md={{ span:1, offset: 1}} key={uuidv4()}>
      <Form.Group controlId={qd.controlId}>
        <Form.Label>{qd.label}</Form.Label>
        <hr /> 
        <Form.Text>{qd.text}</Form.Text>
        <br />
        <Form.Control key={`input-${qd.controlId}`} size="lg" type="number" 
          min={(typeof qd.min !== "undefined")? qd.min : "0"} 
          max={(typeof qd.max !== "undefined")? qd.max : ""} 
          step={(typeof qd.step !== "undefined")? qd.step : "1"} 
          value={props.currentValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {props.changeHandler(e, qd.stateStorageID)}}
        />
        
      </Form.Group>
    </Col>
  );
}

export default NumericQuestion;