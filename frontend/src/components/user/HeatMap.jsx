import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";



import api from "../../services/api";

const getPanelColors = (maxCount) => {
  const colors = {};
  // Simple gradient logic based on maxCount or hardcoded levels
  // 0 is handled by empty color usually
  // Let's create a generic map for keys 1 to max
  // For simplicity, we can stick to 0-4 levels or use the input count directly if small
  // But typically GitHub style is Level 0-4
  // We will dynamic generate based on max if needed, or just use static map for now
  return {
    0: '#161b22',
    1: '#0e4429',
    2: '#006d32',
    3: '#26a641',
    4: '#39d353',
  };
};

const HeatMapProfile = ({ userId }) => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const res = await api.user.getHeatmap(userId);
        const data = res.data;
        setActivityData(data);

        setPanelColors({
          0: 'var(--bg-subtle)',
          2: '#0e4429',
          4: '#006d32',
          10: '#26a641',
          20: '#39d353',
        });
      } catch (err) {
        console.error("Error fetching heatmap:", err);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      <h4>Recent Contributions</h4>
      <HeatMap
        className="HeatMapProfile"
        style={{ maxWidth: "700px", color: "white" }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
        rectSize={15}
        space={3}
        rectProps={{
          rx: 2.5,
        }}
        panelColors={panelColors}
      />
    </div>
  );
};

export default HeatMapProfile;