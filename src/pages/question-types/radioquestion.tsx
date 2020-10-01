import React from 'react';
import Form from 'react-bootstrap/Form';
import { Col }  from 'react-bootstrap'; 

export const RadioQuestion: React.FC<QuestionComponentProps>  = (props) => {
  let qd: PageQuestion = props.questionData;
  return (
    <Col md={{span: 2, offset: 1}}>
      <Form.Group controlId={qd.controlId}>
        <Form.Label>{qd.label}</Form.Label>
        <hr />
        {
          qd.options.map((option, index) => {
            return <Form.Check key={`input-${qd.controlId}-${index}`} type="radio" id={option} name={qd.controlId} value={option} label={option} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {props.changeHandler(e, qd.stateStorageID)}} checked={props.currentValue === option} />
          })
        }
        <hr />
        <Form.Text>{qd.text}</Form.Text>
      </Form.Group>
    </Col>
  );
}

export default RadioQuestion;