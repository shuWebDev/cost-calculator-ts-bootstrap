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

  componentDidMount = () => {
    let _ssidKeys: LooseObject = {};
    for(let p of this.state.pages) {
      for(let q in p) {
        _ssidKeys = {
          ..._ssidKeys,
          [`${p[q].stateStorageID}`]: prop(p[q], "default")
        }
      }
    }

    this.setState({
      ...this.state,
      userInput: _ssidKeys
    });
  }

  pageSubmitHandler = (e:React.FormEvent) => {
    e.preventDefault();
    console.log(e);
  }

  inputChangeHandler = (e:React.ChangeEvent<HTMLInputElement>, ssID: string) => {
    console.log(`${ssID} :: ${e.currentTarget.value}`);
    
    // NOTE: given the id, update the input value in state
    this.setState({
      userInput: {
        ...this.state.userInput,
        [`${ssID}`]: e.currentTarget.value
      }
    });

    return; 
  }

  render = () => {
    // NOTE: make sure we're not on the last page
    if(this.state.currentPage < this.state.pages.length) {
      // NOTE: Important to ensure the state keys are there
      // for the controlled inputs
      if(Object.keys(this.state.userInput).length > 0) {
        return (
          <>
            <Container fluid>
              <Row>
                <Col md={{span: 10, offset: 1}}>
                  <Page 
                    pageQuestions={this.state.pages[this.state.currentPage]} 
                    stateInputValues={this.state.userInput} 
                    inputChangeHandler={this.inputChangeHandler}  
                  />
                </Col>
              </Row>
            </Container>
          </>
        );
      } else {
        return <p>Loading...</p>;
      }
    } else {
      return <p>Thank you.</p>;
    }
  }
}

export default App;
