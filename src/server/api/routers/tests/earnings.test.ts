import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TRPCError } from '@trpc/server';
import { earningsRouter } from '../earning'; 
import { userStats, wallets, userBalances, withdrawals, onchainEvents, userWithdrawalMethods } from '@/server/db/schema'; // Import your Drizzle schemas
import { type inferProcedureInput } from '@trpc/server';
import { type AppRouter } from '@/server/api/root'; // Assuming you have a root router type


type AppRouterCaller = ReturnType<typeof earningsRouter.createCaller>;

// const insertChainMock = {
//   values: vi.fn().mockReturnThis(),
//   returning: vi.fn(),
// };

const mockDb = {
  query: {
    userStats: {
      findFirst: vi.fn(),
    },
    wallets: {
      findFirst: vi.fn(),
    },
    userBalances: {
      findFirst: vi.fn(),
    },
    withdrawals: {
      findMany: vi.fn(),
    },
    onchainEvents: {
      findMany: vi.fn(),
    },
    userWithdrawalMethods: {
      findMany: vi.fn(),
    },
    
  },
   
  insert: vi.fn(() => {
    const chainable = {
      values: vi.fn().mockReturnThis(), 
      returning: vi.fn(), 
    };
    return chainable;
  }),

//   insert: vi.fn(() => insertChainMock),

};


const mockCtx = {
  db: mockDb,
  user: {
    id: 'test-user-id',
  },
};

const createCaller = (ctx: typeof mockCtx) => earningsRouter.createCaller(ctx as any);

