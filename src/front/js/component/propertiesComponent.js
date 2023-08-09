import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";

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
    for (let category in store.propertiesData) {
      for (let property in store.propertiesData[category]) {
        let itemGenerated =
          store.propertiesData[category][property]["Item Generated"];
        let generationRate =
          store.propertiesData[category][property]["Generation Rate"];
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
    const property = store.propertiesData[categoryName][propertyName];

    // Check if the player already owns this property
    if (player.properties[propertyName] > 0) {
      alert("You already own this property!");
      return;
    }

    if (player.credits >= property["Current Cost"]) {
      const updatedPlayer = {
        ...player,
        credits: player.credits - property["Current Cost"],
        properties: {
          ...player.properties,
          [propertyName]: (player.properties[propertyName] || 0) + 1,
        },
      };
      actions.updatePlayer(updatedPlayer);
    } else {
      alert("You do not have enough credits to purchase this property.");
    }
  };

  // Filter the categories based on maxRank
  const unlockedCategories = Object.keys(store.propertiesData).filter(
    (categoryName) => {
      const unlockedProperties = Object.keys(
        store.propertiesData[categoryName]
      ).filter(
        (propertyName) =>
          store.propertiesData[categoryName][propertyName].Rank <= maxRank
      );
      return unlockedProperties.length > 0;
    }
  );

  return (
    <div className="row mb-3">
      <div className="col-12 text-center">
        <h1>Properties</h1>
      </div>

      <div className="col-12">
        <Accordion defaultActiveKey="0">
          {unlockedCategories.map((categoryName, index) => (
            <Accordion.Item
              className="holo"
              eventKey={index.toString()}
              key={categoryName}
            >
              <Accordion.Header className="holo text-center">
                {categoryName}
              </Accordion.Header>
              <Accordion.Body>
                <div className="col-12 pl-5 pr-5 text-center">
                  {Object.keys(store.propertiesData[categoryName])
                    .filter(
                      (propertyName) =>
                        store.propertiesData[categoryName][propertyName].Rank <=
                        maxRank
                    )
                    .map((propertyName) => {
                      const property =
                        store.propertiesData[categoryName][propertyName];
                      return (
                        <button
                          key={propertyName}
                          onClick={() =>
                            handlePurchase(categoryName, propertyName)
                          }
                        >
                          {player.properties[propertyName] > 0
                            ? "Owned: "
                            : "Purchase: "}
                          {propertyName}
                        </button>
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
                {item}: {generationRates[item]} every 5 seconds
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
