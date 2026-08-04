import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

import { Tabs, Tab } from "react-bootstrap";

import LevelComponent from "../component/levelComponent";
import ExperienceComponent from "../component/experienceComponent";
import LoginStreakComponent from "../component/loginStreakComponent";
import WinStreakComponent from "../component/winStreakComponent";
import ItemsComponent from "../component/itemsComponent";
import MissionsComponent from "../component/missionsComponent";
import NotificationsComponent from "../component/notificationsComponent";
import TransactionsComponent from "../component/transactionsComponent";
import HealthRecoveryComponent from "../component/healthRecoveryComponent";
import PropertiesComponent from "../component/propertiesComponent";
import ShipComponent from "../component/shipComponent";
import EquipmentStore from "../component/equipmentStore";
import InventoryComponent from "../component/inventoryComponent";
import LeaderboardComponent from "../component/leaderboardComponent";
import GoalsComponent from "../component/goalsComponent";
import ActiveEventBanner from "../component/activeEventBanner";
import ActivityToast from "../component/ActivityToast";

import StoryMissions from "../component/storyMissions";

import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

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
    // fetchPlayerData has to run on mount, not just on the interval below.
    // Without it a page refresh rendered whatever player object was cached
    // in localStorage and left it stale for a full poll cycle - so stats,
    // credits and story progress could all be visibly wrong for 20s after
    // any reload.
    actions.fetchPlayerData();
    actions.fetchGameData();
    actions.fetchMarketPrices();
    actions.fetchLeaderboard();
    actions.fetchActiveEvents();
    actions.fetchPriceHistory();
    actions.fetchActivityLog();
    actions.fetchNotifications();

    const intervalId = setInterval(() => {
      actions.fetchMarketPrices();
      actions.fetchPlayerData();
      actions.fetchLeaderboard();
      actions.fetchActiveEvents();
      actions.fetchPriceHistory();
      actions.fetchActivityLog();
      actions.fetchNotifications();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mt-2 container-fluid holobg">
      <ActivityToast />
      <div className="row mb-2 holo ">
        <div className="row pt-2 pb-1 m-0 justify-content-around text-center align-items-center">
          <div className="col-4">{player.name}</div>
          <LevelComponent level={player.level} />
          <ExperienceComponent experience={player.experience} xpForNextLevel={player.xpForNextLevel} />
          <LoginStreakComponent streak={player.loginStreak} />
          <WinStreakComponent streak={player.winStreak} />
          <div className="col-auto">
            <button
              className="logout-chip"
              onClick={() => actions.logout()}
              title="Log out"
            >
              logout
            </button>
          </div>
        </div>
        <div className="row pb-2 m-0 justify-content-around text-center">
          <ActiveEventBanner events={store.activeEvents} />
        </div>
      </div>

      {/* The game on the left, the live feeds in an always-visible rail on
          the right. The feeds used to be duplicated below every tab,
          starting ~800-1800px down a 900px viewport - present on every
          page and visible on none of them. */}
      <div className="row">
        <div className="col-12 col-lg-8">
          <Tabs defaultActiveKey="items" id="game-tabs">
            <Tab eventKey="items" title="Market" className="marketplace ">
              <ItemsComponent />
            </Tab>

            <Tab eventKey="inventory" title="Inventory" className="shipinside">
              <InventoryComponent />
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

            <Tab eventKey="ship" title="Ship" className="shipinside">
              <div className="mb-5 text-center">
                <ShipComponent />
              </div>
            </Tab>

            <Tab eventKey="goals" title="Goals" className="ship">
              <GoalsComponent />
            </Tab>

            <Tab eventKey="leaderboard" title="Leaderboard" className="ship">
              <LeaderboardComponent />
            </Tab>
          </Tabs>
        </div>

        <div className="col-12 col-lg-4">
          <div className="feed-rail">
            <NotificationsComponent />
            <TransactionsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
