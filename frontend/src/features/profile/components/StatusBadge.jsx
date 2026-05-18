const StatusBadge = ({ active, activeText, inactiveText }) => {
  return (
    <span className={`buyer-status-badge ${active ? 'active' : 'pending'}`}>
      {active ? activeText : inactiveText}
    </span>
  );
};

export default StatusBadge;
