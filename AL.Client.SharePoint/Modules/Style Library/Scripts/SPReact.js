//! require('sp.js', 'sp')
//! require('deferred.js', 'deferred')
//! require('react')
var SPReact=function(){var a={};return a.UserPresence=React.createClass({displayName:"UserPresence",getDefaultProps:function(){return{users:[]}},getInitialState:function(){var a=Array.isArray(this.props.users)?this.props.users:this.props.users.results?this.props.users.results:[this.props.users];return{users:a,userHtml:[]}},componentWillReceiveProps:function(a){var b=Array.isArray(a.users)?a.users:a.users.results?a.users.results:[a.users];this.setState({users:b})},componentDidUpdate:function(){if(!this.state.selfUpdate){var a=this,b=this.state.users.map(function(a){return sp.csom.user.renderUserPresence(a)});deferred.all(b).done(function(){var b=Array.prototype.slice.call(arguments);a.state.selfUpdate=!0,a.setState({userHtml:b},function(){ProcessImn(),a.state.selfUpdate=!1})})}},componentDidMount:function(){this.componentDidUpdate()},render:function(){return React.createElement("div",null,this.state.userHtml.map(function(a){return React.createElement("div",{dangerouslySetInnerHTML:{__html:a[0]}})}))}}),a.PeoplePicker=React.createClass({displayName:"PeoplePicker",getDefaultProps:function(){return{users:[],onUpdate:function(){}}},getInitialState:function(){return{users:this.props.users}},componentWillReceiveProps:function(a){this.setState({users:a.users})},shouldComponentUpdate:function(a,b){for(var c=!(b.users.length===this.state.users.length),d=0;d<b.users.length&&!c;d++)c=b.users[d]!==this.state.users[d];return c},componentDidUpdate:function(){var a=this,b=React.findDOMNode(this);b.innerHTML="",sp.controls.peoplePicker(b,function(b){a.props.onUpdate(b)},this.state.users)},componentDidMount:function(){this.componentDidUpdate()},render:function(){return React.createElement("div",null)}}),"undefined"!=typeof exports&&exports(a),a}();