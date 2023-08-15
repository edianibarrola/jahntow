import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

import { Tabs, Tab } from "react-bootstrap";

import LevelComponent from "../component/levelComponent";
import ExperienceComponent from "../component/experienceComponent";
import HealthComponent from "../component/healthComponent";
import EnergyComponent from "../component/energyComponent";
import CreditsComponent from "../component/creditsComponent";
import ItemsComponent from "../component/itemsComponent";
import ResetPlayerStats from "../component/resetPlayerStats";
import MissionsComponent from "../component/missionsComponent";
import NotificationsComponent from "../component/notificationsComponent";
import TransactionsComponent from "../component/transactionsComponent";
import HealthRecoveryComponent from "../component/healthRecoveryComponent";
import PropertiesComponent from "../component/propertiesComponent";
import InventoryUpgradeComponent from "../component/inventoryUpgradeComponent";
import EquipmentStore from "../component/equipmentStore";

import StoryMissions from "../component/storyMissions";

import rigoImage from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Navigate, useNavigate } from "react-router-dom";

// HOW TO REDEPLOY TO GH <PAGES>
// change env to = /textgame
// npm install gh-pages -g
// then run these two together
// npm run build && gh-pages -d public

// i like this for the Ai Robot that helps the player (tells him about the missions)
//  Eco-conscious Consultant for Habitability Optimization:
// Given the game's theme of restarting civilization after Earth's ruin,
// E.C.H.O. could be an AI focused on sustainable practices and optimizing habitability.

export const Home = () => {
  const { store, actions } = useContext(Context);
  const { player, itemsData } = store;
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let adjustCount = 0; // Track the number of times adjustPrices has run

    function runAdjustPrices() {
      if (!isMounted) return;
      if (adjustCount < 4) {
        actions.adjustPrices();
        adjustCount++;
        setTimeout(runAdjustPrices, 5000); // Run adjustPrices every 5 seconds until it has run 4 times
      } else {
        adjustCount = 0; // Reset the count
        setTimeout(runUpdateInventory, 15000); // Delayed by 15 seconds after adjustPrices has run 4 times
      }
    }

    function runUpdateInventory() {
      if (!isMounted) return;
      actions.updateInventory();
      setTimeout(runAdjustPrices, 5000); // Adjusted to 5 seconds
    }

    const initialTimeoutId = setTimeout(runAdjustPrices, 5000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimeoutId);
    };
  }, []);

  const handleNavigate = () => {
    // 2. Create an event handler function
    navigate("/dashboard"); // 3. Inside this function, call the navigate function
  };

  // const handleLevelUp = () => {
  //   const updatedPlayer = {
  //     ...player,
  //     level: player.level + 1,
  //     credits: player.credits + 1000,
  //   };
  //   actions.updatePlayer(updatedPlayer);
  // };

  return (
    <div className="mt-2 container holobg">
      <div className="row mb-2 holo ">
        <div className="row pt-2 pb-1 m-0 justify-content-around text-center">
          <div className="col-4">{player.name}</div>
          <LevelComponent level={player.level} />
          <ExperienceComponent experience={player.experience} />
        </div>
      </div>
      {/* <div className="row mb-2 holo sticky-top">
        <div className="row pt-2 pb-1 m-0 justify-content-around text-center">
          <HealthComponent health={player.health} />
          <EnergyComponent energy={player.energy} />
          <CreditsComponent credits={player.credits} />
        </div>
      </div> */}

      <div className="row  ">
        <Tabs defaultActiveKey="items" id="game-tabs">
          <Tab eventKey="items" title="Market" className="marketplace ">
            <ItemsComponent
              itemData={itemsData["Energy Cores"]}
              selectedItem="Alpha Core"
            />

            <div className="row heightControl">
              <div className="col-12 col-md-6">
                <NotificationsComponent />
              </div>

              <div className="col-12 col-md-6 mb-5">
                <TransactionsComponent />
              </div>
            </div>
          </Tab>

          <Tab eventKey="missions" title="Missions" className="ship">
            <MissionsComponent />
          </Tab>
          <Tab eventKey="storyMissions" title="Story Missions" className="ship">
            <StoryMissions />
          </Tab>

          <Tab eventKey="properties" title="Properties" className="properties">
            <PropertiesComponent />
          </Tab>

          <Tab eventKey="equipment" title="Equipment" className="shipeqp">
            <div className="mb-5 text-center">
              <EquipmentStore />
            </div>
          </Tab>
          <Tab eventKey="health" title="Medlab" className="shipbed">
            <div className="row mb-3 text-center">
              <HealthRecoveryComponent />
            </div>
          </Tab>

          <Tab eventKey="upgrades" title="Upgrades" className="shipinside">
            <div className="mb-5 text-center">
              <InventoryUpgradeComponent />
            </div>
          </Tab>
        </Tabs>
        <div className="col-12 text-center">
          <button onClick={handleNavigate}>to dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
