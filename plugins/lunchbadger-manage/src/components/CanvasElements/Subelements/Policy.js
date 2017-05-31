import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {EntityProperty} from '../../../../../lunchbadger-ui/src';
import './Policy.scss';

const {Input} = LunchBadgerCore.components;

export default class Policy extends Component {
  static propTypes = {
    policy: PropTypes.object.isRequired,
    pipelineIndex: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {policy, pipelineIndex, index, isDelta} = this.props;
    const hiddenInputs = [
      {
        name: `pipelines[${pipelineIndex}][policies][${index}][id]`,
        value: policy.id,
      },
      {
        name: `pipelines[${pipelineIndex}][policies][${index}][type]`,
        value: policy.type,
      },
    ];
    return (
      <EntityProperty
        name={`pipelines[${pipelineIndex}][policies][${index}][name]`}
        value={policy.name}
        hiddenInputs={hiddenInputs}
        isDelta={isDelta}
      />
    );
  }
}
