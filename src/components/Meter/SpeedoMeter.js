import ReactSpeedometer from "react-d3-speedometer";
import { Box } from "@mui/material";

const SpeedoMeter = ({ label, meterData, unit, maxValue, segmentColors }) => {
  const value = Math.min(Math.abs(meterData || 0), maxValue);

  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', p:1}}>
      <ReactSpeedometer
          maxValue={maxValue}
          minValue={0}
          value={value}
          needleColor= "#005DA2"
          startColor="#00C853"
          endColor="#D50000"
          segments={5}
          ringWidth={20}
          needleHeightRatio={0.7}
          currentValueText={`${label}: ${value} ${unit}`}
          width={210}
          height={130}
          segmentColors={segmentColors}
      />
    </Box>
  );
};

export default SpeedoMeter;
