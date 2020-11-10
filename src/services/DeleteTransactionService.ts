import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

// import AppError from '../errors/AppError';
interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.find({ id });
    if (!transaction) {
      throw new AppError('Transaction not exists.');
    }
    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
