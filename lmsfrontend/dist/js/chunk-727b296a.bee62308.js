(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-727b296a"],{1348:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("body",[s("div",{staticClass:"main"},[s("router-link",{attrs:{to:"/register"}}),s("router-view"),s("div",{staticClass:"form-container"},[s("form",{staticClass:"registration-form",attrs:{id:"registration-form signup-form",method:"POST"},on:{submit:function(t){return t.preventDefault(),e.register(t)}}},[s("h2",[e._v("Sign Up to LiTT LMS")]),s("div",{staticClass:"form-group-1"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.firstname,expression:"firstname"}],staticClass:"input-container",attrs:{type:"text",name:"fname",id:"name",placeholder:"First Name",required:""},domProps:{value:e.firstname},on:{input:function(t){t.target.composing||(e.firstname=t.target.value)}}}),s("input",{directives:[{name:"model",rawName:"v-model",value:e.lastname,expression:"lastname"}],staticClass:"input-container",attrs:{type:"text",name:"lname",id:"name",placeholder:"Last Name",required:""},domProps:{value:e.lastname},on:{input:function(t){t.target.composing||(e.lastname=t.target.value)}}}),s("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],staticClass:"input-container",attrs:{type:"email",name:"email",id:"email",placeholder:"Email",required:""},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value)}}}),s("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],staticClass:"input-container",attrs:{type:"password",name:"password",id:"password",placeholder:"Password",required:""},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}}),s("input",{directives:[{name:"model",rawName:"v-model",value:e.confirm_password,expression:"confirm_password"}],staticClass:"input-container",attrs:{type:"password",name:"password",id:"password",placeholder:"Confirm Password",error:!e.valid(),required:""},domProps:{value:e.confirm_password},on:{input:function(t){t.target.composing||(e.confirm_password=t.target.value)}}})]),e._m(0),s("div",{staticClass:"form-submit",on:{submit:function(t){return t.preventDefault(),e.register(t)}}},[s("input",{staticClass:"submit",attrs:{type:"submit",name:"submit",id:"submit",value:"Sign Up"},on:{submit:function(t){return t.preventDefault(),e.register(t)}}})])])])],1)])},r=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"form-check"},[s("input",{staticClass:"agree-term",attrs:{type:"checkbox",name:"agree-term",id:"agree-term"}}),s("label",{staticClass:"label-agree-term",attrs:{for:"agree-term"}},[s("span",[s("span")]),e._v("I agree to the "),s("a",{staticClass:"term-service",attrs:{href:"#"}},[e._v("Terms and Conditions")])])])}],i={name:"Register",data:function(){return{alertUser:!1,errinfo:"",firstname:"",lastname:"",email:"",password:"",confirm_password:"",student_type:"",userExists:!1,submitted:!1}},methods:{formEvent:function(){var e,t=document.getElementsByClassName("closebtn");for(e=0;e<t.length;e++)t[e].onclick=function(){var e=this.parentElement;e.style.opacity="0",setTimeout((function(){e.style.display="none"}),600)};this.alertUser=!1},register:function(){var e=this;this.valid()?this.$store.dispatch("userRegister",{firstname:this.firstname,lastname:this.lastname,email:this.email,password:this.password,student_type:"individual"}).then((function(t){var s=t.status;console.log("check your email"),console.log(s),e.$router.push({name:"Signin"})})).catch((function(t){e.errinfo="Email is already registered",console.log(t),e.userExists=!0,e.alertUser=!0})):(this.alertUser=!0,this.password="",this.confirm_password="")},valid:function(){return this.password!=this.confirm_password?(this.errinfo="passwords don't match",!1):!(this.password.length<=10)||(this.errinfo="password is too weak",!1)}}},n=i,o=(s("c75b"),s("2877")),m=Object(o["a"])(n,a,r,!1,null,"f2dea2e2",null);t["default"]=m.exports},3902:function(e,t,s){},c75b:function(e,t,s){"use strict";var a=s("3902"),r=s.n(a);r.a}}]);
//# sourceMappingURL=chunk-727b296a.bee62308.js.map