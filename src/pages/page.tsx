///<reference path="../typings/component.d.ts" />

import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { v4 as uuidv4 } from 'uuid';
import NumericQuestion from './question-types/numericquestion';
import RadioQuestion from './question-types/radioquestion';


class Page extends React.Component<Page.PageProps, Page.PageState> {
  constructor(props:Page.PageProps) {
    super(props);

    this.state = {
      pageQuestions: [],
      questionValues: {}
    };
  }

  componentDidMount = () => {
    let sID: LooseObject = {};
    for(let q in this.props.pageQuestions) {
      let temp: LooseObject = {};
      temp[`${this.props.pageQuestions[q].stateStorageID}`] = {};
      temp[`${this.props.pageQuestions[q].stateStorageID}`]['value'] = this.props.pageQuestions[q].default;

      sID = {
        ...sID,
        ...temp
      }; 
    }

    this.setState({
      pageQuestions: this.props.pageQuestions,
      questionValues: sID
    });
    
    return;
  }

  saveQuestionResponse = (e: React.FormEvent<HTMLButtonElement>, ssID: string, value: string, questionArrayPosition: number) => {

    // NOTE: update the corresponding key in the local state for the input value. This both allows the input to be "controlled" by state, and for state to be accurate for when we save all user input from this page of questions.
    let _pq: PageQuestion[] = this.state.pageQuestions;
    _pq[questionArrayPosition].default = value;

    this.setState({
      ...this.state,
      pageQuestions: _pq,
      questionValues: {
        ...this.state.questionValues,
        [`${ssID}`]: {
          value: value
        }
      }
    });

    return;
  }


  loadPageQuestions = (q: PageQuestion[]) => {
    let _components: JSX.Element[] = [];
    
    for(let i in q) {
      if(q[i].controlType === "number") {
        _components.push(<NumericQuestion key={uuidv4()} questionData={this.props.pageQuestions[i]} saveQuestionHandler={this.saveQuestionResponse} pageQuestionArrayPosition={parseInt(i)} />)
      }
      if(q[i].controlType === "radio") {
        _components.push(<RadioQuestion key={uuidv4()} questionData={this.props.pageQuestions[i]} saveQuestionHandler={this.saveQuestionResponse} pageQuestionArrayPosition={parseInt(i)} />)
      }
    }
    return _components;
  }

  render = () => {
    return (
      <Form onSubmit={this.props.submitPageHandler} >
        <Form.Group controlId={uuidv4()}>
          <Row>
            {this.loadPageQuestions(this.state.pageQuestions)}
          </Row>
          <hr />
          <Row>
            <Col md={{ span: 2, offset: 4 }}>
              <Button variant="outline-success" onClick={(e) => {e.preventDefault(); this.props.submitPageHandler(this.state.questionValues)}}>Submit Page</Button>
            </Col>
          </Row>
        </Form.Group>
      </Form>
    ) 
  }
}

export default Page;