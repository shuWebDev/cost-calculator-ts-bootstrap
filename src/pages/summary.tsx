///<reference path="../typings/component.d.ts" />

import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { generateReport } from '../calculation/calculation';

export const Summary: React.FC<SummaryProps> = (props) => {
  let results: Report = generateReport(props.calculationData);

  return (
    <Container>
      <Row>
        <Col md={12}>
          <p>Summary</p>
          <p>Dependency: {results.dependency}</p>
          <p>EFC: {results.EFC}</p>
          <p>Pell: {results.Pell}</p>
          <p>TAG: {results.TAG}</p>
          <p>Merit: {results.Merit}</p>
          <p>Needs: {results.Needs}</p>
          <p>
            <strong>
              Total: {results.TAG + results.Pell + results.Merit + results.Needs}
            </strong>
          </p>
          <hr />
          {console.log(results.POA)}
        </Col> 
      </Row>
    </Container>
  );
}

export default Summary;