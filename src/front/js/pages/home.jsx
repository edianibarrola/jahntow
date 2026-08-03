import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

import { Tabs, Tab } from "react-bootstrap";

import LevelComponent from "../component/levelComponent";
import ExperienceComponent from "../component/experienceComponent";
import LoginStreakComponent from "../component/loginStreakComponent";
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
import LeaderboardComponent from "../component/leaderboardComponent";
import ActivityToast from "../component/ActivityToast";

import StoryMissions from "../component/storyMissions";

import "../../styles/home.css";
import { Navigate, useNavigate } from "react-router-dom";

// i like this for the Ai Robot that helps the player (tells him about the missions)
//  Eco-conscious Consultant for Habitability Optimization:
// Given the game's theme of restarting civilization after Earth's ruin,
// E.C.H.O. could be an AI focused on sustainable practices and optimizing habitability.

// Market prices and passive effects (energy regen, property production)
// are computed server-side now. This just refreshes the client's view of
// them periodically, instead of the old client-side price-randomization
// and inventory-generation loop.
const POLL_INTERVAL_MS = 20000;

export const Home = () => {
  const { store, actions } = useContext(Context);
  const { player } = store;
  const navigate = useNavigate();

  useEffect(() => {
    actions.fetchGameData();
    actions.fetchMarketPrices();
    actions.fetchLeaderboard();

    const intervalId = setInterval(() => {
      actions.fetchMarketPrices();
      actions.fetchPlayerData();
      actions.fetchLeaderboard();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  const handleNavigate = () => {
    navigate("/dashboard");
  };

  return (
    <div className="mt-2 container holobg">
      <ActivityToast />
      <div className="row mb-2 holo ">
        <div className="row pt-2 pb-1 m-0 justify-content-around text-center">
          <div className="col-4">{player.name}</div>
          <LevelComponent level={player.level} />
          <ExperienceComponent experience={player.experience} />
          <LoginStreakComponent streak={player.loginStreak} />
        </div>
      </div>
      {/* <div className="row mb-2 holo sticky-top">
        <div className="row pt-2 pb-1 m-0 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} />
          <CreditsComponent credits={player.credits} />
        </div>
      </div> */}

      <div className="row  ">
        <Tabs defaultActiveKey="items" id="game-tabs">
          <Tab eventKey="items" title="Market" className="marketplace ">
            <ItemsComponent />
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

          <Tab eventKey="leaderboard" title="Leaderboard" className="ship">
            <LeaderboardComponent />
          </Tab>
        </Tabs>

        <div className="row heightControl">
          <div className="col-12 col-md-6">
            <NotificationsComponent />
          </div>

          <div className="col-12 col-md-6 mb-5">
            <TransactionsComponent />
          </div>
        </div>

        <div className="col-12 text-center">
          <button onClick={handleNavigate}>to dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
