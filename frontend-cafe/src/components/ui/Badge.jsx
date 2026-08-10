import React from "react";

const Badge = ({ children, variant = "primary" }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case "success":
        return { bg: "#EAFDF3", color: "#10B981" };
      case "danger":
        return { bg: "#FCEAEB", color: "#D8434E" };
      case "warning":
        return { bg: "#FDF3E4", color: "#C77D1E" };
      case "secondary":
        return { bg: "#F3F4F6", color: "#4B5563" };
      case "primary":
      default:
        return { bg: "#EAF0FC", color: "#3A72D2" };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
        lineHeight: 1.2,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
