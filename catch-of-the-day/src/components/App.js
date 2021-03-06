import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import Fish from "./Fish";
import sampleFishes from "../sample-fishes";
import base from "../base";

class App extends React.Component {
  // Set initial state
  state = {
    fishes: {},
    order: {}
  };

  static propTypes = {
    match: PropTypes.object
  }

  componentDidMount() {
    const { params } = this.props.match;
    // First we need to reinstate our localStorage. Otherwise order data stored in localStorage is not persistent
    const localStorageRef = localStorage.getItem(params.storeid);
    console.log(localStorageRef);
    if (localStorageRef) {
      this.setState({order: JSON.parse(localStorageRef)})
    };
    this.ref = base.syncState(`${params.storeid}/fishes`, {
      context: this,
      state: "fishes"
    });
  };

  componentDidUpdate() {
    console.log(this.state.order);
    localStorage.setItem(this.props.match.params.storeid, JSON.stringify(this.state.order));
  };

  componentWillUnmount() {
    base.removeBinding(this.ref);
  };
  
  addFish = (fish) => {
    // 1. Take a copy of existing state
    const fishes = {...this.state.fishes};
    // 2. Add a new fish to this.state.fishes
    fishes[`fish${Date.now()}`] = fish;
    this.setState({fishes: fishes});
  };

  updateFish = (key, updatedFish) => {
    // 1. take copy of current state
    const fishes = {...this.state.fishes};
    // 2. update state
    fishes[key] = updatedFish;
    // 3. Set this updated version to state
    this.setState({fishes});
  };

  deleteFish = (key) => {
    // 1. Take a copy of state
    const fishes = {...this.state.fishes};
    // 2. Update the state
    fishes[key] = null;
    // 3. Update state
    this.setState({fishes});
  };

  loadSampleFishes = () => {
    this.setState({fishes: sampleFishes})
  };

  addToOrder = (key) => {
    // 1. Take a copy of state
    const order = {...this.state.order};
    // 2. Add to order or update quantity of ordered item
    order[key] = order[key] + 1 || 1;
    // 3. update order object in state
    this.setState({order: order});
  };

  deleteFromOrder = (key) => {
    // 1. Take a copy of state
    const order = {...this.state.order};
    // 2. Remove from order
    delete order[key];
    // 3. update order object in state
    this.setState({order});
  };

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Errday" />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key => (
            <Fish
              key={key}
              index={key}
              details={this.state.fishes[key]}
              addToOrder={this.addToOrder}
            />
            ))}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          deleteFromOrder={this.deleteFromOrder}
        />
        <Inventory
          addFish={this.addFish}
          loadSampleFishes={this.loadSampleFishes}
          fishes={this.state.fishes}
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
        />
      </div>
    );
  };
};

export default App;
