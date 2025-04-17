import { useState } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";

const CopyToClipboard = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for unsupported environments
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.setAttribute("readonly", "");
                textarea.style.position = "absolute";
                textarea.style.left = "-9999px";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }

            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
        } catch (err) {
            console.error("Copy failed:", err);
            alert("Copy failed. Please copy manually.");
        }
    };

    return (
        <button 
            onClick={handleCopy} 
            className="flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100 active:bg-gray-200 transition"
        >
            {copied ? <ClipboardCheck className="text-green-500 w-5 h-5" /> : <Clipboard className="text-gray-500 w-5 h-5" />}
            <span className="text-sm font-medium">{copied ? "Copied!" : "Copy"}</span>
        </button>
    );
};

export default CopyToClipboard;
