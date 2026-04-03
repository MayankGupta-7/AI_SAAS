import React from "react";

const tools = [
  { name: "Text Generator", desc: "Generate content using AI" },
  { name: "Code Helper", desc: "Get coding help instantly" },
  { name: "Image Prompt", desc: "Create prompts for images" },
];

const AITools = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">AI Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{tool.name}</h2>
            <p className="text-gray-500 mt-2">{tool.desc}</p>

            <button className="mt-4 px-4 py-2 bg-black text-white rounded-lg">
              Use Tool
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITools;