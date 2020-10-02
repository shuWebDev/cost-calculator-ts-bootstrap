///<reference path="../typings/component.d.ts" />

import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { generateReport } from '../calculation/calculation';

export const Summary: React.FC<SummaryProps> = (props) => {
  let results = generateReport(props.calculationData);


  return (
    <Container>
      <Row>
        <Col md={12}>
          <p>Summary</p>
          <p>EFC: {results} </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Summary;