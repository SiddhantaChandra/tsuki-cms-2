import React from 'react';
import CollectionsIcon from '@mui/icons-material/Collections';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import styles from './RecentItems.module.css';

const RecentItems = ({ recentItems }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'card':
        return <CollectionsIcon />;
      case 'slab':
        return <CategoryIcon />;
      case 'accessory':
        return <Inventory2Icon />;
      default:
        return <CollectionsIcon />;
    }
  };

  const getAvatarClass = (type) => {
    switch (type) {
      case 'card':
        return styles.avatarCard;
      case 'slab':
        return styles.avatarSlab;
      case 'accessory':
        return styles.avatarAccessory;
      default:
        return styles.avatarCard;
    }
  };

  return (
    <div className={styles.recentItemsCard}>
      <h2 className={styles.recentItemsTitle}>Recently Added Items</h2>
      {recentItems.length === 0 ? (
        <div className={styles.noItems}>
          <p>No recent items found</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Price</th>
                <th>Type</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((item) => (
                <tr key={item.id}>
                  <td className={styles.avatarCell}>
                    {item.thumbnail_url ? (
                      <img
                        className={styles.avatar}
                        src={item.thumbnail_url}
                        alt={item.name}
                      />
                    ) : (
                      <div className={`${styles.avatar} ${getAvatarClass(item.type)}`}>
                        {getIcon(item.type)}
                      </div>
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td className={styles.priceCell}>₹{item.price.toLocaleString()}</td>
                  <td className={styles.typeCell}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentItems; 