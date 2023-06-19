import React from "react";
/**
 * Represents an external button
 * @param param
 * @returns
 */

function ExtButton({
    className,
    children,
    type,
    onClick
}: {
    className: string;
    children: JSX.Element;
    type?: string;
    onClick: (e: React.MouseEvent) => void;
}) {
    return (
        <span
            data-btn-type={type}
            onClick={(e) => {
                if (e.currentTarget === e.target) {
                    // ignore click on self
                    e.stopPropagation();
                    e.preventDefault();
                } else {
                    onClick(e);
                }
            }}
            className={className}
        >
            {children}
        </span>
    );
}

export default ExtButton;
