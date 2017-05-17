/* eslint-disable no-console */
import React, {Component} from 'react';
import Panel from './Panel';
import panelKeys from '../../constants/panelKeys';
import {notify} from 'react-notify-toast';

class SettingsPanel extends Component {
  constructor(props) {
    super(props);

    props.parent.storageKey = panelKeys.SETTINGS_PANEL;
    this.state = {
      accessKey: null
    };
  }

  static contextTypes = {
    loginManager: React.PropTypes.object,
    lunchbadgerConfig: React.PropTypes.object,
    configStoreService: React.PropTypes.object,
    projectService: React.PropTypes.object,
    workspaceUrl: React.PropTypes.string
  };

  componentWillMount() {
    const userName = this.context.loginManager.user.profile.sub;
    this.context.configStoreService.getAccessKey(userName).then(data => {
      this.setState({
        accessKey: data.body.key
      });
    }).catch(err => {
      console.error(err);
      notify.show('Error fetching Git access key', 'error');
    });
  }

  onRegenerate = () => {
    const userName = this.context.loginManager.user.profile.sub;
    this.setState({
      accessKey: null
    });

    this.context.configStoreService.regenerateAccessKey(userName).then(data => {
      this.setState({
        accessKey: data.body.key
      });
    }).catch(err => {
      console.error(err);
      notify.show('Error regenerating Git access key', 'error');
    });
  }

  onRestartWorkspace = () => {
    this.context.projectService.restartWorkspace();
  }

  onReinstall = () => {
    this.context.projectService.reinstallDeps();
  }

  render() {
    const userName = this.context.loginManager.user.profile.sub;

    let cloneCommand;
    if (this.state.accessKey) {
      const anchor = document.createElement('a');
      anchor.href = this.context.lunchbadgerConfig.gitBaseUrl;
      anchor.pathname += `/${userName}.git`;
      anchor.username = 'git';
      anchor.password = this.state.accessKey;
      cloneCommand = `git clone ${anchor.href}`;
    } else {
      cloneCommand = '...';
    }

    return (
      <div className="panel__body">
        <div className="panel__title">
          Settings
        </div>
        <div className="details-panel__element">
          <div className="details-panel__fieldset">
            <label className="details-panel__label">
              Your application URLs
            </label>
            <div className="details-panel__static-field">
              <a href={this.context.workspaceUrl} target="_blank">
                {this.context.workspaceUrl}
              </a> (root)
              <br />
              <a href={this.context.workspaceUrl + '/explorer'} target="_blank">
                {this.context.workspaceUrl + '/explorer'}
              </a> (API explorer)
            </div>
          </div>
        </div>
        <div className="details-panel__element">
          <div className="details-panel__fieldset">
            <label className="details-panel__label">
              Access via Git
            </label>
            <div className="details-panel__static-field">
              <pre>{cloneCommand}</pre>
            </div>
            <div>
              <button onClick={this.onRegenerate}>Regenerate</button>
            </div>
          </div>
        </div>
        <div className="details-panel__element">
          <div className="details-panel__fieldset">
            <label className="details-panel__label">
              Restart application
            </label>
            <div className="details-panel__static-field">
              <button onClick={this.onRestartWorkspace}>Restart</button>
            </div>
          </div>
        </div>
        <div className="details-panel__element">
          <div className="details-panel__fieldset">
            <label className="details-panel__label">
              Reinstall dependencies
            </label>
            <div className="details-panel__static-field">
              <button onClick={this.onReinstall}>Reinstall</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Panel(SettingsPanel);
