import React from 'react';
import Form from 'react-bootstrap/Form';
import { Col }  from 'react-bootstrap'; 
import { v4 as uuidv4 } from 'uuid';

class RadioQuestion extends React.Component<QuestionComponentProps, QuestionComponentState> {
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
        <Col md={{span: 2, offset: 1}} key={uuidv4()}>
          <Form.Group controlId={qd.controlId}>
            <Form.Label>{qd.label}</Form.Label>
            {
              qd.options.map((option, index) => {
                return <Form.Check key={`input-${qd.controlId}-${index}`} type="radio" id={option} name={qd.controlId} value={option} label={option} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.handleChange(e)}} checked={this.state.inputValue === option} />
              })
            } 
          </Form.Group>
        </Col>
      );
    } else {
      return <p>Loading...</p>
    }
  }
}

export default RadioQuestion;