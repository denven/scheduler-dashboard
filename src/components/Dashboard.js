import React, { Component } from "react";
import classnames from "classnames";
import Loading from "components/Loading"
import Panel from "components/Panel";
import axios from "axios";

import { getTotalInterviews,
 getLeastPopularTimeSlot,
 getMostPopularDay,
 getInterviewsPerDay
} from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {
  
  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
  };

  // constructor(props) {
  //   super(props);
  //   this.selectPanel = this.selectPanel.bind(this);
  // }

  // This is for using function to setState, and now we are using class
  // const [state, setState] = React.useState({focused: null});
  
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    Promise.all([axios.get("/api/days"), axios.get("/api/appointments"), axios.get("/api/interviewers") ])
    .then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });

  };

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
    console.log(this.state)
  };

  selectPanel = (id) => {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  };

  render() {
    const dashboardClasses = classnames("dashboard", {"dashboard--focused": this.state.focused});
    const panels = data
        .filter(
          panel => this.state.focused === null || this.state.focused === panel.id
        )
        .map(panel => {
              return (
              <Panel 
                key = {panel.id}
                label = {panel.lable}
                value = {panel.getValue(this.state)}
                onSelect={ event => this.selectPanel(panel.id) }
              />)
            });

    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <main className={dashboardClasses}> 
        {panels}    
      </main>
    );
  }
}

export default Dashboard;



