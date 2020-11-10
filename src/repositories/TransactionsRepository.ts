import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balanceInitial: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };
    const transactions = await this.find();
    const balance = transactions.reduce<Balance>(
      (currentBalance, { type, value }) => {
        const newBalance = {
          ...currentBalance,
          [type]: currentBalance[type] + value,
        };
        return newBalance;
      },
      balanceInitial,
    );
    balance.total = balance.income - balance.outcome;
    return balance;
  }
}

export default TransactionsRepository;
