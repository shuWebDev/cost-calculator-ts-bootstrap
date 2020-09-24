///<reference path="../typings/component.d.ts" />

import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { v4 as uuidv4 } from 'uuid';
import NumericQuestion from './question-types/numericquestion';
import RadioQuestion from './question-types/radioquestion';


class Page extends React.Component<Page.PageProps, Page.PageState> {
  constructor(props:Page.PageProps) {
    super(props);

    this.state = {
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
      questionValues: sID
    });
    
    return;
  }

  saveQuestionResponse = (e: React.FormEvent<HTMLButtonElement>, ssID: string, value: string) => {

    // NOTE: update the corresponding key in the local state for the input value. This both allows the input to be "controlled" by state, and for state to be accurate for when we save all user input from this page of questions.
    this.setState({
      ...this.state,
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
        _components.push(<NumericQuestion questionData={this.props.pageQuestions[i]} saveQuestionHandler={this.saveQuestionResponse} />)
      }
      if(q[i].controlType === "radio") {
        _components.push(<RadioQuestion questionData={this.props.pageQuestions[i]} saveQuestionHandler={this.saveQuestionResponse} />)
      }
    }
    return _components;
  }

  render = () => {
    return (
      <Form>
        <Form.Group controlId={uuidv4()}>
          <Row>
            {this.loadPageQuestions(this.props.pageQuestions)}
          </Row>
        </Form.Group>
      </Form>
    ) 
  }
}

export default Page;