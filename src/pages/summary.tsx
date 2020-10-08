///<reference path="../typings/component.d.ts" />

import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { generateReport } from '../calculation/calculation';

export const Summary: React.FC<SummaryProps> = (props) => {
  let results: Report = generateReport(props.calculationData);

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1>Summary</h1>
          <Table bordered>
          <thead>
            <tr>
              <th>Dependency</th>
              <th>EFC</th>
              <th>Pell Grant</th>
              <th>Tuition Assistance</th>
              <th>Merit Award</th>
              <th>Needs-Based Grant</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{results.dependency}</td>
              <td>{results.EFC}</td>
              <td>{results.Pell}</td>
              <td>{results.TAG}</td>
              <td>{results.Merit}</td>
              <td>{results.Needs}</td>
            </tr>
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total Estimated Aid: {results.TAG + results.Pell + results.Merit + results.Needs}</strong></td>
              </tr>
            </tfoot>
          </Table>
          
     
          {console.log(results.POA)}
        </Col> 
      </Row>
    </Container>
  );
}

export default Summary;