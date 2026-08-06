import { storyMissionArc, CHARACTER_LORE, CHOICE_CALLBACKS } from "./storyArc";

const charactersImages = {
  echo: "https://res.cloudinary.com/petrep/image/upload/v1692831347/echo_cwn4qu.png",
  zuark:
    "https://res.cloudinary.com/petrep/image/upload/v1692802930/zuark_razx6x.png",
  masterZhenwu:
    "https://res.cloudinary.com/petrep/image/upload/v1692802925/zhenwu_m81rlr.png",
  ava: "https://res.cloudinary.com/petrep/image/upload/v1692802929/ava_zm3nck.png",
  axenthon:
    "https://res.cloudinary.com/petrep/image/upload/v1692802925/axenthon_fssnf5.png",
  robot:
    "https://res.cloudinary.com/petrep/image/upload/v1692802926/robotdog_ohsubw.png",
  zhalia:
    "https://res.cloudinary.com/petrep/image/upload/v1692802925/zhalia_nimfel.png",
  veran:
    "https://res.cloudinary.com/petrep/image/upload/v1692804287/veran_nfkb74.png",
  sekhmet:
    "https://res.cloudinary.com/petrep/image/upload/v1692802925/sekhmet_vnaslu.png",
  elderBinru:
    "https://res.cloudinary.com/petrep/image/upload/v1692802927/binru_uzkwsp.png",
  kazon:
    "https://res.cloudinary.com/petrep/image/upload/v1692802923/kazon_vpiakd.png",
  zerrok:
    "https://res.cloudinary.com/petrep/image/upload/v1692802930/zerrok_rkw5d9.png",
  xaezor:
    "https://res.cloudinary.com/petrep/image/upload/v1692828125/xaezor_teppem.png",
};

const defaultPlayer = {
  name: "Jahntow",
  level: 1,
  experience: 0,
  health: 100,
  energy: 100,
  credits: 5000,
  equipment: {},
  inventory: {},
  properties: {},
  maxInventoryCount: 10,
  restedEnergy: 0,
  ship: {},
  maxHealth: 100,
  maxEnergy: 100,
  maxEquipmentCount: 20,
  storyWins: 0,
  loginStreak: 0,
  prestigeLevel: 0,
  xpForNextLevel: 100,
  itemCooldowns: {},
  upgradeSteps: {},
};

const defaultGameData = {
  items: {},
  missions: {},
  storyMissions: {},
  properties: {},
  equipment: {},
  healthRecoveryItems: {},
  shipModules: {},
  shipModuleMaxLevel: 5,
};


