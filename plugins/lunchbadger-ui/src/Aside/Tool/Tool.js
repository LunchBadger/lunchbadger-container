import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import SubmenuItem from './SubmenuItem';
import {IconSVG} from '../../';
import './Tool.scss';

class Tool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
  }

  toggleOpen = opened => this.setState({opened});

  onClick = () => {
    const {onClick, submenu} = this.props;
    if (submenu.length === 0) {
      onClick();
    } else {
      this.toggleOpen(true);
    }
  }

  onMenuItemClick = () => this.toggleOpen(false);

  render() {
    const {children, icon, selected, onClick, submenu, plain} = this.props;
    const {opened} = this.state;
    const style = {
      width: '100%',
      height: '100%',
      border: 'none',
      padding: 0,
    };
    const isSubmenu = submenu.length > 0;
    const Button = (
      <IconButton style={style}>
        <IconSVG className="Tool__icon" svg={icon} />
      </IconButton>
    );
    return (
      <div
        className={cs('Tool', {opened, selected})}
        onClick={this.onClick}
      >
        {isSubmenu && (
          <IconMenu
            style={style}
            iconButtonElement={Button}
            open={opened}
            onRequestChange={this.toggleOpen}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            targetOrigin={{vertical: 'top', horizontal: 'left'}}
          >
            {submenu.map((props, idx) => (
              <SubmenuItem
                key={idx}
                {...props}
                onMenuItemClick={this.onMenuItemClick}
                plain={plain}
              />
            ))}
          </IconMenu>
        )}
        {!isSubmenu && Button}
      </div>
    );
  }
}

Tool.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  submenu: PropTypes.array,
  plain: PropTypes.bool,
};

Tool.defaultProps = {
  submenu: [],
};

export default Tool;
