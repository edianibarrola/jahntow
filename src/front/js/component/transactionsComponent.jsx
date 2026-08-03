import React, { useContext } from "react";
import { Context } from "../store/appContext";

const TransactionsComponent = () => {
  const { store } = useContext(Context);
  const { transactions } = store;

  return (
    <div className="scrolldiv holo">
      <div>
        <h2>Recent Transactions:</h2>
        <ul>
          {transactions.map((transaction, i) => (
            <li key={i}>{transaction}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionsComponent;
