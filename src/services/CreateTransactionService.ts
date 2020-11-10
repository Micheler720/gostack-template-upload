import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  value: number;
  title: string;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    category,
    type,
    title,
    value,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid type.');
    }
    let categoryNew = await categoriesRepository.findOne({
      where: { title: category },
    });
    const balance = await transactionsRepository.getBalance();
    if (balance.total < value && type === 'outcome') {
      throw new AppError('This saldo insunficiente.');
    }
    if (!categoryNew) {
      categoryNew = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(categoryNew);
    }
    const transaction = transactionsRepository.create({
      category: categoryNew,
      title,
      type,
      value,
    });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
