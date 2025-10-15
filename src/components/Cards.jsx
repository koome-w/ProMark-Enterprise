import React from "react";

const Cards = () => {
  const data = [
    { title: "Total Products", value: "2,503" },
    { title: "Products Out of Stock", value: "13" },
    { title: "Products Expired", value: "0" },
  ];

  return (
    <div className="cards">
      {data.map((card, index) => (
        <div className="card" key={index}>
          <h3>{card.title}</h3>
          <p>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
