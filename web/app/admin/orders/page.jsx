import { orders } from '../../../data/orders';

export const metadata = { title: '訂單／交易 - 神話韓語後台' };

export default function AdminOrdersPage() {
  const statusLabel = { paid: '已付款', pending: '待付款', failed: '失敗', refunded: '已退款' };

  return (
    <>
      <h1 className="admin-page-title">訂單／交易紀錄</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>單次購課訂單與付款狀態。</p>
      <div className="admin-card">
        {orders.length ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>會員 ID</th>
              <th>課程 ID</th>
              <th>金額</th>
              <th>狀態</th>
              <th>下單時間</th>
              <th>付款時間</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.userId}</td>
                <td>{o.courseId}</td>
                <td>NT$ {o.amount}</td>
                <td><span className={`admin-badge admin-badge--${o.status === 'paid' ? 'on' : o.status === 'pending' ? 'pending' : 'off'}`}>{statusLabel[o.status] || o.status}</span></td>
                <td>{o.createdAt ? new Date(o.createdAt).toLocaleString('zh-TW') : '-'}</td>
                <td>{o.paidAt ? new Date(o.paidAt).toLocaleString('zh-TW') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : <p>尚無購課訂單。</p>}
      </div>
    </>
  );
}
