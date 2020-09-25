///<reference path="./typings/app.d.ts" />
import React from 'react';
import * as PageData from './questions/question-bank.json';
import Page from './pages/page';
import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { prop } from './util/util';

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      currentPage: 0,
      pages: PageData.pages,
      userInput: {} 
    } 
  }

  submitPageHandler = (pageQuestionResponses: PQR) => {
    //console.log("Submit Page");
    let responseValues: PQR = {};

    for(let key in pageQuestionResponses) {
      let v: string = "";
      v = prop(pageQuestionResponses, key)['value'];

      responseValues[key] = v;
    }

    let _cp: number = this.state.currentPage + 1;

    this.setState({
      currentPage: _cp,
      userInput: {
        ...this.state.userInput,
        responseValues
      }
    })
  }

  render = () => {
    return (
      <>
        <Container fluid>
          <Row>
            <Col md={{span: 10, offset: 1}}>
              <Page submitPageHandler={this.submitPageHandler} pageQuestions={this.state.pages[this.state.currentPage]} />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default App;
