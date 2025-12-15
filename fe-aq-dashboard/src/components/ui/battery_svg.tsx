interface BatterySvgProps {
  batteryPercentage: number; // 0-100
}

const BatterySvg: React.FC<BatterySvgProps> = ({ batteryPercentage }) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, batteryPercentage));

  // Battery body dimensions
  const batteryTop = 46.9;
  const batteryBottom = 505.786;
  const totalHeight = batteryBottom - batteryTop;

  const fillHeight = (clampedPercentage / 100) * totalHeight;
  const fillY = batteryBottom - fillHeight;

  // Color based on battery level
  const getFillColor = (percentage: number) => {
    if (percentage > 50) return "#00ff00"; // Green
    if (percentage > 20) return "#ff7d00"; // Orange
    return "#ff0000"; // Red
  };

  return (
    <div style={{ width: "300px", height: "300px" }}>
      <svg
        version="1.1"
        id="_x34_"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        width="100%"
        height="100%"
      >
        <g>
          <path
            style={{ opacity: 0.09, fill: "#040000" }}
            d="M91.512,420.464v85.317c0,3.401,2.783,6.184,6.184,6.184h316.608
    c3.401,0,6.184-2.783,6.184-6.184V91.488L91.512,420.464z"
          />
          <g>
            <path
              style={{ opacity: 0.8, fill: "#ffecd1" }}
              d="M420.457,46.9v458.886c0,3.448-2.759,6.207-6.131,6.207H97.674
      c-3.372,0-6.131-2.759-6.131-6.207V46.9c0-3.449,2.759-6.207,6.131-6.207h68.051V6.207c0-3.372,2.759-6.207,6.207-6.207h168.136
      c3.449,0,6.207,2.835,6.207,6.207v34.485h68.051C417.698,40.693,420.457,43.451,420.457,46.9z"
            />
            {/* Dynamic fill rectangle */}
            <rect
              x="97.674"
              y={fillY}
              style={{ opacity: 0.9, fill: getFillColor(clampedPercentage) }}
              width="316.652"
              height={fillHeight}
            />
            {/* Lightning bolt with original blue colors */}
            <polygon
              style={{ fill: "#15616D" }}
              points="207.805,147.876 317.749,149.381 271.058,232.212 328.287,229.196 190.029,393.062 
			228.887,277.391 183.714,275.887"
            />
            <path
              style={{ opacity: 0.09, fill: "#040000" }}
              d="M91.512,420.499v85.317c0,3.401,2.783,6.184,6.184,6.184h316.608
      c3.401,0,6.184-2.783,6.184-6.184V91.522L91.512,420.499z"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default BatterySvg;
