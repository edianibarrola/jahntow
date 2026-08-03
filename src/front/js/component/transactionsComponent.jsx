import React, { useContext } from "react";
import { Context } from "../store/appContext";

const TransactionsComponent = () => {
  const { store } = useContext(Context);
  const { transactions } = store;

  return (
    <div className="scrolldiv holo">
      <div>
        <h2>Recent Activity:</h2>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>{transaction.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionsComponent;
