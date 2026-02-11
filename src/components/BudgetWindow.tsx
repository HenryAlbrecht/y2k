import { useState } from 'react';
import { Window } from './Window';
import { useAppStore } from '../store/useAppStore';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other']
};

export const BudgetWindow = () => {
  const { transactions, addTransaction, deleteTransaction } = useAppStore();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleAdd = () => {
    if (!amount || !category || parseFloat(amount) <= 0) {
      alert('Please fill all required fields with valid values!');
      return;
    }

    addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    });

    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().slice(0, 10));
  };

  const filteredTransactions = transactions.filter(
    (t) => t.date.startsWith(filterMonth)
  );

  const totals = filteredTransactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = totals.income - totals.expense;

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Window
      id="budget"
      title="Budget Manager v1.0"
      icon="💰"
      defaultPosition={{ x: 300, y: 100 }}
      defaultSize={{ width: 650, height: 600 }}
    >
      {/* Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '10px', 
        marginBottom: '15px' 
      }}>
        <div style={{ 
          padding: '10px', 
          background: '#e0ffe0', 
          border: '3px solid #00aa00',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#006600' }}>INCOME</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00aa00' }}>
            ${totals.income.toFixed(2)}
          </div>
        </div>
        <div style={{ 
          padding: '10px', 
          background: '#ffe0e0', 
          border: '3px solid #ff0000',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#660000' }}>EXPENSES</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff0000' }}>
            ${totals.expense.toFixed(2)}
          </div>
        </div>
        <div style={{ 
          padding: '10px', 
          background: balance >= 0 ? '#e0f0ff' : '#ffe0e0', 
          border: `3px solid ${balance >= 0 ? '#0078d7' : '#ff0000'}`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#000066' }}>BALANCE</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: balance >= 0 ? '#0078d7' : '#ff0000' }}>
            ${balance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="add-task-form" style={{ background: '#fff4e0', borderColor: '#ffa500' }}>
        <label style={{ fontWeight: 'bold' }}>New Transaction:</label>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="radio"
              value="income"
              checked={type === 'income'}
              onChange={() => {
                setType('income');
                setCategory('');
              }}
            />
            💵 Income
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="radio"
              value="expense"
              checked={type === 'expense'}
              onChange={() => {
                setType('expense');
                setCategory('');
              }}
            />
            💸 Expense
          </label>
        </div>

        <div className="form-row">
          <input
            type="number"
            placeholder="Amount..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            style={{ flex: 1 }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">Select Category...</option>
            {CATEGORIES[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        <input
          type="text"
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="retro-btn primary" onClick={handleAdd}>
          💾 Add Transaction
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ fontWeight: 'bold' }}>Filter by Month:</label>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={{ padding: '5px' }}
        />
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#666' }}>
          {filteredTransactions.length} transactions
        </span>
      </div>

      {/* Transactions List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <ul className="task-list">
          {sortedTransactions.map((transaction) => (
            <li
              key={transaction.id}
              className="task-item"
              style={{
                borderLeft: `5px solid ${transaction.type === 'income' ? '#00aa00' : '#ff0000'}`,
                background: transaction.type === 'income' ? '#f0fff0' : '#fff0f0'
              }}
            >
              <div style={{ 
                fontSize: '24px', 
                marginRight: '10px',
                color: transaction.type === 'income' ? '#00aa00' : '#ff0000'
              }}>
                {transaction.type === 'income' ? '💵' : '💸'}
              </div>
              <div className="task-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span className="task-title">
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <span style={{
                    background: transaction.type === 'income' ? '#00aa00' : '#ff0000',
                    color: 'white',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    border: '1px solid #000'
                  }}>
                    {transaction.category}
                  </span>
                </div>
                <div className="task-meta">
                  📅 {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  {transaction.description && <><br />&gt; {transaction.description}</>}
                </div>
              </div>
              <button
                className="retro-btn"
                style={{ fontSize: '12px', padding: '2px 5px' }}
                onClick={() => {
                  if (confirm('Delete this transaction?')) {
                    deleteTransaction(transaction.id);
                  }
                }}
              >
                DEL
              </button>
            </li>
          ))}
          {sortedTransactions.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '30px', 
              color: '#666',
              fontSize: '14px'
            }}>
              No transactions for this month. Add your first transaction above! 💰
            </div>
          )}
        </ul>
      </div>
    </Window>
  );
};
