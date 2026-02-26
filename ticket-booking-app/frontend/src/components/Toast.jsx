import { useState, useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
    };

    const colors = {
        success: "linear-gradient(135deg, #10b981, #059669)",
        error: "linear-gradient(135deg, #ef4444, #dc2626)",
        warning: "linear-gradient(135deg, #f59e0b, #d97706)",
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                padding: "14px 24px",
                borderRadius: "12px",
                color: "white",
                fontWeight: 600,
                zIndex: 10000,
                background: colors[type],
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(-20px)",
                transition: "all 0.3s ease",
                animation: "slideDown 0.4s ease",
                maxWidth: "400px",
            }}
        >
            <span style={{ fontSize: "18px" }}>{icons[type]}</span>
            {message}
        </div>
    );
}
