import React from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CollectionsIcon from '@mui/icons-material/Collections';
import CategoryIcon from '@mui/icons-material/Category';
import styles from './DashboardSummary.module.css';

const SummaryCard = ({ title, value, icon, cardClass, iconClass }) => {
  return (
    <div className={`${styles.summaryCard} ${styles[cardClass]}`}>
      <div className={styles.cardContent}>
        <div>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardValue}>{value}</p>
        </div>
        <div className={`${styles.iconContainer} ${styles[iconClass]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardSummary = ({ cardCount, slabCount, accessoryCount, totalValue }) => {
  return (
    <div className={styles.summaryGrid}>
      <div>
        <SummaryCard
          title="Total Value"
          value={`₹${totalValue.toLocaleString()}`}
          icon={<AttachMoneyIcon sx={{ fontSize: 40, color: '#4caf50' }} />}
          cardClass="cardTotal"
          iconClass="iconTotal"
        />
      </div>
      <div>
        <SummaryCard
          title="Cards"
          value={cardCount}
          icon={<CollectionsIcon sx={{ fontSize: 40, color: '#2196f3' }} />}
          cardClass="cardCards"
          iconClass="iconCards"
        />
      </div>
      <div>
        <SummaryCard
          title="Slabs"
          value={slabCount}
          icon={<CategoryIcon sx={{ fontSize: 40, color: '#ff9800' }} />}
          cardClass="cardSlabs"
          iconClass="iconSlabs"
        />
      </div>
      <div>
        <SummaryCard
          title="Accessories"
          value={accessoryCount}
          icon={<Inventory2Icon sx={{ fontSize: 40, color: '#f44336' }} />}
          cardClass="cardAccessories"
          iconClass="iconAccessories"
        />
      </div>
    </div>
  );
};

export default DashboardSummary; 