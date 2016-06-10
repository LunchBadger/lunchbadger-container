import React, {PropTypes, Component} from 'react';
import BasePlan from './BasePlan';
import UpgradeSlider from './UpgradeSlider';
import UserPoolSlider from './UserPoolSlider';
import ForecastPlanDetails from './ForecastPlanDetails';
import UserPool from './UserPool';
import addPlan from 'actions/APIForecast/addPlan';
import './ForecastPlans.scss';
import numeral from 'numeral';
import moment from 'moment';
import classNames from 'classnames';

export default class ForecastPlans extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    selectedDate: PropTypes.string.isRequired,
    handleUpgradeCreation: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      currentPlan: null
    };
  }

  _setCurrentPlan(plan) {
    if (this.state.currentPlan && this.state.currentPlan.id === plan.id) {
      this._handlePlanClose();
    } else {
      this._handlePlanOpen(plan);
    }
  }

  _handleAddPlan() {
    addPlan(this.props.entity, {name: 'Super whale', icon: 'fa-space-shuttle'});
  }

  _handlePlanOpen(plan) {
    this.setState({currentPlan: plan});
  }

  _handlePlanClose() {
    this.setState({currentPlan: null});
  }

  renderPlans() {
    const {entity, selectedDate} = this.props;
    const planClass = classNames({
      'forecast-plans__plan': true,
      'forecast-plans__plan--expanded': this.state.currentPlan
    });

    return entity.api.plans.map((plan, index) => {
      const planDetail = plan.findDetail({date: selectedDate});
      let userCount = 0;

      if (planDetail) {
        userCount = planDetail.subscribers.sum;
      }

      return (
        <div className={planClass} key={`plan_${index}`}>
          <span className="forecast-plans__plan__name">{plan.name}</span>
          <BasePlan key={plan.id}
                    index={index}
                    forecast={entity}
                    date={selectedDate}
                    plan={plan}
                    handleUpgradeCreation={this.props.handleUpgradeCreation.bind(this)}
                    isCurrent={this.state.currentPlan && this.state.currentPlan.id === plan.id}
                    handleClick={() => this._setCurrentPlan(plan)}/>
            <span className="forecast-plans__plan__users">
              {numeral(userCount).format('0,0')} users
            </span>
        </div>
      );
    });
  }

  renderUpgrades(upgrades) {
    return upgrades.map((upgrade) => {
      if (upgrade.fromPlanId === null || upgrade.toPlanId === null) {
        return (
          <UserPoolSlider key={upgrade.id}
                          upgrade={upgrade}
                          upgrades={upgrades}
                          forecast={this.props.entity}/>
        );
      }

      return (
        <UpgradeSlider key={upgrade.id}
                       upgrades={upgrades}
                       upgrade={upgrade}
                       forecast={this.props.entity}/>
      );
    });
  }

  render() {
    const {entity, selectedDate} = this.props;
    const upgrades = entity.api.getUpgradesForDate(this.props.selectedDate);
    const date = moment(selectedDate, 'M/YYYY');

    return (
      <div className="forecast-plans">
        {
          date.isAfter(moment(), 'month') && (
            <div className="forecast-plans__pool">
              <UserPool forecast={entity}
                        date={selectedDate}/>
            </div>
          )
        }

        <div className="forecast-plans__list">
          {this.renderPlans()}
        </div>

        {
          date.isAfter(moment(), 'month') && (
            <div className="forecast-plans__action">
              <a className="forecast-plans__action__add" onClick={this._handleAddPlan.bind(this)}>
                <i className="fa fa-plus"/>
              </a>
            </div>
          )
        }

        <div className="forecast-plans__details">
          <ForecastPlanDetails plan={this.state.currentPlan}/>
        </div>

        {
          upgrades.length > 0 && (
            <div className="forecast-plans__upgrades">
              {this.renderUpgrades(upgrades)}
            </div>
          )
        }
      </div>
    );
  }
}
