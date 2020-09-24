///<reference path="./typings/app.d.ts" />
import React from 'react';
import * as PageData from './questions/question-bank.json';
import Page from './pages/page';
import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      currentPage: 0,
      pages: PageData.pages
    }
  }

  render = () => {
    return (
      <>
        <Container fluid>
          <Row>
            <Col md={{span: 12, offset: 2}}>
              <Page pageQuestions={this.state.pages} />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default App;
