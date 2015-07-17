import React from 'react';
import ClassNames from 'classnames';

const findParentNode = (parentClass, childObj) => {
  let testObj = childObj.parentNode;
  while (testObj && (testObj.className === undefined || testObj.className.indexOf(parentClass) === -1)) {
    testObj = testObj.parentNode;
  }
  return testObj;
};

export default class Modal extends React.Component {
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    backdrop: React.PropTypes.bool,
    keyboard: React.PropTypes.bool,
    onRequestHide: React.PropTypes.func,
    size: React.PropTypes.oneOf(['modal-lg', 'modal-sm', '']),
    children: React.PropTypes.node.isRequired
  };

  static defaultProps = {
    isOpen: false,
    backdrop: true,
    keyboard: true,
    size: ''
  };

  componentDidMount = () => {
    React.findDOMNode(this.refs.backDrop).addEventListener('click', this.handleBackDropClick);
    React.findDOMNode(this.refs.dialog).addEventListener('focus', this.handleFocus);
    React.findDOMNode(this.refs.dialog).addEventListener('blur', this.handleBlur);
    document.addEventListener('keydown', this.handleKeyDown);
    this.handleBody();
    this.handleParent();
  };

  componentWillUnmount = () => {
    React.findDOMNode(this.refs.backDrop).removeEventListener('click', this.handleBackDropClick);
    React.findDOMNode(this.refs.dialog).removeEventListener('focus', this.handleFocus);
    React.findDOMNode(this.refs.dialog).removeEventListener('blur', this.handleBlur);
    document.removeEventListener('keydown', this.handleKeyDown);
  };

  componentDidUpdate = () => {
    this.handleBody();
    this.handleParent();
  };

  requestHide = () => {
    if (this.props.onRequestHide) {
      this.props.onRequestHide();
    }
  };

  handleBackDropClick = (e) => {
    if (e.target !== e.currentTarget) return;
    if (this.props.backdrop) {
      this.requestHide();
    }
  };

  handleFocus = ()=> {
    this.focus = true;
  };

  handleBlur = () => {
    this.focus = false;
  };

  handleKeyDown = (e) => {
    if (this.props.keyboard && this.focus && e.keyCode === 27) {
      this.requestHide();
    }
  };

  handleBody = () => {
    let modalsOpen = document.getElementsByClassName('modal-backdrop-open');
    if (modalsOpen.length < 1) {
      document.body.className = document.body.className.replace(/ ?modal-open/, '');
    } else {
      if (document.body.className.indexOf('modal-open') === -1) {
        document.body.className += document.body.className.length ? ' modal-open' : 'modal-open';
      }
    }
  };

  handleParent = () => {
    let parentNode = findParentNode('modal-backdrop', React.findDOMNode(this.refs.backDrop));
    if (parentNode) {
      if (this.props.isOpen) {
        parentNode.className += parentNode.className.length ? ' children-open' : 'children-open';
      } else {
        parentNode.className = parentNode.className.replace(/ ?children-open/, '');
      }
    }
  };

  render() {
    let backDropClass = ClassNames({
      'modal-backdrop': true,
      'modal-backdrop-open': this.props.isOpen
    });
    let dialogClass = ClassNames({
      'modal-dialog': true,
      'modal-dialog-open': this.props.isOpen
    }, this.props.size);
    return (
      <div className='react-modal-wrapper'>
        <div className={backDropClass} ref='backDrop'>
          <div className={dialogClass} tabIndex='-1' ref='dialog'>
            <div className="modal-content">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
