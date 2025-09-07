// src/components/FileExplorer.jsx
import React, { useState } from "react";

export default function FileExplorer({ files, onFileSelect }) {
  function renderTree(node, path = "") {
    return Object.entries(node).map(([name, value]) => {
      const newPath = path ? `${path}/${name}` : name;
      if (typeof value === "string") {
        return (
          <div
            key={newPath}
            className="cursor-pointer hover:bg-gray-200 px-2 py-1 text-sm"
            onClick={() => onFileSelect(newPath, value)}
          >
            📄 {name}
          </div>
        );
      } else {
        return (
          <div key={newPath} className="pl-2">
            <div className="font-bold">📂 {name}</div>
            {renderTree(value, newPath)}
          </div>
        );
      }
    });
  }

  return <div className="text-xs">{renderTree(files)}</div>;
}
