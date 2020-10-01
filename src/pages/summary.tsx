///<reference path="../typings/component.d.ts" />

import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export const Summary: React.FC<SummaryProps> = (props) => {
  return (
    <Container>
      <Row>
        <Col md={12}>
          <p>Summary</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Summary;