interface IconProps {
  className?: string;
  size?: number;
}

interface IconProps {
  className?: string;
  size?: number;
}

export const ChartShop = ({ className = "", size = 20 }: IconProps) => {
    return (
    <svg
    // Gabungkan className dari props dengan style default Anda
    className={`${className}`}
    xmlns="http://w3.org"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
    );
};

export const BurgerIcon = ({ className = "", size = 20 }: IconProps) => {
    return (
        <svg
        // Gabungkan className dari props dengan style default Anda
        className={`${className}`}
        xmlns="http://w3.org"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
};

    