const getState = ({ getStore, getActions, setStore }) => {
  const playerFromLocalStorage = JSON.parse(localStorage.getItem("player")) || {};
  playerFromLocalStorage.inventory = playerFromLocalStorage.inventory || {};

  const player = {
    ...defaultPlayer,
    ...playerFromLocalStorage,
  };

  const updatePlayerInLocalStorage = (player) => {
    try {
      localStorage.setItem("player", JSON.stringify(player));
    } catch (error) {
      console.error("Failed to save state in local storage", error);
      alert(
        "We are having trouble saving your game progress. This might be due to your browser's settings. If you're using incognito mode or have blocked cookies, please allow site data to be saved. Otherwise, your game progress might be lost."
      );
    }
  };

  // All game state (prices, mission outcomes, costs, rewards) is computed
  // server-side. This client only ever sends an intent ("buy 2 Alpha
  // Cores") and applies whatever player object the backend returns -
  // it never computes or sends the outcome itself.
  const apiRequest = (path, { method = "GET", body, auth = true } = {}) => {
    const token = localStorage.getItem("authToken");
    if (auth && !token) {
      return Promise.reject(new Error("Not authenticated"));
    }

    const headers = { "Content-Type": "application/json" };
    if (auth) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(process.env.BACKEND_URL + path, {
      method,
      mode: "cors",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(async (resp) => {
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 401 && auth) {
          localStorage.removeItem("authToken");
        }
        const error = new Error(data.message || `Request to ${path} failed`);
        error.status = resp.status;
        error.data = data;
        throw error;
      }
      return data;
    });
  };

  const applyPlayerResult = (data) => {
    if (data && data.player) {
      setStore({ player: data.player });
      updatePlayerInLocalStorage(data.player);
    }
    // Contract completions and achievements earned as a side effect of the
    // action (server includes them as extra_activities) toast right away -
    // every action handler funnels through here, so this one hook covers
    // missions, sells, recovery, and property buys alike.
    (data?.extra_activities || []).forEach(appendActivityEntry);
    return data;
  };

  // Appends a ready-made {id, message, type} entry to the local activity
  // list. The message/id are always server-authored now (the backend logs
  // and serializes each action's own outcome) except for reportError below,
  // whose entries can never reach the server (network errors, expired
  // auth, rate limiting) so those stay client-constructed.
  const appendActivityEntry = (entry) => {
    if (!entry) return;
    const store = getStore();
    setStore({ transactions: [entry, ...store.transactions].slice(0, 50) });
  };

  // Client-only entries (errors) use negative ids so they can never collide
  // with a server-issued (DB primary key) id.
  let clientEntryIdCounter = 0;

  // Every mutating action funnels its failures through here instead of a
  // blocking alert() - "not enough energy", "on cooldown", "insufficient
  // credits" etc. all become a toast/activity-log entry like everything
  // else, then the rejection is re-thrown so the calling component's own
  // .finally() (button spinner reset, etc.) still runs. Unlike successful
  // actions, these stay client-side - many can't reach the server at all.
  const reportError = (error, fallbackMessage) => {
    let message = error?.message || fallbackMessage;
    if (error?.status === 429 && error?.data?.retry_after_seconds != null) {
      message = `${message} Try again in ${Math.ceil(
        error.data.retry_after_seconds
      )}s.`;
    }
    appendActivityEntry({
      id: --clientEntryIdCounter,
      message: `Error: ${message}`,
      type: "error",
    });
    throw error;
  };

  return {
    store: {
      url: process.env.BACKEND_URL,
      login_token: "",

      authError: null,
      defaultPlayer: defaultPlayer,

      player: player,
      gameData: defaultGameData,
      marketPrices: [],
      priceHistory: {},
      leaderboard: [],
      leaderboardSort: "score",
      // Several category price events can be live at once now - the old
      // singular key could only ever show the newest.
      activeEvents: [],
      // Both server-authoritative now (ActivityLogEntry), fetched fresh on
      // load/poll rather than seeded from localStorage - so the log
      // follows the account across devices/browsers, not just this one.
      notifications: [],
      transactions: [],
      charactersImages: charactersImages,
      storyMissionArc: storyMissionArc,
      characterLore: CHARACTER_LORE,
      choiceCallbacks: CHOICE_CALLBACKS,
    },
    actions: {
      fetchGameData: () => {
        return apiRequest("/api/game-data", { auth: false })
          .then((gameData) => {
            setStore({ gameData });
            return gameData;
          })
          .catch((error) => {
            console.error("Error fetching game data:", error);
          });
      },

      fetchActiveEvents: () => {
        return apiRequest("/api/events/active", { auth: false })
          .then((data) => {
            setStore({ activeEvents: data.events || [] });
            return data.events;
          })
          .catch((error) => {
            console.error("Error fetching active events:", error);
          });
      },

      fetchPriceHistory: () => {
        return apiRequest("/api/market/history", { auth: false })
          .then((data) => {
            setStore({ priceHistory: data.history || {} });
            return data.history;
          })
          .catch((error) => {
            console.error("Error fetching price history:", error);
          });
      },

      fetchLeaderboard: (sort) => {
        const chosen = sort || getStore().leaderboardSort || "score";
        return apiRequest(`/api/leaderboard?sort=${chosen}`, { auth: false })
          .then((data) => {
            setStore({ leaderboard: data.players, leaderboardSort: chosen });
            return data.players;
          })
          .catch((error) => {
            console.error("Error fetching leaderboard:", error);
          });
      },

      fetchMarketPrices: () => {
        return apiRequest("/api/market/prices", { auth: false })
          .then((data) => {
            const prices = data.prices || [];
            setStore({ marketPrices: prices });
            return prices;
          })
          .catch((error) => {
            console.error("Error fetching market prices:", error);
          });
      },

      // Global price-change feed - server-computed now (economy._tick_price),
      // so it's identical for every player rather than depending on each
      // browser's own poll history. Never drives a toast (ActivityToast only
      // reads store.transactions), so a plain replace is all this needs.
      fetchNotifications: () => {
        return apiRequest("/api/notifications", { auth: false })
          .then((data) => {
            setStore({ notifications: data.entries || [] });
            return data.entries;
          })
          .catch((error) => {
            console.error("Error fetching notifications:", error);
          });
      },

      // The player's own activity history from the server - this is what
      // makes it follow the account across devices/browsers instead of
      // just this one. Merges (rather than replaces) so it doesn't clobber
      // entries this tab just appended instantly from its own actions, and
      // tags anything genuinely new-to-this-tab as "historical" so
      // ActivityToast displays it in the Recent Activity list without
      // toasting it - it's sync from elsewhere, not something that just
      // happened in front of the player.
      fetchActivityLog: () => {
        return apiRequest("/api/player/activity")
          .then((data) => {
            const store = getStore();
            const existingIds = new Set(store.transactions.map((t) => t.id));
            const merged = [
              ...(data.entries || [])
                .filter((e) => !existingIds.has(e.id))
                .map((e) => ({ ...e, historical: true })),
              ...store.transactions,
            ]
              .sort((a, b) => b.id - a.id)
              .slice(0, 50);
            setStore({ transactions: merged });
            return merged;
          })
          .catch((error) => {
            console.error("Error fetching activity log:", error);
          });
      },

      fetchPlayerData: () => {
        return apiRequest("/api/player")
          .then((data) => {
            const { offline_credits, login_streak_bonus, activities, ...player } = data;
            setStore({ player });
            updatePlayerInLocalStorage(player);
            (activities || []).forEach(appendActivityEntry);
            return player;
          })
          .catch((error) => {
            console.error("Error fetching player data:", error);
            return null;
          });
      },

      registerUser: (email, password, onSuccess) => {
        return apiRequest("/api/register", {
          method: "POST",
          auth: false,
          body: { email, password },
        })
          .then((data) => {
            if (!data.token) {
              throw new Error("Token not provided");
            }
            localStorage.setItem("authToken", data.token);
            return getActions().fetchPlayerData();
          })
          .then(() => getActions().fetchGameData())
          .then(() => getActions().fetchMarketPrices())
          .then(() => {
            setStore({ authError: null });
            if (onSuccess) onSuccess();
          })
          .catch((error) => {
            setStore({ authError: error.message });
          });
      },

      loginUser: (email, password, onSuccess) => {
        return apiRequest("/api/login", {
          method: "POST",
          auth: false,
          body: { email, password },
        })
          .then((data) => {
            if (!data.token) {
              throw new Error("Login failed");
            }
            localStorage.setItem("authToken", data.token);
            return getActions().fetchPlayerData();
          })
          .then(() => getActions().fetchGameData())
          .then(() => getActions().fetchMarketPrices())
          .then(() => {
            setStore({ authError: null });
            if (onSuccess) onSuccess();
          })
          .catch((error) => {
            console.error("Error during login process:", error);
            setStore({ authError: error.message });
          });
      },

      logout: () => {
        localStorage.setItem("player", JSON.stringify(null));
        localStorage.removeItem("authToken");

        setStore({
          player: defaultPlayer,
          gameData: defaultGameData,
          marketPrices: [],
          priceHistory: {},
          // These two were previously left stale across logout, so a
          // signed-out session kept showing the last player's leaderboard
          // and whatever event was live at the time.
          leaderboard: [],
          activeEvents: [],
          notifications: [],
          transactions: [],
        });
      },

      updatePlayerName: (name) => {
        return apiRequest("/api/player", { method: "PUT", body: { name } })
          .then(applyPlayerResult)
          .catch((error) => {
            try {
              reportError(error, "Failed to update name");
            } catch {
              // swallowed here: no caller downstream is waiting on this
              // promise's rejection, so re-throwing from reportError would
              // otherwise surface as an unhandled promise rejection.
            }
          });
      },

      prestige: () => {
        return apiRequest("/api/prestige", { method: "POST" })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to prestige"));
      },

      resetPlayer: () => {
        return apiRequest("/api/player/reset", { method: "POST" })
          .then((data) => {
            applyPlayerResult(data);
            // Notifications are global (not this player's data) and stay
            // untouched - only this player's own activity history clears,
            // matching what the backend just deleted.
            setStore({ transactions: [] });
          })
          .catch((error) => {
            console.error("Error resetting player:", error);
          });
      },

      fundWarband: (faction, volunteers) => {
        return apiRequest("/api/warband/fund", {
          method: "POST",
          body: { faction, volunteers },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to fund warband"));
      },

      kitWarband: (faction, kits) => {
        return apiRequest("/api/warband/kit", {
          method: "POST",
          body: { faction, kits },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to buy gear kits"));
      },

      provisionWarband: (faction, units) => {
        return apiRequest("/api/warband/provision", {
          method: "POST",
          body: { faction, units },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to provision warband"));
      },

      assignWarband: (faction, assignment, deployed) => {
        return apiRequest("/api/warband/assign", {
          method: "POST",
          body: { faction, assignment, deployed },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to assign warband"));
      },

      collectWarband: (faction) => {
        return apiRequest("/api/warband/collect", {
          method: "POST",
          body: { faction },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to collect report"));
      },

      outfitMission: (missionName) => {
        return apiRequest("/api/mission/outfit", {
          method: "POST",
          body: { mission_name: missionName },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to outfit mission"));
      },

      buyItem: (itemName, quantity) => {
        return apiRequest("/api/market/buy", {
          method: "POST",
          body: { item_name: itemName, quantity },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to buy item"));
      },

      sellItem: (itemName, quantity) => {
        return apiRequest("/api/market/sell", {
          method: "POST",
          body: { item_name: itemName, quantity },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to sell item"));
      },

      buyEquipment: (itemName, quantity) => {
        return apiRequest("/api/equipment/buy", {
          method: "POST",
          body: { item_name: itemName, quantity },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to buy equipment"));
      },

      sellEquipment: (itemName, quantity) => {
        return apiRequest("/api/equipment/sell", {
          method: "POST",
          body: { item_name: itemName, quantity },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to sell equipment"));
      },

      // propertyName omitted collects every property at once.
      collectProduction: (propertyName) => {
        return apiRequest("/api/properties/collect", {
          method: "POST",
          body: propertyName ? { property_name: propertyName } : {},
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to collect production"));
      },

      buyProperty: (propertyName) => {
        return apiRequest("/api/properties/buy", {
          method: "POST",
          body: { property_name: propertyName },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to purchase property"));
      },

      startMission: (missionName, repeat = 1) => {
        return apiRequest("/api/mission/start", {
          method: "POST",
          body: { mission_name: missionName, repeat },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to start mission"));
      },

      resolveStoryChoice: (choiceId, optionId) => {
        return apiRequest("/api/story/choice", {
          method: "POST",
          body: { choice_id: choiceId, option_id: optionId },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to resolve choice"));
      },

      startStoryMission: (missionName) => {
        return apiRequest("/api/story-mission/start", {
          method: "POST",
          body: { mission_name: missionName },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) =>
            reportError(error, "Failed to start story mission")
          );
      },

      useRecoveryItem: (itemName) => {
        return apiRequest("/api/recovery/use", {
          method: "POST",
          body: { item_name: itemName },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to use item"));
      },

      upgradeStat: (stat) => {
        return apiRequest("/api/upgrade", {
          method: "POST",
          body: { stat },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to upgrade"));
      },

      upgradeShipModule: (moduleId) => {
        return apiRequest("/api/ship/upgrade", {
          method: "POST",
          body: { module_id: moduleId },
        })
          .then((data) => {
            applyPlayerResult(data);
            appendActivityEntry(data.activity);
            return data;
          })
          .catch((error) => reportError(error, "Failed to install module"));
      },
    },
  };
};

export default getState;
