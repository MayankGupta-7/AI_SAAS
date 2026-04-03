import React from "react";

const History = () => {
  const history = [
    { id: 1, text: "Generate blog about AI", date: "Today" },
    { id: 2, text: "Fix React bug", date: "Yesterday" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">History</h1>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >
            <span>{item.text}</span>
            <span className="text-gray-400 text-sm">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;