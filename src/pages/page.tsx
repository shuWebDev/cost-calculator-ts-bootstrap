///<reference path="../typings/component.d.ts" />

import React from 'react';
import Form from 'react-bootstrap/Form';
import { Row }  from 'react-bootstrap';
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
    for(let q=0; q<this.props.pageQuestions.length; q++) {
      let temp: LooseObject = {};
      // NOTE: this structure will hold the corresponding value of the input
      temp[`${this.props.pageQuestions[q].stateStorageID}`] = {};
      // NOTE: set the default for this input
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

  /*handleChange = (e: React.ChangeEvent<HTMLInputElement>, ssID: string) => {
    e.preventDefault();
    console.log(ssID);
    let targetValue = e.currentTarget.value;

    this.setState({
      ...this.state,
      questionValues: {
        [`${ssID}`]: {
          value: targetValue
        }
      }
    })

    return;
  }*/

  loadPageQuestions = (q: PageQuestion[]) => {
    let _components: JSX.Element[] = [];
    
    for(let i in q) {
      if(q[i].controlType === "number") {
        _components.push(<NumericQuestion questionData={this.props.pageQuestions[i]} />)
      }
      if(q[i].controlType === "radio") {
        _components.push(<RadioQuestion questionData={this.props.pageQuestions[i]} />)
      }
    }
    return _components;
  }

  render = () => {
    if(Object.keys(this.state.questionValues).length === this.props.pageQuestions.length) {
      return (
        <Form>
          <Form.Group controlId={uuidv4()}>
            <Row>
              {this.loadPageQuestions(this.props.pageQuestions)}
            </Row>
          </Form.Group>
        </Form>
      )
    } else {
      return <p>Loading...</p>;
    }
  }
}

export default Page;