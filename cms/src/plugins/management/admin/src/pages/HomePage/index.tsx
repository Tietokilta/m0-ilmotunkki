/*
 *
 * HomePage
 *
 */

import React from 'react';
import { Button } from '@strapi/design-system/Button';
import styled from 'styled-components';
import { request } from '@strapi/helper-plugin';


const Container = styled.div`
  color: ${props => props.theme.colors.neutral1000};
  padding: 32px;
`;

const Title = styled.h1`
  padding: 24px 0;
`;

const HomePage: React.FunctionComponent = () => {
  const exportData = async () => {
    const data = await request('/management/signups', {
      method: 'GET',
    });
    const url = window.URL.createObjectURL(new Blob([data.result]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'signups.csv');
      document.body.appendChild(link);
      link.click();
  }
  return (
    <Container>
      <Title>Export signups</Title>
      <Button onClick={exportData}>Export</Button>
    </Container>
  );
};

export default HomePage;
