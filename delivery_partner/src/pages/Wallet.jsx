import { useState } from 'react';
import {
  IndianRupee, TrendingUp, Clock, ArrowDownLeft, ArrowUpRight,
  Wallet as WalletIcon, ChevronRight, Banknote, Award, Package, Zap,
  CreditCard, Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Wallet() {
  const { wallet, withdrawFunds } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('upi');

  const tabs = ['All', 'Credits', 'Debits'];

  const filtered = activeTab === 0
    ? wallet.transactions
    : activeTab === 1
      ? wallet.transactions.filter(t => t.type === 'credit')
      : wallet.transactions.filter(t => t.type === 'debit');

  const iconMap = {
    package: Package,
    zap: Zap,
    banknote: Banknote,
    award: Award,
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount > wallet.withdrawableBalance) {
      alert('Insufficient balance');
      return;
    }

    withdrawFunds(amount);
    alert(`₹${amount} withdrawal request submitted successfully!`);
    setShowWithdraw(false);
    setWithdrawAmount('');
  };

  return (
    <div className="page-container">
      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(165deg, #FF9933 0%, #E8872B 100%)',
        margin: 0, padding: '24px 20px 32px',
        borderRadius: '0 0 28px 28px',
        color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -80, right: -60 }} />
        <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: -50, left: -30 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <WalletIcon size={22} />
            <span style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>My Wallet</span>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 'var(--font-xs)', opacity: 0.8, marginBottom: 4 }}>Total Earnings</div>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px' }}>₹{wallet.totalEarnings.toLocaleString()}</div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
            gap: 8 
          }}>
            {[
              { label: 'Pending', value: `₹${wallet.pendingEarnings.toLocaleString()}`, icon: Clock },
              { label: 'Today', value: `₹${wallet.todayEarnings.toLocaleString()}`, icon: TrendingUp },
              { label: 'This Week', value: `₹${wallet.weekEarnings.toLocaleString()}`, icon: IndianRupee },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 8px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
              }}>
                <s.icon size={16} style={{ margin: '0 auto 4px', opacity: 0.8 }} />
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Bonus Progress Card */}
        <div className="card" style={{ padding: 16, marginBottom: 16, background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', border: '1px solid #FDE68A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={18} color="#D97706" />
              <span style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: '#92400E' }}>Level Up Bonus</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#D97706', padding: '2px 8px', background: 'white', borderRadius: 'var(--radius-full)' }}>
              GOLD TIER
            </span>
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: '#92400E', marginBottom: 8 }}>
            Deliver 12 more orders this week to unlock <strong>₹500 Weekly Bonus</strong>!
          </div>
          <div className="progress-bar" style={{ height: 8, background: 'rgba(217, 119, 6, 0.1)' }}>
            <div className="progress-fill" style={{ width: '75%', background: 'linear-gradient(90deg, #F59E0B, #D97706)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, fontWeight: 600, color: '#D97706' }}>
            <span>38/50 Orders</span>
            <span>₹1500 Earned</span>
          </div>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={() => setShowWithdraw(true)}
          className="btn btn-primary btn-block btn-lg"
          style={{ marginBottom: 16 }}
        >
          <Banknote size={20} />
          Withdraw ₹{wallet.withdrawableBalance.toLocaleString()}
        </button>

        {/* Earning Breakdown */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, marginBottom: 12 }}>Earning Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Per KM Charge', value: '₹8/km', color: 'var(--green)' },
              { label: 'Weight Charge', value: '₹3/kg', color: 'var(--blue)' },
              { label: 'Incentive Bonus', value: '₹500', color: 'var(--saffron)' },
              { label: 'Peak Hour Bonus', value: '₹150', color: 'var(--purple)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Transactions</span>
        </div>
        <div className="tabs" style={{ marginBottom: 12 }}>
          {tabs.map((t, i) => (
            <button key={t} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{t}</button>
          ))}
        </div>

        {/* Transaction List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map((tx, idx) => {
            const Icon = iconMap[tx.icon] || Package;
            return (
              <div key={tx.id} className="animate-fadeInUp" style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 4px',
                borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                animationDelay: `${idx * 0.04}s`, animationFillMode: 'both',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  background: tx.type === 'credit' ? 'var(--green-light)' : 'var(--red-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: tx.type === 'credit' ? 'var(--green)' : 'var(--red)',
                }}>
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{tx.description}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{tx.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontWeight: 700, fontSize: 'var(--font-base)',
                    color: tx.type === 'credit' ? 'var(--green)' : 'var(--red)',
                  }}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="overlay" onClick={() => setShowWithdraw(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, marginBottom: 4 }}>Withdraw Funds</h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>
              Available: ₹{wallet.withdrawableBalance.toLocaleString()}
            </p>

            <div className="input-group" style={{ marginBottom: 16 }}>
              <label className="input-label">Amount</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-tertiary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <span style={{ padding: '12px 14px', fontWeight: 700, fontSize: 'var(--font-xl)', color: 'var(--text-muted)' }}>₹</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  style={{ flex: 1, padding: '14px 16px', background: 'transparent', fontSize: 'var(--font-xl)', fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="input-label" style={{ marginBottom: 10, display: 'block' }}>Withdrawal Method</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { id: 'upi', label: 'UPI', icon: CreditCard },
                  { id: 'bank', label: 'Bank Transfer', icon: Building2 },
                ].map(m => (
                  <button key={m.id} onClick={() => setWithdrawMethod(m.id)} style={{
                    flex: 1, padding: '14px 12px', borderRadius: 'var(--radius-md)',
                    border: withdrawMethod === m.id ? '2px solid var(--green)' : '2px solid var(--border-light)',
                    background: withdrawMethod === m.id ? 'var(--green-light)' : 'var(--white)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600,
                  }}>
                    <m.icon size={18} color={withdrawMethod === m.id ? 'var(--green)' : 'var(--text-muted)'} />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: 12, background: 'var(--saffron-light)', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 'var(--font-xs)', color: 'var(--saffron-dark)' }}>
              ⏰ Settlement: Instant for UPI, 24hr hold for Bank Transfer
            </div>

            <button onClick={handleWithdraw} className="btn btn-primary btn-lg btn-block">
              Withdraw Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
