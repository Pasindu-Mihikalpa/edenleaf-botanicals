import React, { useState } from 'react';
import { MessageSquare, Mail, Trash2, CheckCircle2, Clock, Truck, Check, XCircle, Search, Filter } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { OrderRecord, OrderStatus } from '../../types';

export const AdminOrdersTable: React.FC = () => {
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  const deleteOrder = useStore((state) => state.deleteOrder);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      search.trim() === '' ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-950/80 text-amber-300 border-amber-600/50';
      case 'Confirmed':
        return 'bg-blue-950/80 text-blue-300 border-blue-600/50';
      case 'Dispatched':
        return 'bg-purple-950/80 text-purple-300 border-purple-600/50';
      case 'Delivered':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50';
      case 'Cancelled':
        return 'bg-rose-950/80 text-rose-300 border-rose-600/50';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-600';
    }
  };

  const handleWhatsAppReply = (order: OrderRecord) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const message =
      `🌿 *EDENLEAF DISPATCH UPDATE - ${order.id}* 🌿\n\n` +
      `Hello ${order.customerName}!\n` +
      `Your Eden Leaf order has been updated to: *${order.status.toUpperCase()}*.\n\n` +
      `• *Items:* ${order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}\n` +
      `• *Total:* $${order.total.toFixed(2)}\n` +
      `• *Delivery Destination:* ${order.address}\n\n` +
      `Our greenhouse horticulturist is preparing your living specimens with care. Please reply if you have special delivery questions!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailReply = (order: OrderRecord) => {
    const subject = encodeURIComponent(`EdenLeaf Order Update - ${order.id} (${order.status})`);
    const body = encodeURIComponent(
      `Dear ${order.customerName},\n\n` +
      `Your Eden Leaf Botanicals order (${order.id}) status is now: ${order.status.toUpperCase()}.\n\n` +
      `Order Breakdown:\n` +
      order.items.map((i) => `• ${i.quantity}x ${i.product.name} ($${(i.product.price * i.quantity).toFixed(2)})`).join('\n') +
      `\n\nTotal: $${order.total.toFixed(2)}\nDelivery: ${order.address}\n\n` +
      `Thank you for growing beauty, naturally.\n\nEden Leaf Botanicals Team`
    );

    window.location.href = `mailto:${order.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#05130D] p-5 rounded-3xl border border-[#C59B27]/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2.5">
            <span>Customer Order Dispatch Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1A4D34] text-[#DFB847] font-mono">
              {orders.length} Total Orders
            </span>
          </h2>
          <p className="text-xs text-emerald-200/70 font-light mt-0.5">
            Incoming WhatsApp & Email manifests synchronized in real-time.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#05130D]/80 p-3.5 rounded-2xl border border-[#C59B27]/25">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B27]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, order ID, or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0A1C13] border border-[#C59B27]/30 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-[#0A1C13] border border-[#C59B27]/30 text-xs text-emerald-100 cursor-pointer focus:outline-none"
        >
          <option value="all">All Lifecycle States ({orders.length})</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#05130D] border border-[#C59B27]/30 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="sticky top-0 bg-[#0A1C13] border-b border-[#C59B27]/30 text-[11px] font-mono uppercase tracking-wider text-[#DFB847] z-10">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & Contact</th>
                <th className="py-3.5 px-4">Items Manifest</th>
                <th className="py-3.5 px-4 text-center">Total Value</th>
                <th className="py-3.5 px-4 text-center">Lifecycle Status</th>
                <th className="py-3.5 px-4 text-right">Direct Client Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A4D34]/40 font-light">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-emerald-400/60 font-mono">
                    No orders matched the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#0E2D20]/60 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-white text-sm block">
                        {order.id}
                      </span>
                      <span className="text-[10px] text-emerald-400/80 font-mono block">
                        {new Date(order.date).toLocaleDateString()} • {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        order.dispatchMethod === 'WhatsApp' ? 'bg-[#25D366]/20 text-[#25D366]' : 'bg-blue-900/40 text-blue-300'
                      }`}>
                        Via {order.dispatchMethod}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-[#C59B27] font-mono block">
                        {order.phone}
                      </span>
                      <span className="text-[11px] text-emerald-300/70 block truncate max-w-xs">
                        {order.address}
                      </span>
                    </td>

                    {/* Items Manifest */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 max-w-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] flex items-center justify-between text-emerald-200">
                            <span className="truncate">{it.quantity}x {it.product.name}</span>
                            <span className="font-mono text-white/70 ml-2">
                              ${(it.product.price * it.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Value */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-base text-[#DFB847]">
                        ${order.total.toFixed(2)}
                      </span>
                    </td>

                    {/* Status Toggle Dropdown */}
                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none ${getStatusBadge(order.status)}`}
                      >
                        <option value="Pending" className="bg-[#0A1C13] text-amber-300">Pending</option>
                        <option value="Confirmed" className="bg-[#0A1C13] text-blue-300">Confirmed</option>
                        <option value="Dispatched" className="bg-[#0A1C13] text-purple-300">Dispatched</option>
                        <option value="Delivered" className="bg-[#0A1C13] text-emerald-300">Delivered</option>
                        <option value="Cancelled" className="bg-[#0A1C13] text-rose-300">Cancelled</option>
                      </select>
                    </td>

                    {/* Client Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleWhatsAppReply(order)}
                          className="p-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-[#0A1C13] border border-[#25D366]/40 transition-all"
                          title="Send Status Update on WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4 fill-current" />
                        </button>

                        <button
                          onClick={() => handleEmailReply(order)}
                          className="p-2 rounded-xl bg-blue-900/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all"
                          title="Send Email Confirmation"
                        >
                          <Mail className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete order ${order.id} permanently?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-950/30 hover:bg-rose-700 text-rose-400 hover:text-white border border-rose-900/30 transition-all"
                          title="Delete Order Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
