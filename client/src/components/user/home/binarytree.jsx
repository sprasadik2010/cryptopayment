import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Tree from "react-d3-tree";
import SignUpLinks from "./signuplink";

// Component
export default function BinaryTree({ Currentusername, CurrentUserId }) {

  const [treeData, setTreeData] = useState(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [rootId, setRootId] = useState(null);
  const [flatData, setFlatData] = useState([]);
  const [selectedPath, setSelectedPath] = useState("diagonal");
  const [selectedOrientation, setSelectedOrientation] = useState("vertical");
  const navigate = useNavigate();
  const MAX_X = 200;
  const MIN_X = -200;
  const MAX_Y = 200;
  const MIN_Y = -200;
  const [translate, setTranslate] = useState({ x: 300, y: 200 });
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const renderRectNode = ({ nodeDatum }) => {
  const PADDING_X = 20;

  // Temporary canvas to measure text width
  const getTextWidth = (text, font = '16px sans-serif') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  };

  const textWidth = getTextWidth(nodeDatum.name);
  const rectWidth = textWidth + PADDING_X * 2;

  return (
    <g onClick={() => handleNodeClick({ data: nodeDatum })}>
      <rect
        width={rectWidth}
        height="40"
        x={-rectWidth / 2}
        y="-20"
        fill="lightblue"
        stroke={nodeDatum.is_active === false ? "#9CA3AF" : "steelblue"}
        strokeWidth="1.5"
        rx={5}
      />
      <text
        x="0"
        y="5"
        stroke={nodeDatum.is_active === false ? "#9CA3AF" : "steelblue"}
        strokeWidth="1"
        textAnchor="middle"
        fontSize="16px"
      >
        {nodeDatum.name}
      </text>
    </g>
  );
};


  // Function to build hierarchical tree structure
  const buildTree = (flatData, rootId) => {
    console.log("Building tree for root ID:", rootId);
    console.log("Flat Data:", flatData);

    const nodeMap = new Map();
    flatData.forEach(node => nodeMap.set(node.id, { ...node, children: [] }));

    if (!nodeMap.has(rootId)) {
      console.error("Root ID not found in nodeMap");
      return null;
    }

    let root = nodeMap.get(rootId);
    console.log("Root Node:", root);

    const addChildren = (parentNode, level) => {
      if (level >= 4) return;

      let children = flatData
        .filter(node => node.parentid === parentNode.id)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

      console.log(`Children of ${parentNode.name} (${parentNode.id}):`, children);

      // Ensure placeholders
      if (children.length < 2) {
        let hasLeft = children.some(child => child.position === 0);
        let hasRight = children.some(child => child.position === 1);

        if (!hasLeft) {
          children.unshift({ id: `ghost-${parentNode.id}-L`, parentid: parentNode.id, position: 0, isPlaceholder: true });
        }
        if (!hasRight) {
          children.push({ id: `ghost-${parentNode.id}-R`, parentid: parentNode.id, position: 1, isPlaceholder: true });
        }
      }

      children.forEach(child => {
        const childNode = nodeMap.get(child.id) || { ...child, children: [] };
        parentNode.children.push(childNode);
        if (!child.isPlaceholder) addChildren(childNode, level + 1);
      });
    };

    addChildren(root, 1);
    return root;
  };

  // Fetch data from API
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/children/${Currentusername}`, { method: "GET" });

        if (!response.ok) throw new Error("Failed to fetch user details");

        const data = await response.json();
        console.log("Fetched Data:", data);
        setFlatData(data);
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    fetchChildren();
  }, [Currentusername]);

  // Determine root node dynamically
  useEffect(() => {
    if (flatData.length > 0) {
      const rootNode = flatData.find(node => !flatData.some(n => n.id === node.parentid));
      if (rootNode) {
        console.log("Root Node Found:", rootNode);
        setRootId(rootNode.id);
      }
    }
  }, [flatData]);

  // Build tree when rootId is set
  useEffect(() => {
    if (flatData.length > 0 && rootId) {
      console.log("Building tree with updated data...");
      const newTree = buildTree(flatData, rootId);
      if (newTree) setTreeData(newTree);
    }
  }, [flatData, rootId, selectedPath, selectedOrientation]);

  // Handle node click
  const handleNodeClick = useCallback(
    (nodeData) => {
      if (nodeData.data.isPlaceholder) return;

      const clickedNodeId = nodeData.data.id;
      if (nodeData.data.isJoinNode) {
        navigate("/signup");
      } else if (clickedNodeId === rootId) {
        const parent = flatData.find(node => node.id === rootId)?.parentid;
        if (parent) setRootId(parent);
      } else {
        setRootId(clickedNodeId);
      }
    },
    [rootId, navigate, flatData]
  );

  const handleOnUpdate = (currentTranslate) => {
    const clamped = {
      x: clamp(currentTranslate.x, MIN_X, MAX_X),
      y: clamp(currentTranslate.y, MIN_Y, MAX_Y),
    };
  
    if (!clamped.x < translate.x || !clamped.y < translate.y) {
      setTranslate(clamped);
    }
  };

  return (
    <>
      <div className="grid grid-rows-[auto,1fr] gap-1">
        <div className="p-4 bg-blue-100 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <div style={{ width: "100%", height: "auto", position: "relative" }}>
              <SignUpLinks username={Currentusername} side={"Left"} userid={CurrentUserId} />
            </div>
            <div style={{ width: "100%", height: "auto", position: "relative" }}>
              <SignUpLinks username={Currentusername} side={"Right"} userid={CurrentUserId} />
            </div>
            <div
              className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
              style={{ width: "100%", height: "auto", position: "relative" }}
            >
              <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex items-center space-x-2">
                <label htmlFor="path-select" className="text-gray-700 dark:text-gray-300">Path Function:</label>
                <select
                  id="path-select"
                  value={selectedPath}
                  onChange={e => setSelectedPath(e.target.value)}
                  className="px-4 py-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100 active:bg-gray-200 transition dark:bg-gray-700 dark:text-white"
                >
                  <option value="diagonal">Diagonal</option>
                  <option value="elbow">Elbow</option>
                  <option value="straight">Straight</option>
                  <option value="step">Step</option>
                </select>
              </div>
              <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex items-center space-x-2">
              <label htmlFor="Orientation" className="text-gray-700 dark:text-gray-300">Orientation:</label>
              <select
                id="Orientation"
                value={selectedOrientation}
                onChange={e => setSelectedOrientation(e.target.value)}
                className="px-4 py-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100 active:bg-gray-200 transition dark:bg-gray-700 dark:text-white"
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-200 rounded h-full">
          <div style={{ width: "100%", height: "50vh", position: "relative", border: "solid 2px black", float: "right" }}>            
            {treeData ? (
              <Tree
                data={treeData}
                renderCustomNodeElement={renderRectNode}
                orientation={selectedOrientation}
                translate={{ x: dimensions.width / 2, y: 100 }}
                separation={{ siblings: 1.5, nonSiblings: 2 }}
                pathFunc={selectedPath}
                onNodeClick={handleNodeClick}
                onUpdate={handleOnUpdate}
                rootNodeClassName="node__branch"
                branchNodeClassName="node__branch"
                leafNodeClassName="node__leaf"
                nodeClassName={(nodeData) =>
                              nodeData.data.isPlaceholder ? "node__placeholder" : ""
                              }
                draggable = {true}
                
              />
            ) : (
              <p style={{ textAlign: "center", marginTop: "20px" }}>No Data Available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
