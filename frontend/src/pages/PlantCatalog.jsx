import React, { useState, useEffect } from 'react';
import { plantCatalogService } from '../services/api';

const defaultPlants = [
  { id: '1', commonName: 'Aloe Vera', scientificName: 'Aloe barbadensis miller', oxygenSupport: '~1 person', advantages: 'Medicinal gel, air purification', disadvantages: 'Toxic if eaten raw', humanBenefits: 'Heals burns and skin problems' },
  { id: '2', commonName: 'Money Plant', scientificName: 'Epipremnum aureum', oxygenSupport: '~1 person', advantages: 'Removes toxins', disadvantages: 'Toxic to pets', humanBenefits: 'Improves air quality' },
  { id: '3', commonName: 'Snake Plant', scientificName: 'Sansevieria trifasciata', oxygenSupport: '~2 persons at night', advantages: 'Night oxygen release', disadvantages: 'Slow growth', humanBenefits: 'Better sleep' },
  { id: '4', commonName: 'Areca Palm', scientificName: 'Areca catechu', oxygenSupport: '~3 persons', advantages: 'Humidifier', disadvantages: 'Needs space', humanBenefits: 'Improves breathing' },
  { id: '5', commonName: 'Tulsi', scientificName: 'Ocimum tenuiflorum', oxygenSupport: '~1 person', advantages: 'Medicinal', disadvantages: 'Needs sunlight', humanBenefits: 'Boosts immunity' },
  { id: '6', commonName: 'Rubber Plant', scientificName: 'Ficus elastica', oxygenSupport: '~2 persons', advantages: 'Removes pollutants', disadvantages: 'Large size', humanBenefits: 'Cleaner air' },
  { id: '7', commonName: 'Spider Plant', scientificName: 'Chlorophytum comosum', oxygenSupport: '~1 person', advantages: 'Removes CO', disadvantages: 'Needs maintenance', humanBenefits: 'Reduces allergies' },
  { id: '8', commonName: 'Peace Lily', scientificName: 'Spathiphyllum wallisii', oxygenSupport: '~1 person', advantages: 'Removes mold', disadvantages: 'Toxic', humanBenefits: 'Better breathing' },
  { id: '9', commonName: 'Neem', scientificName: 'Azadirachta indica', oxygenSupport: '~5 persons', advantages: 'Antibacterial', disadvantages: 'Bitter smell', humanBenefits: 'Kills germs' },
  { id: '10', commonName: 'Rose', scientificName: 'Rosa indica', oxygenSupport: '~1 person', advantages: 'Fragrance', disadvantages: 'Needs care', humanBenefits: 'Reduces stress' }
];

export default function PlantCatalog() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const data = await plantCatalogService.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setCatalog(data);
      } else {
        setCatalog(defaultPlants);
      }
    } catch (err) {
      console.error('Plant catalog fetch error:', err);
      setCatalog(defaultPlants);
    } finally {
      setLoading(false);
    }
  };

  const filteredCatalog = catalog.filter((plant) => {
    const q = searchTerm.toLowerCase();
    return (
      plant.commonName.toLowerCase().includes(q) ||
      plant.scientificName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flutter-search-container">
      {/* Header */}
      <div className="flutter-greeting-header" style={{ marginBottom: '16px' }}>
        <span className="flutter-greeting-sub">Botanical Info</span>
        <h2 className="flutter-greeting-title">Plant Directory 🔍</h2>
      </div>

      {/* Search Input Bar */}
      <div className="flutter-search-input-wrapper">
        <span className="flutter-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search plants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flutter-search-input"
        />
      </div>

      {/* Plant Cards Directory List */}
      {loading ? (
        <div className="panel-loading">
          <div className="loading-spinner"></div>
          <p>Loading botanical directory...</p>
        </div>
      ) : filteredCatalog.length === 0 ? (
        <div className="flutter-empty-history" style={{ marginTop: '20px' }}>
          <div className="flutter-empty-icon-circle">
            <span className="flutter-empty-icon">🔍</span>
          </div>
          <h4>No plants match your search</h4>
          <p>Try searching for another plant common name or scientific name.</p>
        </div>
      ) : (
        <div className="flutter-plant-list">
          {filteredCatalog.map((plant) => (
            <div
              key={plant.id || plant.commonName}
              className="flutter-plant-card"
              onClick={() => setSelectedPlant(plant)}
            >
              <div className="flutter-plant-avatar">
                🌿
              </div>
              <div className="flutter-plant-info">
                <div className="flutter-plant-name">{plant.commonName}</div>
                <div className="flutter-plant-sci">{plant.scientificName}</div>
              </div>
              <div className="flutter-plant-arrow">›</div>
            </div>
          ))}
        </div>
      )}

      {/* Plant Detail Modal Popup */}
      {selectedPlant && (
        <div className="form-card-overlay" onClick={() => setSelectedPlant(null)}>
          <div className="form-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <div style={{ fontSize: '28px', backgroundColor: 'var(--primary-light)', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🌿
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)' }}>{selectedPlant.commonName}</h3>
                <p style={{ margin: '2px 0 0 0', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-light)' }}>{selectedPlant.scientificName}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {/* Oxygen Support */}
              <div className="flutter-detail-card blue">
                <div className="flutter-detail-card-title blue">
                  <span>💨</span> Oxygen Support
                </div>
                <div className="flutter-detail-card-text">{selectedPlant.oxygenSupport || 'N/A'}</div>
              </div>

              {/* Advantages */}
              <div className="flutter-detail-card green">
                <div className="flutter-detail-card-title green">
                  <span>👍</span> Advantages
                </div>
                <div className="flutter-detail-card-text">{selectedPlant.advantages || 'N/A'}</div>
              </div>

              {/* Disadvantages */}
              <div className="flutter-detail-card red">
                <div className="flutter-detail-card-title red">
                  <span>👎</span> Disadvantages
                </div>
                <div className="flutter-detail-card-text">{selectedPlant.disadvantages || 'N/A'}</div>
              </div>

              {/* Human Benefits */}
              <div className="flutter-detail-card pink">
                <div className="flutter-detail-card-title pink">
                  <span>💖</span> Human Benefits
                </div>
                <div className="flutter-detail-card-text">{selectedPlant.humanBenefits || 'N/A'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <button onClick={() => setSelectedPlant(null)} className="btn-secondary" style={{ padding: '8px 24px', fontWeight: 'bold' }}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
