import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

const PropertiesComponent = () => {
  const { store, actions } = useContext(Context);
  const { player } = store;

  // Define maxRank based on player level (every 2 levels equal one rank level)
  let maxRank;
  if (player.level <= 56) {
    maxRank = Math.floor((player.level + 1) / 2);
  } else {
    maxRank = 28 + Math.floor((player.level - 56) / 3);
  }

  const calculateGenerationRates = () => {
    let generationRates = {};
    for (let category in store.gameData.properties) {
      for (let property in store.gameData.properties[category]) {
        let itemGenerated =
          store.gameData.properties[category][property]["Item Generated"];
        let generationRate =
          store.gameData.properties[category][property]["Generation Rate"];
        let rate = (player.properties[property] || 0) * generationRate;
        if (rate > 0) {
          if (generationRates[itemGenerated]) {
            generationRates[itemGenerated] += rate;
          } else {
            generationRates[itemGenerated] = rate;
          }
        }
      }
    }
    return generationRates;
  };

  const generationRates = calculateGenerationRates();

  const handlePurchase = (categoryName, propertyName) => {
    // The backend already rejects buying an already-owned property (and
    // that error surfaces via the normal activity-log/toast path), so no
    // client-side pre-check is needed here.
    actions.buyProperty(propertyName).catch(() => {});
  };

  // Filter the categories based on maxRank
  const unlockedCategories = Object.keys(store.gameData.properties).filter(
    (categoryName) => {
      const unlockedProperties = Object.keys(
        store.gameData.properties[categoryName]
      ).filter(
        (propertyName) =>
          store.gameData.properties[categoryName][propertyName].Rank <= player.level // Use player's level to filter properties
      );
      return unlockedProperties.length > 0;
    }
  );

  return (
    <div className="row mb-3">
      <div className="row  sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-2 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
          <CreditsComponent credits={player.credits} />
        </div>
        <div className="col-12  text-center  ">
          <p>Properties</p>
        </div>
      </div>
      <div className="row">
        <Accordion>
          {unlockedCategories.map((categoryName, index) => (
            <Accordion.Item
              className="holo"
              eventKey={index.toString()}
              key={categoryName}
            >
              <Accordion.Header className=" text-center">
                {categoryName}
              </Accordion.Header>
              <Accordion.Body>
                <div className="col-12 pl-5 pr-5 text-center">
                  {Object.keys(store.gameData.properties[categoryName])
                    .filter(
                      (propertyName) =>
                        store.gameData.properties[categoryName][propertyName].Rank <=
                        player.level
                    )
                    .map((propertyName) => {
                      const property =
                        store.gameData.properties[categoryName][propertyName];
                      return (
                        <div key={propertyName} className="property-container">
                          <button
                            onClick={() =>
                              handlePurchase(categoryName, propertyName)
                            }
                          >
                            {player.properties[propertyName] > 0
                              ? `Owned: ${propertyName}`
                              : `Purchase: ${propertyName} for (${property["Base Cost"]})`}
                          </button>
                          <div className="property-details">
                            <p>
                              This property{" "}
                              {player.properties[propertyName] > 0
                                ? "generates"
                                : "will generate"}{" "}
                              {property["Generation Rate"]}{" "}
                              {property["Item Generated"]} apprx every 30
                              seconds
                              {/* You can add more details here */}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      <div className="row mt-3 mb-3">
        <div className="col-12 text-center">
          <h2>Generation Rates:</h2>
        </div>
      </div>
      <div className="row">
        {Object.keys(generationRates).length > 0 ? (
          Object.keys(generationRates).map((item) => (
            <div key={item} className="col-12 pl-5 pr-5 text-center">
              <p>
                {item}: {generationRates[item]} apprx every 30 seconds
              </p>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>Purchase a property to generate items.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesComponent;
