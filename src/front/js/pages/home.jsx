import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

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

  // Ten flat tabs wrapped into four rows on a phone - a third of the
  // screen spent on navigation. Two levels cap it at two rows anywhere:
  // pick a group, then a page; each group remembers its last page.
  const TAB_GROUPS = [
    {
      name: "Trade",
      tabs: [
        { key: "items", title: "Market", bg: "marketplace", render: () => <ItemsComponent /> },
        { key: "inventory", title: "Inventory", bg: "shipinside", render: () => <InventoryComponent /> },
        { key: "properties", title: "Properties", bg: "properties", render: () => <PropertiesComponent /> },
      ],
    },
    {
      name: "Missions",
      tabs: [
        { key: "missions", title: "Missions", bg: "ship", render: () => <MissionsComponent /> },
        { key: "storyMissions", title: "Story Missions", bg: "ship", render: () => <StoryMissions /> },
      ],
    },
    {
      name: "Ship",
      tabs: [
        {
          key: "ship", title: "Ship", bg: "shipinside",
          render: () => (
            <div className="mb-5 text-center">
              <ShipComponent />
            </div>
          ),
        },
        {
          key: "equipment", title: "Equipment", bg: "shipeqp",
          render: () => (
            <div className="mb-5 text-center">
              <EquipmentStore />
            </div>
          ),
        },
        {
          key: "health", title: "Medlab", bg: "shipbed",
          render: () => (
            <div className="row mb-3 text-center">
              <HealthRecoveryComponent />
            </div>
          ),
        },
      ],
    },
    {
      name: "Progress",
      tabs: [
        { key: "goals", title: "Goals", bg: "ship", render: () => <GoalsComponent /> },
        { key: "leaderboard", title: "Leaderboard", bg: "ship", render: () => <LeaderboardComponent /> },
      ],
    },
  ];

  const [activeGroup, setActiveGroup] = useState("Trade");
  const [tabByGroup, setTabByGroup] = useState({});
  const currentGroup =
    TAB_GROUPS.find((g) => g.name === activeGroup) || TAB_GROUPS[0];
  const activeTab =
    currentGroup.tabs.find((t) => t.key === tabByGroup[activeGroup]) ||
    currentGroup.tabs[0];

  return (
    <div className="mt-2 container-fluid holobg">
      <ActivityToast />
      <div className="row mb-2 holo app-header">
        {/* Auto-width chips in a wrapping flex strip. The old version gave
            every stat a col-4 - five 33% columns plus a logout in one row,
            which collided the name into the level on any phone. */}
        <div className="header-strip pt-2 pb-1">
          <span className="stat-chip">
            <strong>{player.name}</strong>
          </span>
          <LevelComponent level={player.level} />
          <ExperienceComponent experience={player.experience} xpForNextLevel={player.xpForNextLevel} />
          <LoginStreakComponent streak={player.loginStreak} />
          <WinStreakComponent streak={player.winStreak} />
          <button
            className="logout-chip"
            onClick={() => actions.logout()}
            title="Log out"
          >
            logout
          </button>
        </div>
        <div className="row pb-2 m-0 justify-content-around text-center event-banner">
          <ActiveEventBanner events={store.activeEvents} />
        </div>
      </div>

      {/* The game on the left, the live feeds in an always-visible rail on
          the right. The feeds used to be duplicated below every tab,
          starting ~800-1800px down a 900px viewport - present on every
          page and visible on none of them. */}
      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="tab-groups" role="tablist" aria-label="Sections">
            {TAB_GROUPS.map((group) => (
              <button
                key={group.name}
                role="tab"
                data-level="group"
                aria-selected={group.name === activeGroup}
                className={group.name === activeGroup ? "active" : ""}
                onClick={() => setActiveGroup(group.name)}
              >
                {group.name}
              </button>
            ))}
          </div>
          <div className="tab-subs" role="tablist" aria-label="Pages">
            {currentGroup.tabs.map((tab) => (
              <button
                key={tab.key}
                id={`game-tabs-tab-${tab.key}`}
                role="tab"
                data-level="sub"
                aria-selected={tab.key === activeTab.key}
                className={tab.key === activeTab.key ? "active" : ""}
                onClick={() =>
                  setTabByGroup((prev) => ({ ...prev, [activeGroup]: tab.key }))
                }
              >
                {tab.title}
              </button>
            ))}
          </div>
          <div
            id={`game-tabs-tabpane-${activeTab.key}`}
            className={activeTab.bg}
            role="tabpanel"
          >
            {activeTab.render()}
          </div>
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
