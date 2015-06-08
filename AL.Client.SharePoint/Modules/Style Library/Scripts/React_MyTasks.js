//! require('react')
//! require('SPReact.js', 'SPReact')
var React_MyTasks=function(){var a=React.createClass({displayName:"MyTasksDisplay",getInitialState:function(){return{listName:null,listData:[],errorMessage:null}},getDefaultProps:function(){return{listName:null,listData:[],errorMessage:null}},componentWillReceiveProps:function(a){this.setState({listName:a.listName,listData:a.listData,errorMessage:a.errorMessage})},render:function(){return React.createElement("div",{className:"panel panel-primary"},React.createElement("div",{className:"panel-heading"},React.createElement("h3",{className:"panel-title"},this.state.listName)),React.createElement("div",{className:"panel-body"},this.state.errorMessage?React.createElement("div",{className:"alert alert-danger"},this.state.errorMessage):null,0===this.state.listData.length?React.createElement("div",{className:"alert alert-info"},"No list data"):React.createElement("table",{className:"table"},React.createElement("tr",null,React.createElement("th",null,"Title"),React.createElement("th",null,"Assigned To")),this.state.listData.map(function(a,b){return React.createElement("tr",{key:b},React.createElement("td",null,a.Title),React.createElement("td",null,React.createElement(SPReact.User,{users:a.AssignedToId})))}))))}}),b=React.createClass({displayName:"MyTasksEdit",getInitialState:function(){return{listName:null,onSaveStatus:null}},getDefaultProps:function(){return{listName:null,onSave:function(){}}},componentWillReceiveProps:function(a){this.setState({listName:a.listName})},render:function(){return React.createElement("div",null,React.createElement("div",{className:"row"},React.createElement("div",{className:"col-md-5"},React.createElement("input",{type:"text",className:"form-control",placeholder:"List name...",value:this.state.listName,onChange:this.onListNameChange})),React.createElement("div",{className:"col-md-5"},React.createElement("input",{type:"button",className:"btn btn-primary",value:"Save changes",onClick:this.onSave}))),React.createElement("div",{className:"row"},null===this.state.onSaveStatus?null:React.createElement("div",{className:"col-md-5"},"success"===this.state.onSaveStatus?React.createElement("div",{className:"alert alert-success"},"Save successful"):React.createElement("div",{className:"alert alert-danger"},"Error saving list name"))))},onListNameChange:function(a){var b=a.target.value;this.setState({listName:b})},onSave:function(){this.props.onSave(this.state.listName,this.onSaveCallback.bind(this))},onSaveCallback:function(a){var b=this;this.setState({onSaveStatus:a?"failure":"success"},function(){"success"===b.state.onSaveStatus&&setTimeout(function(){window.location=window.location.href},5e3)})}}),c=React.createClass({displayName:"MyTasks",getInitialState:function(){return{listName:null,listData:[],errorMessage:null,editMode:!1,onSave:function(){}}},render:function(){return React.createElement("div",{className:"container-fluid"},this.state.editMode?React.createElement(b,{listName:this.state.listName,onSave:this.state.onSave}):React.createElement(a,{listName:this.state.listName,listData:this.state.listData,errorMessage:this.state.errorMessage}))}}),d={modulePlaceholder:!0};return d.exports=c}();