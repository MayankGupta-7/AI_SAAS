import React from "react";

const Billing = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold">Current Plan</h2>
        <p className="text-gray-500 mt-2">Free Plan</p>

        <button className="mt-4 px-5 py-2 bg-black text-white rounded-lg">
          Upgrade Plan
        </button>
      </div>

      <div className="mt-6 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold">Payment History</h2>
        <p className="text-gray-500 mt-2">No payments yet</p>
      </div>
    </div>
  );
};

export default Billing;