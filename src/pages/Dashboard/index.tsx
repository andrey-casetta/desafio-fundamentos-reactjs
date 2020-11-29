import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';
import Venda from '../../assets/Venda.svg';
import Casa from '../../assets/Casa.svg';
import Alimentacao from '../../assets/Alimentacao.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';
import { ImportFileContainer, Title } from '../Import/styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function convertValue(value: string) {
    if (value === undefined) {
      return `R$ 00,00`;
    }

    const toNumber = parseFloat(value);
    const thousand = toNumber / 1000;
    const sThousand = thousand.toString().split('.')[0];
    let cent = (toNumber % 1000).toString();

    if (cent == '0') {
      cent = '000';
    }
    if (thousand < 1) {
      return `R$ ${cent},00`;
    }

    return `R$ ${sThousand}.${cent},00`;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function convertData(value: Date) {
    const convertedData = value.toString();
    const day = convertedData.substring(8, 10);
    const month = convertedData.substring(5, 7);
    const year = convertedData.substring(0, 4);
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      api.get('/transactions').then(response => {
        setTransactions(response.data.transactions);
        setBalance(response.data.balance);
      });
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{convertValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {convertValue(balance.outcome)}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{convertValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        {transactions.length > 0 ? (
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.type === 'outcome' ? `- ` : ''}
                      {convertValue(transaction.value.toString())}
                    </td>
                    <td>
                      {' '}
                      <img
                        src={
                          // eslint-disable-next-line no-nested-ternary
                          transaction.category.title === 'Venda'
                            ? Venda
                            : transaction.category.title === 'Casa'
                            ? Casa
                            : Alimentacao
                        }
                        alt="typeIcon"
                      />
                      {transaction.category.title}
                    </td>
                    <td>{convertData(transaction.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        ) : (
          <Container>
            <ImportFileContainer>
              <Title>Nenhum registro de transações encontrado!</Title>
            </ImportFileContainer>
          </Container>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
