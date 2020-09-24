import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Col }  from 'react-bootstrap'; 
import { v4 as uuidv4 } from 'uuid';

class NumericQuestion extends React.Component<QuestionComponentProps, QuestionComponentState> {
  constructor(props: QuestionComponentProps) {
    super(props);

    this.state = {}
  }

  componentDidMount = () => {
    this.setState({
      inputValue: this.props.questionData.default
    });
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      inputValue: e.currentTarget.value
    });
    return true;
  }

  render = () => {
    if(typeof this.state.inputValue !== 'undefined') {
      let qd: PageQuestion = this.props.questionData;
      return (
        <Col md={{ span:1, offset: 1}} key={uuidv4()}>
          <Form.Group controlId={qd.controlId}>
            <Form.Label>{qd.label}</Form.Label>
            <Form.Control key={`input-${qd.controlId}`} size="lg" type="number" 
              min={(typeof qd.min !== "undefined")? qd.min : "0"} 
              max={(typeof qd.max !== "undefined")? qd.max : ""} 
              step={(typeof qd.step !== "undefined")? qd.step : "1"} 
              value={this.state.inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.handleChange(e)}}
            />
            <Form.Text>{qd.text}</Form.Text>
            <Button size="sm" variant="outline-primary" onClick={(e) => {this.props.saveQuestionHandler(e, qd.stateStorageID, this.state.inputValue)}}>Save</Button>
          </Form.Group>
        </Col>
      );
    } else {
      return <p>Loading...</p>;
    }
  }
}

export default NumericQuestion;