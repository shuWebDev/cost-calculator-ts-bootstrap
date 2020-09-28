///<reference path="./typings/app.d.ts" />
import React from 'react';
import * as PageData from './questions/question-bank.json';
import * as QuestionLogic from './questions/question-logic.json';
import Page from './pages/page';
import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { prop } from './util/util';
import { CLIENT_RENEG_LIMIT } from 'tls';

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      currentPage: 0,
      pages: PageData.pages,
      questionLogic: QuestionLogic.logic,
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

  pageSubmitHandler = (e:React.MouseEvent<HTMLButtonElement>) => {
    
    let _cp: number = this.state.currentPage + 1;
    this.setState({
      currentPage: _cp
    });

    return;
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

    /* NOTE: determine if this is a situation like SAT/ACT where user 
    * can answer the SAT questions, but then not ACT and vice-versa
    * if so, then if the user enters a value for either SAT input, disable
    * the ACT and vice-versa for the ACT
    */

    // NOTE: if there is a value in the input
    if(parseInt(e.currentTarget.value) > 0) {
      let _l: LogicOrPage = this.state.questionLogic[this.state.currentPage];
      //console.log(_l);
      for(let _q of _l.logicORLeft) {
        if(_q === ssID) {
          /* NOTE: if the current input is one of the left side, disable the right side
          * of the 'or' 
          */
          for(let r of _l.logicORRight) {
            //console.log(r.substring(5,(ssID.length - 5)));
            (document.querySelector<HTMLInputElement>(`#${r.substring(5)}`))!.disabled = true;
          }
        }
      }

      for(let _q of _l.logicORRight) {
        if(_q === ssID) {
          /* NOTE: if the current input is one of the left side, disable the right side
          * of the 'or' 
          */
          for(let r of _l.logicORLeft) {
            //console.log(r);
            (document.querySelector<HTMLInputElement>(`#${r.substring(5)}`))!.disabled = true;
          }
        }
        break;
      }
    } else {
      let _l: LogicOrPage = this.state.questionLogic[this.state.currentPage];
      for(let _ssID of _l.logicORLeft) {
        (document.querySelector<HTMLInputElement>(`#${_ssID.substring(5)}`))!.disabled = false;
      }
      for(let _ssID of _l.logicORRight) {
        (document.querySelector<HTMLInputElement>(`#${_ssID.substring(5)}`))!.disabled = false;
      }
    }
    return; 
  }

  render = () => {
    // NOTE: make sure we're not on the last page
    if(this.state.currentPage < this.state.pages.length) {
      let _ql: LogicOrPage = this.state.questionLogic[this.state.currentPage];
      //console.log(this.state.questionLogic);
      // NOTE: Important to ensure the state keys are there
      // for the controlled inputs
      if(Object.keys(this.state.userInput).length > 0) {
        return (
          <>
            <Container>
              <Row>
                <Col md={12}>
                  <Page 
                    pageQuestions={this.state.pages[this.state.currentPage]} 
                    submitPageHandler={this.pageSubmitHandler}
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
