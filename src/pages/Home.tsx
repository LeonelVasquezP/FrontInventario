import React from "react";
// import CardItems from "../components/CardItem";

type Item = {
  title: string;
  description: string;
};

type HomeProps = {
  items: Item[];
};

function Home({ items }: HomeProps) {
  return (
    <div className="container bg-primary pt-5">
      <div className="row">
        {items.map((item, index) => (
          <div className="col-md-4 mb-4" key={index}>
        
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