describe('earningsRouter', () => {
  beforeEach(() => {
    
    vi.clearAllMocks();
  });

  describe('getUserEarnings', () => {
    it('should return user earnings if stats are found', async () => {
      mockDb.query.userStats.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        totalEarnings: '1000',
        totalTasksCompleted: 50,
        currentStreak: 5,
        longestStreak: 10,
        totalTimeSpent: 120,
        averageRating: '4.5',
        totalCoursesCompleted: 3,
        lastActivityAt: new Date(),
      });

      const caller = createCaller(mockCtx);
      const result = await caller.getUserEarnings();

      expect(result).toEqual({
        totalEarnings: '1000',
        totalEarningsUsd: 1000,
        totalTasksCompleted: 50,
        currentStreak: 5,
        longestStreak: 10,
        totalTimeSpent: 120,
        averageRating: '4.5',
        totalCoursesCompleted: 3,
        lastActivityAt: expect.any(Date),
      });
      expect(mockDb.query.userStats.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Function),
        }),
      );
    });

    it('should throw NOT_FOUND error if stats are not found', async () => {
      mockDb.query.userStats.findFirst.mockResolvedValueOnce(undefined);

      const caller = createCaller(mockCtx);

      await expect(caller.getUserEarnings()).rejects.toThrow(
        new TRPCError({ code: 'NOT_FOUND', message: 'Stats not found' }),
      );
    });
  });

  describe('getEarningSummary', () => {
    it('should return earning summary if stats are found', async () => {
      mockDb.query.userStats.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        totalEarnings: '500',
        totalTasksCompleted: 25,
        totalTimeSpent: 60,
      });

      const caller = createCaller(mockCtx);
      const result = await caller.getEarningSummary();

      expect(result).toEqual({
        totalEarned: '500',
        fiatValue: '500.00',
        tasksCompleted: 25,
        timeSpent: '60 mins',
      });
    });

    it('should throw NOT_FOUND error if stats are not found', async () => {
      mockDb.query.userStats.findFirst.mockResolvedValueOnce(undefined);

      const caller = createCaller(mockCtx);

      await expect(caller.getEarningSummary()).rejects.toThrow(
        new TRPCError({ code: 'NOT_FOUND' }),
      );
    });
  });

  describe('getTransactionHistory', () => {
    it('should return withdrawals and earnings', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        isActive: 1,
        starknetAddress: '0x123',
      });
      mockDb.query.withdrawals.findMany.mockResolvedValueOnce([
        { id: 1, amount: '10', type: 'WITHDRAWAL' },
      ]);
      mockDb.query.onchainEvents.findMany.mockResolvedValueOnce([
        { id: 2, amount: '20', type: 'EARNING' },
      ]);

      const caller = createCaller(mockCtx);
      const result = await caller.getTransactionHistory({ limit: 10, offset: 0 });

      expect(result.withdrawals).toEqual([{ id: 1, amount: '10', type: 'WITHDRAWAL' }]);
      expect(result.earnings).toEqual([{ id: 2, amount: '20', type: 'EARNING' }]);
      expect(mockDb.query.withdrawals.findMany).toHaveBeenCalled();
      expect(mockDb.query.onchainEvents.findMany).toHaveBeenCalled();
    });

    it('should return only withdrawals when type is WITHDRAWAL', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        isActive: 1,
        starknetAddress: '0x123',
      });
      mockDb.query.withdrawals.findMany.mockResolvedValueOnce([
        { id: 1, amount: '10', type: 'WITHDRAWAL' },
      ]);

      const caller = createCaller(mockCtx);
      const result = await caller.getTransactionHistory({ limit: 10, offset: 0, type: 'WITHDRAWAL' });

      expect(result.withdrawals).toEqual([{ id: 1, amount: '10', type: 'WITHDRAWAL' }]);
      expect(result.earnings).toEqual([]);
      expect(mockDb.query.withdrawals.findMany).toHaveBeenCalled();
      expect(mockDb.query.onchainEvents.findMany).not.toHaveBeenCalled();
    });

    it('should return only earnings when type is EARNING', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        isActive: 1,
        starknetAddress: '0x123',
      });
      mockDb.query.onchainEvents.findMany.mockResolvedValueOnce([
        { id: 2, amount: '20', type: 'EARNING' },
      ]);

      const caller = createCaller(mockCtx);
      const result = await caller.getTransactionHistory({ limit: 10, offset: 0, type: 'EARNING' });

      expect(result.withdrawals).toEqual([]);
      expect(result.earnings).toEqual([{ id: 2, amount: '20', type: 'EARNING' }]);
      expect(mockDb.query.withdrawals.findMany).not.toHaveBeenCalled();
      expect(mockDb.query.onchainEvents.findMany).toHaveBeenCalled();
    });

    it('should throw NOT_FOUND error if no active wallet is found', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce(undefined);

      const caller = createCaller(mockCtx);

      await expect(caller.getTransactionHistory({ limit: 10, offset: 0 })).rejects.toThrow(
        new TRPCError({ code: 'NOT_FOUND', message: 'No active wallet found' }),
      );
    });

    it('should throw BAD_REQUEST for invalid limit (less than 1)', async () => {
      const caller = createCaller(mockCtx);
      const input: inferProcedureInput<AppRouter['earnings']['getTransactionHistory']> = { limit: 0, offset: 0 };
      await expect(caller.getTransactionHistory(input)).rejects.toThrow(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          message: expect.stringContaining('Number must be greater than or equal to 1'),
        }),
      );
    });

    it('should throw BAD_REQUEST for invalid limit (greater than 100)', async () => {
      const caller = createCaller(mockCtx);
      const input: inferProcedureInput<AppRouter['earnings']['getTransactionHistory']> = { limit: 101, offset: 0 };
      await expect(caller.getTransactionHistory(input)).rejects.toThrow(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          message: expect.stringContaining('Number must be less than or equal to 100'),
        }),
      );
    });

    it('should throw BAD_REQUEST for invalid offset (less than 0)', async () => {
      const caller = createCaller(mockCtx);
      const input: inferProcedureInput<AppRouter['earnings']['getTransactionHistory']> = { limit: 10, offset: -1 };
      await expect(caller.getTransactionHistory(input)).rejects.toThrow(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          message: expect.stringContaining('Number must be greater than or equal to 0'),
        }),
      );
    });

    
    it('should query wallets and withdrawals/earnings based on user ID', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        isActive: 1,
        starknetAddress: '0x123',
      });
      mockDb.query.withdrawals.findMany.mockResolvedValueOnce([]);
      mockDb.query.onchainEvents.findMany.mockResolvedValueOnce([]);

      const caller = createCaller(mockCtx);
      await caller.getTransactionHistory({ limit: 10, offset: 0 });

      expect(mockDb.query.wallets.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Function), 
        }),
      );
      
    });
  });

  describe('getWithdrawalOptions', () => {
    it('should return user withdrawal methods', async () => {
      mockDb.query.userWithdrawalMethods.findMany.mockResolvedValueOnce([
        { id: 1, userId: 'test-user-id', methodType: 'CRYPTO', details: {} },
      ]);

      const caller = createCaller(mockCtx);
      const result = await caller.getWithdrawalOptions();

      expect(result).toEqual([{ id: 1, userId: 'test-user-id', methodType: 'CRYPTO', details: {} }]);
      expect(mockDb.query.userWithdrawalMethods.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Function),
        }),
      );
    });
  });

  describe('createCryptoWithdrawal', () => {
    const input = {
      amount: '100.00',
      tokenAddress: '0xabc',
      destinationAddress: '0xdef',
      currency: 'ETH' as const,
    };

    it('should create a crypto withdrawal successfully', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        isActive: 1,
        starknetAddress: '0x123',
      });
      mockDb.query.userBalances.findFirst.mockResolvedValueOnce({
        userAddress: '0x123',
        balance: '2.00000000000000000', 
      });
      
      mockDb.insert().returning.mockResolvedValueOnce([{ id: 1, ...input, status: 'PENDING' }]);

      const caller = createCaller(mockCtx);
      const result = await caller.createCryptoWithdrawal(input);

      expect(result).toEqual({ success: true });
      expect(mockDb.insert).toHaveBeenCalledWith(withdrawals);
      expect(mockDb.insert().values).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'test-user-id',
          method: 'CRYPTO_WALLET',
          amount: input.amount,
          tokenAddress: input.tokenAddress,
          destinationAddress: input.destinationAddress,
          status: 'PENDING',
        }),
      );
    });

    it('should throw NOT_FOUND error if no active wallet is found', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce(undefined);

      const caller = createCaller(mockCtx);

      await expect(caller.createCryptoWithdrawal(input)).rejects.toThrow(
        new TRPCError({ code: 'NOT_FOUND', message: 'No active wallet found' }),
      );
    });

    it('should throw NOT_FOUND error if user balance is not found', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        isActive: 1,
        starknetAddress: '0x123',
      });
      mockDb.query.userBalances.findFirst.mockResolvedValueOnce(undefined);

      const caller = createCaller(mockCtx);

      await expect(caller.createCryptoWithdrawal(input)).rejects.toThrow(
        new TRPCError({ code: 'NOT_FOUND', message: 'User balance not found' }),
      );
    });

    it('should throw BAD_REQUEST error for insufficient balance', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        isActive: 1,
        starknetAddress: '0x123',
      });
      mockDb.query.userBalances.findFirst.mockResolvedValueOnce({
        userAddress: '0x123',
        balance: '50000000000000000', 
      });

      const caller = createCaller(mockCtx);

      await expect(caller.createCryptoWithdrawal(input)).rejects.toThrow(
        new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient balance' }),
      );
    });

    it('should throw INTERNAL_SERVER_ERROR for other failures', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        isActive: 1,
        starknetAddress: '0x123',
      });
      mockDb.query.userBalances.findFirst.mockResolvedValueOnce({
        userAddress: '0x123',
        balance: '200000000000000000', 
      });
      
      mockDb.insert.mockImplementation(() => {
        const chainable = {
          values: vi.fn().mockReturnThis(),
          returning: vi.fn(() => { throw new Error('Database error'); }), // Throw error from returning
        };
        return chainable;
      });

      const caller = createCaller(mockCtx);

      await expect(caller.createCryptoWithdrawal(input)).rejects.toThrow(
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create crypto withdrawal' }),
      );
    });

    it('should throw BAD_REQUEST for invalid amount format (too many decimals)', async () => {
      const caller = createCaller(mockCtx);
      const input: inferProcedureInput<AppRouter['earnings']['createCryptoWithdrawal']> = {
        amount: '100.1234567890123456789', 
        tokenAddress: '0xabc',
        destinationAddress: '0xdef',
        currency: 'ETH',
      };
      await expect(caller.createCryptoWithdrawal(input)).rejects.toThrow(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          message: expect.stringContaining('String must match regex'),
        }),
      );
    });

    it('should throw BAD_REQUEST for invalid amount format (not a number)', async () => {
      const caller = createCaller(mockCtx);
      const input: inferProcedureInput<AppRouter['earnings']['createCryptoWithdrawal']> = {
        amount: 'abc',
        tokenAddress: '0xabc',
        destinationAddress: '0xdef',
        currency: 'ETH',
      };
      await expect(caller.createCryptoWithdrawal(input)).rejects.toThrow(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          message: expect.stringContaining('String must match regex'),
        }),
      );
    });

    it('should throw BAD_REQUEST for missing tokenAddress', async () => {
      const caller = createCaller(mockCtx);
      const input = {
        amount: '100.00',
        destinationAddress: '0xdef',
        currency: 'ETH',
      } as any; 
      await expect(caller.createCryptoWithdrawal(input)).rejects.toThrow(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          message: expect.stringContaining('Required'),
        }),
      );
    });

    it('should throw BAD_REQUEST for invalid currency', async () => {
      const caller = createCaller(mockCtx);
      const input: inferProcedureInput<AppRouter['earnings']['createCryptoWithdrawal']> = {
        amount: '100.00',
        tokenAddress: '0xabc',
        destinationAddress: '0xdef',
        currency: 'INVALID' as any,
      };
      await expect(caller.createCryptoWithdrawal(input)).rejects.toThrow(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          message: expect.stringContaining('Invalid enum value'),
        }),
      );
    });

    it('should query wallets and insert withdrawals based on user ID', async () => {
      mockDb.query.wallets.findFirst.mockResolvedValueOnce({
        userId: 'test-user-id',
        isActive: 1,
        starknetAddress: '0x123',
      });
      mockDb.query.userBalances.findFirst.mockResolvedValueOnce({
        userAddress: '0x123',
        balance: '200000000000000000',
      });
      mockDb.insert().returning.mockResolvedValueOnce([{ id: 1, ...input, status: 'PENDING' }]);

      const caller = createCaller(mockCtx);
      await caller.createCryptoWithdrawal(input);

      expect(mockDb.query.wallets.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Function), 
        }),
      );
      expect(mockDb.insert().values).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'test-user-id', 
        }),
      );
    });
  });

  describe('createBankWithdrawal', () => {
    const input = {
      amount: '500.00',
      bankAccountDetails: {
        accountNumber: '123456789',
        routingNumber: '987654321',
        accountHolderName: 'John Doe',
      },
    };

    it('should create a bank withdrawal successfully', async () => {
      mockDb.insert().returning.mockResolvedValueOnce([{ id: 1, ...input, status: 'PENDING' }]);

      const caller = createCaller(mockCtx);
      const result = await caller.createBankWithdrawal(input);

      expect(result).toEqual({ success: true });
      expect(mockDb.insert).toHaveBeenCalledWith(withdrawals);
      expect(mockDb.insert().values).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'test-user-id',
          method: 'BANK_ACCOUNT',
          amount: input.amount,
          tokenAddress: 'N/A',
          bankAccountDetails: JSON.stringify(input.bankAccountDetails),
          status: 'PENDING',
        }),
      );
    });

    it('should throw INTERNAL_SERVER_ERROR for other failures', async () => {
    
      mockDb.insert.mockImplementation(() => {
        const chainable = {
          values: vi.fn().mockReturnThis(),
          returning: vi.fn(() => { throw new Error('Database error'); }), 
        };
        return chainable;
      });

      const caller = createCaller(mockCtx);

      await expect(caller.createBankWithdrawal(input)).rejects.toThrow(
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create bank withdrawal' }),
      );
    });

    it('should throw BAD_REQUEST for invalid amount format (too many decimals)', async () => {
      const caller = createCaller(mockCtx);
      const input: inferProcedureInput<AppRouter['earnings']['createBankWithdrawal']> = {
        amount: '100.123', // 3 decimals, max 2
        bankAccountDetails: {
          accountNumber: '123',
          routingNumber: '456',
          accountHolderName: 'Test',
        },
      };
      await expect(caller.createBankWithdrawal(input)).rejects.toThrow(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          message: expect.stringContaining('String must match regex'),
        }),
      );
    });

    it('should throw BAD_REQUEST for missing bankAccountDetails', async () => {
      const caller = createCaller(mockCtx);
      const input = {
        amount: '100.00',
    
      } as any;
      await expect(caller.createBankWithdrawal(input)).rejects.toThrow(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          message: expect.stringContaining('Required'),
        }),
      );
    });

    it('should throw BAD_REQUEST for missing accountNumber in bankAccountDetails', async () => {
      const caller = createCaller(mockCtx);
      const input: inferProcedureInput<AppRouter['earnings']['createBankWithdrawal']> = {
        amount: '100.00',
        bankAccountDetails: {
          
          routingNumber: '456',
          accountHolderName: 'Test',
        } as any,
      };
      await expect(caller.createBankWithdrawal(input)).rejects.toThrow(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          message: expect.stringContaining('Required'),
        }),
      );
    });

    
    it('should insert withdrawals based on user ID', async () => {
      mockDb.insert().returning.mockResolvedValueOnce([{ id: 1, ...input, status: 'PENDING' }]);

      const caller = createCaller(mockCtx);
      await caller.createBankWithdrawal(input);

      expect(mockDb.insert().values).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'test-user-id', 
        }),
      );
    });
  });
});
